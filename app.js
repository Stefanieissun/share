const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const utils=require('./common/utils');
const config = require('./config');
const auth=require('./getAuthorized').auth;
const path=require('path');
const app = express();
const menus=require('./common/menus.json');
const fetch=require('node-fetch');

const wechat=require('./common/WeChat');



//测试
app.use(express.static(path.resolve(__dirname,'./client/dist')))
// app.use(auth);

// app.get('/weixin',(req,res)=>{utils.sign(config)});
//验证微信
app.get('/weixin',function(req,res,next){
    utils.sign(req,res);
})

let defaultContentTypeMiddleware=(req, res, next)=> {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
}
app.use(defaultContentTypeMiddleware);

if (config.debug) {
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




app.all('*',  (req, res, next)=> {
   
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.set('Access-Control-Allow-Headers', 'U-ApiKey, Content-Type','Authorization');
    res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' == req.method) return res.status(200).end();
    next();
});

if (config.whitelist[0] != '0.0.0.0/0') {
    let ipfilter = require('express-ipfilter');
    let setting = { mode: 'allow', log: false, errorCode: 403, errorMessage: '' };
    app.use(ipfilter(config.whitelist, setting));
}

if (config.mongoState) {
    // let mgs = require('./mg.js');
    let mgs=require('./Router/mg')
    app.use('/mgs', mgs);
   
    app.post('/weixin',(req,res,next)=>{
        // wechat.getToken();
        wechat.receiveData(req,res,next);
    });
    //测试
    
}


// catch 404 and forward to error handler
app.use( (req, res, next)=> {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use( (err, req, res, next)=> {
    res.status(err.status || 500);
    res.json({ ok: 0, n: 0, err: err.message });
});

module.exports = app;
