const express = require('express');
const MongoCURD=require('../Controller/mongoDataController');
let router = express.Router({ mergeParams: true });
const starter=require('../Controller/UserController');
// const wechat=require('../common/WeChat');

router.route('/add/:db/:coll').post((req, res )=> {
    if (Array.isArray(req.body)) {
        console.log('body',req.body);
        MongoCURD.insertMany(req,res);
    } else {
        res.json({ ok: 0, n : 0, err : 'only arrays' });
    }
});

router.route('/update/:db/:coll').post(  (req, res)=> {
    if (req.body.hasOwnProperty('filter') && req.body.hasOwnProperty('update')) {
        MongoCURD.updateMany(req,res);
    } else {
        res.json({ ok: 0, n : 0, err : 'params err' });
    }
});

router.route('/delete/:db/:coll').post(function (req, res ) {
    if (req.body.hasOwnProperty('filter')) {
        MongoCURD.deleteMany(req,res);
    } else {
        res.json({ ok: 0, n : 0 });
    }
});

router.route('/drop/:db/:coll').get(function (req, res) {
    MongoCURD.drop(req,res);
});

router.route('/search/:db/:coll/:skip/:limit').post(function (req, res) {
    if (req.body.hasOwnProperty('filter')) {
        MongoCURD.find(req,res);
    } else {
        res.json({ ok: 0, n : 0 });
    }
});

//权限测试
router.route('/search/role/:db/:coll/:skip/:limit').post(function (req, res) {
    if (req.body.hasOwnProperty('filter')) {
        MongoCURD.findRole(req,res);
    } else {
        res.json({ ok: 0, n : 0 });
    }
});

router.route('/clear/:db/:coll').get( (req, res)=> {
    MongoCURD.removeMany(req,res);
});

router.route('/idx/:db/:coll').post( (req, res)=> {
    if (req.body.hasOwnProperty('index')) {
        if (!req.body.hasOwnProperty('options')) {
            req.body.options = { background: true };
        }
        MongoCURD.ensureIndex(req,res);
    } else {
        res.json({ ok: 0, n : 0 });
    }
});

router.route('/idx/:db/:coll/:idx').get( (req, res) =>{
    MongoCURD.drop(req,res);
});

router.route('/getToken').get((req,res)=>{
    let token=require('../getAuthorized').getToken();
    res.send(token);
})
//测试新建立collection
router.route('/demo/:db/:coll').post((req,res)=>{
    MongoCURD.createCol(req,res);
})


//测试 子代转发关注(有人通过 分享关注了)
router.route('/test/focus').get((req,res)=>{
    MongoCURD.addFocus(req,res);
})

router.route('/cancelFocus').get((req,res)=>{
    MongoCURD.cancelFocus(req,res);
})


router.route('/startActivity').post((req,res)=>{
    starter.createActivity(req,res);
})

//经销商查看自己下面的拉粉排行
router.route('/tongji').get((req,res)=>{
    starter.seeSort(req,res);
})
//查看经销商在团队中的排名

router.route('/sort').get((req,res)=>{
    starter.selfSort(req,res);
})

module.exports = router;