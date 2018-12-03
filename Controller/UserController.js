// 登陆，判断是否为经销商


//发起活动  创建集合 （发起人，活动名，内容，二维码，奖品，时间段，目标数，实际人数，分享人群）


//活动数据页   所有经销商 数据统计（实际人数排行）    单个经销商查看自己粉丝拉的关注人数

const db=require('../db');
let mongo;
db.then(c=>mongo=c)

//发起活动 ，提交信息
//发起活动之前先检查是否有记录
let starter={
    createActivity:async(req,res)=>{
        let {project,starter,content,date,prize,target}=req.body;
        try {
            let count=await mongo.db('WangTest').collection('infos').find({starter}).count();
            if(count===0){
                //创建活动，并且插入一条记录  infos记录活动
                //userInfo中插入
            let insertContent={project,starter,content,date,prize,target};
            let insertUserInfo={name:starter,project,num:0,children:[],observer:0};
            //创建活动 info（新增记录）
            await mongo.db('WangTest').collection('infos').insert(insertContent);
            //新增 在userInfo
            await mongo.db('WangTest').collection('userInfo').insert(insertUserInfo);
            return res.json({ok:1});
        }
        else{
            return res.json({err:'every agency can only start one activity'});
        }
        } catch (error) {
            return res.json({ok:0,n:0,err:error.toString()});
        }
    },

    //查看自己活动下的粉丝排名
    seeSort:async(req,res)=>{
        try {
            console.time('查看自己活动下的粉丝排名');
            let name=req.query.name;
            let project=(await mongo.db('WangTest').collection('userInfo').find({name:name}).toArray())[0].project;
            let findData=await mongo.db('WangTest').collection('userInfo').find({project:project});
            let data=(await findData.skip(1).sort({num:-1}).toArray()).filter(x=>x.observer!=-1).map(x=>{
                return {
                    name:x.name,
                    childNum:x.num,
                }
            });
            console.timeEnd('查看自己活动下的粉丝排名');
            return res.json({ok:1,data:data});
          
        } catch (error) {
            return res.json({err:error.toString()});
        }
    },

    //查看自己在所有经销商中的排名
    selfSort:async(req,res)=>{
        try {
            console.time('')
            let name=req.query.name;
            let total=((await mongo.db('WangTest').collection('userInfo').aggregate([{
                $group:{
                    _id:'$project',
                    starter:{$first:'$name'},
                    sum:{$sum:'$num'},
                    cancel:{$sum:'$observer'},
                    }
            }]).toArray())).map(x=>{
                return{
                    project:x.__id,
                    starter:x.starter,
                    total:x.sum+x.cancel
                }
            }).sort((x,y)=>y.total-x.total);
            console.timeEnd('')
            return res.json({ok:1,data:total});
        } catch (error) {
            return res.json({err:error.toString()});
        }
    }
}



module.exports=starter;