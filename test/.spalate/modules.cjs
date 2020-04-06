// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"tags/app.tag":[function(require,module,exports) {
const riot = require('riot');

riot.tag2('app', '<h1>{title}</h1> <div class="p16"> <div class="s64 bg-red"></div> </div> <ul class="ml32"> <li>isNode: {isNode}</li> <li>isBrowser: {isBrowser}</li> <li each="{item in [1, 2, 3, 4]}" item="{item}"> {item} aaa bbb ccc </li> </ul> <div> <img src="/images/kenkyo.png"> </div>', '', 'class="p16"', function (opts) {
  this.title = 'Hello, spalate with parcel!';
});
},{}],"tags/*.tag":[function(require,module,exports) {
module.exports = {
  "app": require("./app.tag")
};
},{"./app.tag":"tags/app.tag"}],"tags/**/*.tag":[function(require,module,exports) {
module.exports = {
  "app": require("./../app.tag")
};
},{"./../app.tag":"tags/app.tag"}],"index.js":[function(require,module,exports) {
"use strict";

var _underscore = _interopRequireDefault(require("underscore"));

var _riot = _interopRequireDefault(require("riot"));

var _firerest = _interopRequireDefault(require("firerest"));

require("./tags/*.tag");

require("./tags/**/*.tag");

var _browserOrNode = require("browser-or-node");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('index.js: ユーザー定義のファイルが呼び出されたよ');
global.isBrowser = _browserOrNode.isBrowser;
global.isNode = _browserOrNode.isNode;
console.log('isNode', _browserOrNode.isNode);
console.log('isBrowser', _browserOrNode.isBrowser);
console.log('--------------------');

if (!_browserOrNode.isNode) {
  _riot.default.mount('*');
} // export default {
//   riot,
//   _,
// };


global.riot = _riot.default;
global._ = _underscore.default;
},{"./tags/*.tag":"tags/*.tag","./tags/**/*.tag":"tags/**/*.tag"}]},{},["index.js"], "spalate")