// import config from './config.js'

// spalate は global とする
import spalate from './spalate.js'

// router
import Router from './internal/router'
import routes from '../../scripts/routes'

var router = new Router();

spalate.router = router;

// ここからは client 用
import riot from 'riot'
riot.util.tmpl.errorHandler = function() {};

spalate.start = () => {
  var clientElement = document.createElement('div');
  clientElement.setAttribute('render', 'client');
  var appTag = riot.mount(clientElement, 'app')[0];

  // routes を登録
  Object.keys(routes).forEach(key => {
    router.on(key, async (req, res) => {
      var route = routes[key];
      await appTag.gotoPage(route.tag, req, res);

      // meta の設定
      var titleElement = document.querySelector('title');
      if (titleElement) {
        document.querySelector('title').textContent = appTag.head.title;
      }
    });
  });

  // ルーティング実行
  spalate.router.start();
  spalate.router.exec();
  
  // スクロールのリセット対策
  var serverElement = document.querySelector('[data-is=app]');
  clientElement.style.height = serverElement.clientHeight;
  setTimeout(() => {
    clientElement.style.height = '';
  }, 512);

  // server でレンダリングした要素を client でレンダリングした要素に入れ替える
  serverElement.parentElement.replaceChild(clientElement, serverElement);
};

// global 化
if (global.spalate) {
  Object.assign(global.spalate, spalate)
}
else {
  global.spalate = spalate;
}

export default spalate;