module.exports = {
    mongoState: true,
    mongoPoolSize: 4000,
    mongo : 'mongodb://192.168.200.250:27017',//使用mongodb数据库
    debug : true,//生产环境下需设置为false
    port: 80,//本服务端口
    v : '1.0.0',
    secret:'Stefanie',//定义签名
    wechat:{
        appID:'wx912751db3b3961d0',
        AppSecret:'110692511f70b02d22340ef7f8490143',
        // 自己申请的 20c677a0c3fd9fd84eb4423dace3946e
        token:'6d05aedab138be6bbbf40b41d65a45ec',
        encodingAESKey:'A9lntSd83DG0I2s49P7VWFAOOeUSbGm9cdzly6EbnKi',
        prefix: "https://api.weixin.qq.com/cgi-bin/",
		mpPrefix: "https://mp.weixin.qq.com/cgi-bin/"
    },
    appName: 'induced_sharing',
    whitelist: ['0.0.0.0/0', '::ffff:127.0.0.1']//ip白名单，'0.0.0.0/0'开头为禁用此功能
};