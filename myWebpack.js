const fs = require('fs')
const traverse = require('@babel/traverse').default
const parser = require('@babel/parser')
const path = require('path');
const babel = require("@babel/core");
const getCode = (entry) => {
    const code = fs.readFileSync(entry, "utf8")
    const dirname = path.dirname(entry);  //获取当前文件所在的目录
    const ast = parser.parse(code, {
        sourceType: 'module'
    })
    const deps = {};// 获取依赖
    traverse(ast, {
        ImportDeclaration(p) {
            const importPath = p.get('source').node.value;
            const asbPath = "./" + path.join(dirname, importPath) + '.js'// 设置绝对地址
            deps[importPath] = asbPath;// 存储依赖的所有地址
        }
    })
    const {code:transCode} = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    })
    return { entry, deps, transCode };
}
const cycleGetCode = (entry) => { // 循环获取所有的
    const entryInfo = getCode(entry)
    const allInfo = [entryInfo];
    const recycleGetDeps = (deps, modules) => {
        Object.keys(deps).forEach((key) => {
            const info = getCode(deps[key]);
            modules.push(info); // 将所有依赖全部变成一个以为的数组放在一起
            if(info.deps && Object.keys(info.deps).length) cycleGetCode(info.deps,modules)
        });
    };
    recycleGetDeps(entryInfo.deps, allInfo);
    const webpack_modules = {};
    allInfo.forEach((item) => {
        webpack_modules[item.entry] = {
            deps: item.deps,
            code: item.transCode,
        };
    });
    return webpack_modules
}
const webpack_modules = cycleGetCode("./src/index.js");
const writeFunction = `((content)=>{
    const require = (path) => {
        const getSrcPath = (p) => {
            const srcPath = content[path].deps[p];
            return require(srcPath)
        }
        const exports = {};
        ((require)=>{
            eval(content[path].code)
        })(getSrcPath)
        return exports;
    }
    require("./src/index.js")
  })(${JSON.stringify(webpack_modules)})`;
  fs.mkdir('dist',function(error){
    if(error){
        console.log(error);
        return false;
    }
    console.log('创建目录成功');
  })
  fs.writeFileSync("./dist/index.js", writeFunction);
  