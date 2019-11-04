const { override, fixBabelImports,addLessLoader } = require('customize-cra');

module.exports = override(
    // 战队antd实现按需大包,根据import来打包(使用badel-plugin-import)
       fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,//自动大包相关样式
      }),
    //   使用less-loader对源码中的less的变量进行重新指定
      addLessLoader({
           javascriptEnabled: true,
           modifyVars: { '@primary-color': '#2E8B57' },
         }),
 );