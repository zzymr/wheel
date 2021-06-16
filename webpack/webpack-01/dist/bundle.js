(function (graph) {
          function require(file) {
              function absRequire(relPath) {
                  return require(graph[file].deps[relPath])
              }
              var exports = {};
              (function (require,exports,code) {
                  eval(code)
              })(absRequire,exports,graph[file].code)
              return exports
          }
          require('./src/index.js')
      })({"./src/index.js":{"deps":{"./add.js":"./src/add.js"},"code":"\"use strict\";\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log((0, _add[\"default\"])(1, 2));"},"./src/add.js":{"deps":{},"code":"\"use strict\";\n\n// exports.default = function(a,b) {return a + b}\nexports = {};\neval('exports.default = function(a,b) {return a + b}'); // node文件读取后的代码字符串\n\nexports[\"default\"](1, 3);"}})