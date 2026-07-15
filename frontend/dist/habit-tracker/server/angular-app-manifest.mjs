
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
      "chunk-GL5D7ALW.js"
    ],
    "route": "/login"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-FBPR4VIG.js"
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
    'index.csr.html': {size: 734, hash: '70791b62445f76f12983f8439ebe40e125f2cd19ea36d3c5874db571758d82d2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1052, hash: '34bda2345a90e1047ab5c18667f584409fc63fbbcae9a3e995810240d1a970d6', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-JVP5GETE.css': {size: 70, hash: 'pJrShJ7izuE', text: () => import('./assets-chunks/styles-JVP5GETE_css.mjs').then(m => m.default)}
  },
};
