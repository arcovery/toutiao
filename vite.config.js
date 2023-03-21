import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import { createStyleImportPlugin, VantResolve } from 'vite-plugin-style-import' // 样式按需自动导入 插件一
// import vitePluginImp from 'vite-plugin-imp';
// 样式按需自动导入 插件二

export default ({ mode }) => {
  const { VITE_PORT, VITE_BASE_URL } = loadEnv(mode, process.cwd())

  return defineConfig({
    base: VITE_BASE_URL,
    plugins: [
      vue2(),
      createStyleImportPlugin({
        resolves: [VantResolve()],
        // libs: [
        //   // 如果没有你需要的resolve，可以在lib内直接写，也可以给我们提供PR
        //   {
        //     libraryName: 'vant',
        //     esModule: true,
        //     resolveStyle: (name) => {
        //       return `vant/es/${name}/style/index`;
        //     },
        //   },
        // ],
      }),
      // vitePluginImp({
      //   libList: [
      //     {
      //       libName: 'vant',
      //       style(name) {
      //         if (/CompWithoutStyleFile/i.test(name)) {
      //           // This will not import any style file
      //           return false;
      //         }
      //         // 注意此处必须引入less，否则自定义主题不起作用
      //         return `vant/es/${name}/style/index.js`;
      //       },
      //     },
      //   ],
      // }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import  "${resolve(__dirname, './src/style/variables.less')}";`,
          },
          // math: 'strict',
          javascriptEnabled: true,
        },
      },
    },
    server: {
      // 是否开启 https
      https: false,
      // 端口号
      port: 3001,
      // 监听所有地址
      host: '0.0.0.0',
      // 服务启动时是否自动打开浏览器
      open: true,
      // 允许跨域
      cors: true,
      // 自定义代理规则
      proxy: {},
    },
    build: {
      // 设置最终构建的浏览器兼容目标
      target: 'es2015',
      // 构建后是否生成 source map 文件
      sourcemap: false,
      //  chunk 大小警告的限制（以 kbs 为单位）
      chunkSizeWarningLimit: 2000,
      // 启用/禁用 gzip 压缩大小报告
      reportCompressedSize: false,
    },
  })
}
