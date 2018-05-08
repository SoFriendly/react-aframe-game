export function parse(search) {
  var result = {};
  if (search) {
    var query = search.substring(1);
    var arr = query.split('&');
    arr.forEach(item => {
      var pair = item.split('=');
      if (pair.length === 2) {
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        result[key] = value;
      }
    });
  }
  return result;
}
