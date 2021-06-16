// exports.default = function(a,b) {return a + b}

exports = {}
eval('exports.default = function(a,b) {return a + b}') // node文件读取后的代码字符串
exports.default(1,3)