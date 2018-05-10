## aframe-react-game

Building virtual reality experiences with
[A-Frame](https://aframe.io) and React with
[aframe-react](https://github.com/ngokevin/aframe-react).

### Installation

To get started:

```bash
npm install
npm start
```

### Notice

#### build fails to minify

In order to support minify ES6 code, replace `webpack.optimize.UglifyJsPlugin` in `node_modules/react-scripts/config/webpack.config.prod.js`  Line:294

```js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// ...

new UglifyJsPlugin({
  uglifyOptions: {
    compress: {
      warnings: false,
      comparisons: false,
    },
    mangle: {
      safari10: true,
    },
    output: {
      comments: false,
      ascii_only: true,
    }
  },
  sourceMap: shouldUseSourceMap,
})
```
