import CV from './cv';

var AR = {};

AR.Marker = function (id, corners) {
  this.id = id;
  this.corners = corners;
};

AR.Detector = function () {
  this.grey = new CV.Image();
  this.thres = new CV.Image();
  this.homography = new CV.Image();
  this.binary = [];
  this.contours = [];
  this.polys = [];
  this.candidates = [];
};

AR.Detector.prototype.detect = function (image) {
  CV.grayscale(image, this.grey);
  CV.adaptiveThreshold(this.grey, this.thres, 2, 7);

  this.contours = CV.findContours(this.thres, this.binary);

  this.candidates = this.findCandidates(this.contours, image.width * 0.20, 0.05, 10);
  this.candidates = this.clockwiseCorners(this.candidates);
  this.candidates = this.notTooNear(this.candidates, 10);

  return this.findMarkers(this.grey, this.candidates, 49);
};

// 寻找候选四边形
AR.Detector.prototype.findCandidates = function (contours, minSize, epsilon, minLength) {
  var candidates = [], len = contours.length, contour, poly, i;

  this.polys = [];

  for (i = 0; i < len; ++i) {
    contour = contours[i];

    if (contour.length >= minSize) {
      poly = CV.approxPolyDP(contour, contour.length * epsilon);

      this.polys.push(poly);

      if ((poly.length === 4) && CV.isContourConvex(poly)) {

        if (CV.minEdgeLength(poly) >= minLength) {
          candidates.push(poly);
        }
      }
    }
  }

  return candidates;
};

// 对点进行顺时针排序
AR.Detector.prototype.clockwiseCorners = function (candidates) {
  var len = candidates.length, dx1, dx2, dy1, dy2, swap, i;

  for (i = 0; i < len; ++i) {
    dx1 = candidates[i][1].x - candidates[i][0].x;
    dy1 = candidates[i][1].y - candidates[i][0].y;
    dx2 = candidates[i][2].x - candidates[i][0].x;
    dy2 = candidates[i][2].y - candidates[i][0].y;

    if ((dx1 * dy2 - dy1 * dx2) < 0) {
      swap = candidates[i][1];
      candidates[i][1] = candidates[i][3];
      candidates[i][3] = swap;
    }
  }

  return candidates;
};

AR.Detector.prototype.notTooNear = function (candidates, minDist) {
  var notTooNear = [], len = candidates.length, dist, dx, dy, i, j, k;

  for (i = 0; i < len; ++i) {

    for (j = i + 1; j < len; ++j) {
      dist = 0;

      for (k = 0; k < 4; ++k) {
        dx = candidates[i][k].x - candidates[j][k].x;
        dy = candidates[i][k].y - candidates[j][k].y;

        dist += dx * dx + dy * dy; // 对应点的距离
      }

      // 计算两个四边之间对应点距离的平均值
      if ((dist / 4) < (minDist * minDist)) {
        // 排除边长更小的四边形
        if (CV.perimeter(candidates[i]) < CV.perimeter(candidates[j])) {
          candidates[i].tooNear = true;
        } else {
          candidates[j].tooNear = true;
        }
      }
    }
  }

  for (i = 0; i < len; ++i) {
    if (!candidates[i].tooNear) {
      notTooNear.push(candidates[i]);
    }
  }

  return notTooNear;
};

AR.Detector.prototype.findMarkers = function (imageSrc, candidates, warpSize) {
  var markers = [], len = candidates.length, candidate, marker, i;

  for (i = 0; i < len; ++i) {
    candidate = candidates[i];

    CV.warp(imageSrc, this.homography, candidate, warpSize);

    CV.threshold(this.homography, this.homography, CV.ostu(this.homography));

    marker = this.getMarker(this.homography, candidate);
    if (marker) {
      markers.push(marker);
    }
  }

  return markers;
};

AR.Detector.prototype.getMarker = function (imageSrc, candidate) {
  var width = (imageSrc.width / 7) >>> 0,
    minZero = (width * width) >> 1,
    bits = [], rotations = [], distances = [],
    square, pair, inc, i, j;

  // 验证周围黑色轮廓变
  for (i = 0; i < 7; ++i) {
    inc = (0 === i || 6 === i) ? 1 : 6;

    for (j = 0; j < 7; j += inc) {
      square = { x: j * width, y: i * width, width: width, height: width };
      if (CV.countNonZero(imageSrc, square) > minZero) {
        return null;
      }
    }
  }

  // 识别内边5x5编码区域
  for (i = 0; i < 5; ++i) {
    bits[i] = [];

    for (j = 0; j < 5; ++j) {
      square = { x: (j + 1) * width, y: (i + 1) * width, width: width, height: width };

      bits[i][j] = CV.countNonZero(imageSrc, square) > minZero ? 1 : 0;
    }
  }

  rotations[0] = bits;
  distances[0] = this.hammingDistance(rotations[0]);

  pair = { first: distances[0], second: 0 };

  for (i = 1; i < 4; ++i) {
    rotations[i] = this.rotate(rotations[i - 1]);
    distances[i] = this.hammingDistance(rotations[i]);

    if (distances[i] < pair.first) {
      pair.first = distances[i];
      pair.second = i;
    }
  }

  if (0 !== pair.first) {
    return null;
  }

  return new AR.Marker(
    this.mat2id(rotations[pair.second]),
    this.rotate2(candidate, 4 - pair.second)
  );
};

// 海明距离计算 对每个可能的标记方向找到海明距离，和参考标识一致的为0,其他旋转形式的标记不为0,因为经过透射变换后，只能得到四个方向的标记，则旋转四次，找到和参考标识一致的方向
AR.Detector.prototype.hammingDistance = function (bits) {
  var ids = [
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [0, 1, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  dist = 0, sum, minSum, i, j, k;

  for (i = 0; i < 5; ++i) {
    minSum = Infinity;

    for (j = 0; j < 4; ++j) {
      sum = 0;

      for (k = 0; k < 5; ++k) {
        sum += bits[i][k] === ids[j][k] ? 0 : 1;
      }

      if (sum < minSum) {
        minSum = sum;
      }
    }

    dist += minSum;
  }

  return dist;
};

AR.Detector.prototype.mat2id = function (bits) {
  var id = 0, i;

  for (i = 0; i < 5; ++i) {
    id <<= 1;
    id |= bits[i][1];
    id <<= 1;
    id |= bits[i][3];
  }

  return id;
};

AR.Detector.prototype.rotate = function (src) {
  var dst = [], len = src.length, i, j;

  for (i = 0; i < len; ++i) {
    dst[i] = [];
    for (j = 0; j < src[i].length; ++j) {
      dst[i][j] = src[src[i].length - j - 1][i];
    }
  }

  return dst;
};

AR.Detector.prototype.rotate2 = function (src, rotation) {
  var dst = [], len = src.length, i;

  for (i = 0; i < len; ++i) {
    dst[i] = src[(rotation + i) % len];
  }

  return dst;
};

export default AR;
