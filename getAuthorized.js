// //basic-auth 验证
// const basicAuth = require('basic-auth');
// let auth =  (req, res, next)=> {
//     function unauthorized(res) {
//         res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//         return res.sendStatus(401);
//     };
//     let user = basicAuth(req);
//     if (user.name === 'foo' && user.pass === 'bar') {
//         return next();
//     } else {
//         return unauthorized(res);
//     };
// };
// jwt验证
const secret = require('./config').secret;
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

// 生成token
try {
    const getToken =  ()=> {
        return jwt.sign({
            name: 123
        }, secret, {
            expiresIn: 6000
            //秒到期时间 
        })
    };
    let auth = expressJwt({
        secret: secret
    }).unless({
        path: ['/login', '/mgs/getToken','/mgs/demo','/mgs/test','/weixin','/mgs/tongji']
    })
   
    module.exports = {
        auth,
        getToken
    };
} catch (error) {
    console.error(error);
}