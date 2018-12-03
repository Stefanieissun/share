

const db=require('../db');
const createVal=require('../CreateColl/createCol');


let mongo;
db.then(c=>mongo=c);


function getParams(req){
    let {db,coll,idx}=req.params;
    let {body}=req;
    let {filter,update,index,options}=body;
    let skip=parseInt(req.params.skip, 10);
    let limit = parseInt(req.params.limit, 10);
    return {db,idx,coll,body,filter,update,index,options,skip,limit};
}
function getMongo(db,coll){
    return mongo.db(db).collection(coll);
}
function checkIfNum(num){
    if(typeof num==='number'&& Number.isNaN(num)===false){
        return true;
    }else{
        return false;
    }
}
let MongodbCRUD={
    insertMany:async(req,res)=>{
        let {db,coll,body}=getParams(req);
        try {
            // let r=await mongo.db(db).collection(coll).insertMany(body);
            let r=await getMongo(db,coll).insertMany(body);
            return res.json(r.result);;
        } catch (error) {
            return res.json({ ok: 0, n : 0, err : err });
        }
       
    },
    updateMany:async(req,res)=>{
        let {db,coll,filter,update}=getParams(req);
        if(filter===undefined||update===undefined)return res.json({ ok: 0, n : 0, err : 'params err' });
        try {
            let r=await mongo.db(db).collection(coll).updateMany(filter,update);
            return es.json(r.result);;
        } catch (error) {
            return res.json({ ok: 0, n : 0, err : 'params err' })
        }
    },
    deleteMany:async(req,res)=>{
        let {db,coll,filter}=getParams(req);
        if(filter===undefined) return res.json({ ok: 0, n : 0, err : 'params err' });
        try {
            let r=await mongo.db(db).collection(coll).deleteMany(filter);
            return res.json(r.result);
        } catch (error) {
            console.log(error);
            return res.json({ ok: 0, n : 0 });
        }
    },
    drop:async(req,res)=>{
        let {db,coll}=getParams(req);
        try {
            let r=await mongo.db(db).collection(coll).drop();
            return res.json(r);
        } catch (error) {
            return   res.json({ ok: 0, n : 0, err : err });
        }
    },
    removeMany:async(req,res)=>{
        let {db,coll}=getParams(req);
        try {
            let r=await mongo.db(db).collection(coll).removeMany();
            return res.json(r);
        } catch (error) {
            return res.json({ ok: 0, n : 0, err : err });
        }
    },
    ensureIndex:async(req,res)=>{
        let {db,coll,index,options}=getParams(req);
        if(index!=undefined){
            if(options===undefined){
                req.body.options={background:true};
            }
            try {
                let r=await mongo.db(db).collection(coll).ensureIndex(index,options);
                return  res.json({ ok: 1, n : 1, data: r });
            } catch (error) {
                res.json({ ok: 0, n : 0, err : err });
            }
        }
    },
    dropIndex:async(req,res)=>{
        let {db,coll,idx}=getParams(req);
        try {
            let r=await mongo.db(db).collection(coll).dropIndex(idx);
            return res.json(r);
        } catch (error) {
            return  res.json({ ok: 0, n : 0, err : err });
        }
    },
    findRole:async(req,res)=>{
        let {db,coll,skip,limit,filter}=getParams(req);
        let role={ _id: false, Pwd: true, Ukey: true };
        try {
          let r=await mongo.db(db).collection(coll).find(filter,role).skip(skip).limit(limit).toArray();
          return  res.json({ ok: 1, n : r.length, data: r });
        } catch (error) {
          return  res.json({ ok: 0, n : 0, err : err });
        }
    },
    find:async(req,res)=>{
        let {db,coll,skip,limit}=getParams(req);
        
        // if(isNaN(skip)||isNaN(limit))return  res.json({ ok: 0, n : 0, err: "params type err" });
        if(checkIfNum(skip)===false||checkIfNum(limit)===false)return  res.json({ ok: 0, n : 0, err: "params type err" });
        try {
            let r=await mongo.db(db).collection(coll).find(filter).skip(skip).limit(limit).toArray();
            return res.json({ ok: 1, n : r.length, data: r });
        } catch (error) {
            return res.json({ ok: 0, n : 0, err : err });
        }
    },  
    createCol:async(req,res)=>{
        try {
            let {db,coll,body}=getParams(req);
            let {obj,arr}=body;
            if(typeof obj==='object'&& Array.isArray(arr)){
                await mongo.db(db).createCollection(coll,createVal(obj,arr));
                return res.json({ok:1,n:1});
            }
            else{
                return res.json({ok:0,err:'error param'})
            }
            
        } catch (error) {
            return res.json({ok:0,n:0,err:error.toString()})
        }
    },
//关注之后
    addFocus:async(req,res)=>{
        // let {name}=encodeURI( req.params);
        //只有自己有子节点关注了才会插入数据库
        //先关注，（判断是否重复关注，（应该调用公众号拿到关注着信息）然后再插入记录）


        //如果关注A活动之后，又取消关注，然后关注B活动（怎么算）
        let name=req.query.name;//name是分享者
        let child=req.query.child;//child是关注者
        console.log('name',name);
        console.log('child',child);
        try {
            //堵bug
            let count1=await mongo.db('WangTest').collection('userInfo').find({children:{$in:[child]}}).count();
            if(count1>0){
                return res.json({err:'不可重复关注'});
            }
            let countC=await mongo.db('WangTest').collection('userInfo').find({name:child}).count();
            let countP=await mongo.db('WangTest').collection('userInfo').find({name:name}).count();
            if(countP===0){
                //先建立表
                    let project=(await mongo.db('WangTest').collection('userInfo').find({children:{$in:[name]}}).toArray())[0].project;
                    await mongo.db('WangTest').collection('userInfo').insert({name:name,project:project,children:[child],num:1,observer:0});
            }else{
                    let countExist=await mongo.db('WangTest').collection('userInfo').find({name:name,children:{$in:[child]}}).count();
                    if(countExist<1){
                        await mongo.db('WangTest').collection('userInfo').update({name:name},{$inc:{num:1},$addToSet:{children:child}});
                    }
                    else{
                        return res.json({err:'已经关注了'});
                    }
            }
          
            // let r=await mongo.db('WangTest').collection('userInfo').update({name:name},{$inc:{num:1},$addToSet:{children:child}});
            if(countC===1){
                //说明以前关注者关注过，后来抽风取关了，现在又通过某人分享重新关注
           
            //标志设置为关注
            await mongo.db('WangTest').collection('userInfo').update({name:child},{$set:{observer:0}});
            // console.log(r)
            return res.json({ok:1})
            }
            return res.json({ok:1});
        
        } catch (error) {
            return res.json({err:error.toString()});
        }
    },

    //取消关注
    cancelFocus:async(req,res)=>{
        let name=req.query.name;//name是取关者
        //question1:如果A取关了,然后B，C通过A的分享关注，A是否存在与数据库

        //此人取消关注,先判断此人是否有子节点
        console.log('name',name);
        try {
            //先从父节点中去除
            await mongo.db('WangTest').collection('userInfo').update({children:{$in:[name]}},{$inc:{num:-1},$pull:{children:name}});//仅仅只是关注，并没有自后代扫码关注
            let count=await mongo.db('WangTest').collection('userInfo').find({name}).count();
            if(count===1){
                //name还有子节点
                await mongo.db('WangTest').collection('userInfo').update({name:name},{$set:{observer:-1}});
            }                         
            return res.json({ok:1}) 
        } catch (error) {
            return res.json({ok:0,err:error.toString()});
        }
    }

};
// 数据库设计
//  name 微信号+昵称  project经销商发起的活动  children 通过分享关注的子节点   num children数量  observe此人是否关注 0表示关注 -1表示已经取消关注了
// 
// 
// 
module.exports=MongodbCRUD;