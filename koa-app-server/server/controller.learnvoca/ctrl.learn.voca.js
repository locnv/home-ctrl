/**
 * Created by locnv on 10/14/18.
 */

const cardCtrl = require('./ctrl.learn.voca.card');
const wordCtrl = require('./ctrl.learn.voca.word');
const wordBuilderCtrl = require('./ctrl.learn.voca.word.builder');

let Styles = [
  'vendor/bootstrap/css/bootstrap.min.css',
  'vendor/animate.css/animate.min.css',
  'css/app.css',
  /*'css/app.signup.css',*/
  'css/sideNav.css',
  'js/directive/directive.css',
];

let JS = [
  'vendor/jquery/jquery.min.js',
  'vendor/angular/angular.min.js',
  'vendor/angular/angular-cookies.min.js',
  'vendor/angular/angular-route.min.js',
  'vendor/angular-translate/angular-translate.min.js',
  'vendor/angular-translate/angular-translate-loader-static-files.min.js',
  'vendor/angular-translate/angular-translate-storage-local.min.js',
  'vendor/angular-translate/angular-translate-storage-cookie.min.js',
  'vendor/bootstrap/js/bootstrap.min.js',
  'vendor/bootstrap-notifier/bootstrap-notify.min.js',
  'vendor/angular/angular-animate.min.js',
  'vendor/fast-click/fast-click.min.js',
  'vendor/digest-hub/digest-hud.js',
  'vendor/socket.io.min.js',

  // Native
  'js/native/base.js',
  'js/native/partical.js',
  'js/native/cc.base.js',
  'js/native/cc.loading.js',
  'js/native/cc.partical.js',

  // Service
  'js/app.learnvoca.js',
  'js/app.learnvoca.constants.js',
  'js/app.util.js',
  'js/service/service.runtime-storage.js',
  'js/service/service.log.js',
  'js/service/service.i18n.js',
  'js/service/service.help.js',
  'js/service/service.configuration.js',
  'js/service/service.file-storage.js',
  'js/service/service.csf.js',
  'js/service/service.task-executor.js',
  'js/service/service.notifier.js',
  'js/service/service.speech.js',
  'js/service/service.navigator.js',
  'js/service/service.dic.js',
  'js/service/service.http.js',
  'js/service/service.socket-io.js',

  // Animation -->

  // Directive -->
  'js/directive/directive.app-header.js',
  'js/directive/directive.app-footer.js',
  'js/directive/directive.status-bar.js',
  'js/directive/directive.service.helper.js',
  'js/directive/directive.simple-json.js',
  'js/directive/directive.helper.js',
  'js/directive/directive.button-navigator.js',
  'js/directive/directive.add-card.js',
  'js/directive/directive.add-word.js',
  'js/directive/directive.test.js',

  // Controller
  'js/controller/ctrl.base.js',
  'js/controller/ctrl.learnvoca.home.js',
  'js/controller/ctrl.learnvoca.card.js',
  'js/controller/ctrl.learnvoca.word.js',
  'js/controller/ctrl.learnvoca.word.builder.js',
  'js/controller/ctrl.learnvoca.topic.builder.js',
  'js/controller/ctrl.learnvoca.about.js',
  'js/controller/ctrl.learnvoca.setting.js',
  'js/controller/ctrl.learnvoca.test.js',
];

/**
 * { request:
    { method: 'POST',
     url: '/u/cards',
     header:
      { host: 'localhost:3000',
        connection: 'keep-alive',
        'content-length': '49',
        accept: 'application/json, text/plain,',
origin: 'http://localhost:3000',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
  'content-type': 'application/json;charset=UTF-8',
  referer: 'http://localhost:3000/',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'en-US,en;q=0.9,vi;q=0.8,fr;q=0.7',
  cookie: 'Webstorm-20e60aa4=4e2ebff7-591f-485f-904a-042bb02bf2e6; io=V6qc9obKwxQfTzmfAAAC; G_WPT_TO=en; SL_GWPT_Show_Hide_tmp=undefined; SL_wptGlobTipTmp=undefined; SL_G_WPT_TO=en' } },
response:
{ status: 404,
  message: 'Not Found',
  header: { vary: 'Accept-Encoding' } },
app: { subdomainOffset: 2, proxy: false, env: 'development' },
originalUrl: '/u/cards',
  req: '<original node req>',
  res: '<original node res>',
  socket: '<original node socket>' }

*/

function AppController() { }

AppController.prototype.load = async function (ctx) {
  await ctx.render('app.learn.voca', {
    styles: Styles,
    scripts: JS,
    AppTitle: 'Learn Voca',
  });
};

AppController.prototype.cards = async function (ctx, next) {

  let retData = await cardCtrl.handle(ctx.request, ctx.params, ctx.query);
  if(retData.isStream) {
    // retData.data must be a readable stream
    ctx.statusCode = 200;
    ctx.set('Content-disposition', `attachment; filename=${retData.filePath}`);
    //ctx.set('Content-type', mimetype);
    ctx.body = retData.data;
  } else {
    retData.serverTime = new Date();
    ctx.body = retData;
  }
};

AppController.prototype.words = async function (ctx, next) {
  let retData = await wordCtrl.handle(ctx.request, ctx.params, ctx.query);
  retData.serverTime = new Date();
  ctx.body = retData;
};

AppController.prototype.wordsBuilder = async function (ctx, next) {

  let retData = await wordBuilderCtrl.handle(ctx.request, ctx.params, ctx.query);
  retData.serverTime = new Date();
  ctx.body = retData;
};


module.exports = new AppController();
