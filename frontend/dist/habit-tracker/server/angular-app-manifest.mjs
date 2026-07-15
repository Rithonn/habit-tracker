
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 1,
    "redirectTo": "/dashboard",
    "route": "/"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-O37XIMJY.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-24Y6YMOT.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 1,
    "redirectTo": "/dashboard",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 734, hash: '1556cc86062dd167b4b9e6b1e1171d39e5357ab0ce74d2cdf69af7a612c3a335', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1052, hash: '2f93b74b0589a093987d1d343f467197864f6fd33f8a5a38960bf5b3c3440fe8', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-JVP5GETE.css': {size: 70, hash: 'pJrShJ7izuE', text: () => import('./assets-chunks/styles-JVP5GETE_css.mjs').then(m => m.default)}
  },
};
