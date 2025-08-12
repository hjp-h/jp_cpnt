export default {
  plugins: {
    // tailwindcss: {},
    autoprefixer: {
      // 指定需要支持的浏览器版本
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'not dead',
        'Android >= 4.1',
        'iOS >= 7.1',
        'Chrome >= 31',
        'Firefox >= 31',
        'Safari >= 8',
        'Edge >= 12',
        'ie >= 9'
      ]
    },
    "postcss-px-to-viewport-8-plugin": {
      viewportWidth: 10000,
      viewportUnit: "rem", // 希望使用的视口单位
      fontViewportUnit: "rem", // 字体使用的视口单位
      exclude: [/node_modules/],
    },
  },
};
