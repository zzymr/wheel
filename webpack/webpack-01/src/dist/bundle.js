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
          require('./index.js')
      })(undefined)