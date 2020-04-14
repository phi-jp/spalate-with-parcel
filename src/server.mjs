
// spalate は global とする
import spalate from './spalate.js'
global.spalate = spalate;


// ここからはサーバー固有の処理

const path = require('path');
const express = require('express');
const Bundler = require('parcel-bundler');

// config
const config = require('./config.js');
// client 側の config を spalate.config とする
spalate.config = config.client;

var createParcelBundler = (target) => {
  var config;

  if (target === 'node') {
    var entry = path.join(process.cwd(), 'app/server.js');
    config = {
      target: 'node',
      bundleNodeModules: false,
      outDir: `${SPALATE_OUTPUT_DIR}`,
      outFile: 'modules.cjs',
      hmr: false,
      global: 'spalate',
      cache: false,
      sourceMaps: false,
    };
  }
  else {
    var entry = path.join(process.cwd(), 'app/client.js');
    config = {
      target: 'browser',
      bundleNodeModules: true,
      outDir: `${SPALATE_OUTPUT_DIR}/public`,
      outFile: 'modules.js',
      hmr: process.env.NODE_ENV !== 'production',
      // 名前がバッティングするので off に
      // global: 'spalate',
      sourceMaps: true,
      cache: true,
    };
  }

  var bundler = new Bundler(entry, config);

  return bundler;
};

var SPALATE_OUTPUT_DIR = `${process.cwd()}/.spalate`;


// setup node express
const app = express();

// setup static
app.use('/spalate', express.static(`${SPALATE_OUTPUT_DIR}/public`));
app.use(express.static(`${process.cwd()}/public`));

// setup pug
app.set('views', path.join(process.cwd(), 'app/views'));

app.set('view engine', 'pug');

// setup parcel
if (!process.env.PORT) {
  var bundler = createParcelBundler('browser');
  app.use(bundler.middleware());

  // riot タグが更新されたら再読み込みする
  bundler.on('bundled', (bundle, a, b) => {
    // console.log(Object.keys(bundle));
    // console.log(bundle.parentBundle);

    bundle.assets.forEach(item => {
      // console.log(item.id);

      if (/[^*]+\.pug$/.test(item.id)) {
        // console.log(item.id);
        // console.log(item.constructor);

        eval(item.generated.js);
      }
    });
  });

  const notifier = require('node-notifier');
  bundler.on('buildError', error => {
    // console.log(error);
    notifier.notify({
      'title': error.name,
      'message': error.fileName,

      // 'title': error.title,
      // 'message': error.message
    });
  });
}

// riot build
import Ssriot from './ssriot.js'

var riot = require('riot');
var sdom = require('riot/lib/server/sdom.js');
riot.util.tmpl.errorHandler = function() {};
riot.mixin({ _ssr: true });

// setup routing
import URL from 'url'
import routes from '../../scripts/routes.js'


app.use((req, res, next) => {
  req.Url = URL.parse(req.url, true);

  next();
});

Object.keys(routes).forEach(key => {
  app.get(key, async (req, res) => {
    // var ss = await db.collection('groups').get();
    var route = routes[key];

    // TODO: 失敗したらわかるように全ページレンダリングしてエラーでないかのテスト機構作る？
    var ssr = new Ssriot(route.tag);
    await ssr.render({
      req, res
    });
  
    res.render('index', {
      head: ssr.tag.head,
      content: ssr.tagContent,
      spalate: ssr,
      // methods: {
      //   head: ssr.head,
      // },

      pretty: true,
    });
  });
  
});


export default app;


