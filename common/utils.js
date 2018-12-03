let utils = {};
// let sha1 = require('sha1')
var jsSHA = require('jssha');
const config = require('../config');
utils.sign = (req, res) => {
	let token = config.wechat.token;
	let {
		signature,
		timestamp,
		nonce,
		echostr
	} = req.query;
	let array = [token, timestamp, nonce];

	let tempStr = array.sort().join('');
	let shaObj = new jsSHA('SHA-1', 'TEXT');
	shaObj.update(tempStr);
	let scyptoString = shaObj.getHash('HEX');

	if (signature === scyptoString) {
		console.log('验证成功')
		res.send(echostr);
	} else {
		console.log('验证失败')
		res.send('验证失败');
	}
};

function Wechat(opts){     //构造函数，用以生成实例，完成初始化工作，读写票据
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;

    this.getAccessToken().then(function(data){
        try{
            data = JSON.parse(data);
        }catch(e){
            return that.updateAccessToken();
        }
        if(that.isvalidAccessToken(data)){
            Promise.resolve(data);
        }else{
            return that.updateAccessToken();
        }
    }).then(function(data){
        that.access_token = data.access_token;
        that.expires_in = data.expires_in;
        that.saveAccessToken(JSON.stringify(data));
    });
}
//获取token

module.exports = utils;