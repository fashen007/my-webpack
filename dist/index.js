((content)=>{
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
  })({"./src/index.js":{"deps":{"./lucy":"./src/lucy.js","./lily":"./src/lily.js"},"code":"\"use strict\";\n\nvar _lucy = _interopRequireDefault(require(\"./lucy\"));\n\nvar _lily = _interopRequireDefault(require(\"./lily\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\n(0, _lucy[\"default\"])();\n(0, _lily[\"default\"])();"},"./src/lucy.js":{"deps":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar lucy = function lucy(params) {\n  console.log('myname is lucy');\n};\n\nvar _default = lucy;\nexports[\"default\"] = _default;"},"./src/lily.js":{"deps":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar lily = function lily(params) {\n  console.log('myname is lily');\n};\n\nvar _default = lily;\nexports[\"default\"] = _default;"}})