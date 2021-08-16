// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
    // 选项...
    publicPath: process.env.NODE_ENV === 'production' ? '/manage/' : '/',
    outputDir: './dist/resource',

    indexPath: process.env.NODE_ENV === 'production'
    ? '../views/manage.blade.php'
    : 'index.html',
    // 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
    runtimeCompiler: true,
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
    productionSourceMap: false,

    chainWebpack: config => {
        config.optimization.minimize(true) // 开启压缩js代码
        config.optimization.splitChunks({ // 开启代码分割
          chunks: 'all'
        })
    },
    // 服务
    devServer: {
        // 请求代理
        proxy: 'http://dev.test'
    }
}