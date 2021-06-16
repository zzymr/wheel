const fs = require('fs');
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

/**
 * 获取module信息
 * @param {*} file 
 * @returns 
 */
function getModuleInfo(file) {
    // 读取文件
    const body = fs.readFileSync(file, "utf-8");

    // 转AST语法树
    const ast = parser.parse(body, {
        sourceType: "module", // 表示要解析的是ES模块
    })
    // 依赖收集
    const deps = {};
    traverse(ast, {
        // visitor函数
        ImportDeclaration({ node }) {
            console.log('node:', node);
            const dirname = path.dirname(file);
            const abspath = "./" + path.join(dirname, node.source.value);
            deps[node.source.value] = abspath;
        }
    })

    // ES6转ES5
    const { code } = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"],
    })
    const moduleInfo = { file, deps, code };
    return moduleInfo;
}
/**
 * 模块解析
 * @param {*} file 
 */
function parseModules(file) {
    const entry = getModuleInfo(file);
    const temp = [entry];
    const depsGraph = {};

    getDeps(temp, entry);

    temp.forEach((info) => {
        depsGraph[info.file] = {
            deps: info.deps,
            code: info.code,
        }
    })
    return depsGraph;
}
/**
 * 获取依赖
 * @param {*} temp 
 * @param {*} param1 
 */
function getDeps(temp, { deps }) {
    Object.keys(deps).forEach((key) => {
        const child = getModuleInfo(deps[key]);
        temp.push(child);
        getDeps(temp, child);
    });
}
/**
 * 生成bundle文件
 * @param {*} file 
 * @returns 
 */
function bundle(file) {
    const depsGraph = JSON.stringify(parseModules(file));
    return `(function (graph) {
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
          require('${file}')
      })(${depsGraph})`;
}
const content = bundle("./src/index.js");
!fs.existsSync("./dist") && fs.mkdirSync("./dist");
fs.writeFileSync("./dist/bundle.js", content);
// const info = getModuleInfo("./index.js");
// console.log("info:", info);