const parseString=require('xml2js').parseString;
const fetch=require('node-fetch');
const menus=require('../common/menus.json');
const config=require('../config');
const receiveData= (req,res,next)=>{
  try {
    let data=[];

    // fetch('https://api.weixin.qq.com/cgi-bin/menu/create?access_token=15_v1soJor1wh3O8gjUVjXhL9H9wN0g0EV-g9i9oPLr9tcpQRMJVJrifzJvSFGa4ygJDTKFOWNuyWGydS4_nlKDOn8kiFJnx-b5xeaMnV_u2TA7m8caVMSUJIyvYGpAHG58EwCx7u2n05no-4vjSHXhADAMBR',{
    //     method:'post',
    //     body:JSON.stringify(menus),
    //     headers: { 'Content-Type': 'application/json' },
    // }).then(a=>a.json()).then(b=>console.log('b',b));
    req.on('data',chunk=>data.push(chunk));
    
       req.on('end',()=>{          
        //    console.log(data.toString()); 
        parseString(data.toString(),(err,result)=>{
           if(err)console.error(err)
               result=result.xml;
              
                // console.log(result.xml.MsgType[0]); 
            // console.log(result);
                switch(result.MsgType[0]){
                    case 'image':
                    console.log(result);
                    console.log('it is image');
                    break;
                    case 'text':
                    //文本消息，收到什么就回复什么
                    // console.log('it is text');
                    // console.log(result.Content[0]);
                    if(result.Content[0]=='生成二维码'){
                        console.log('qrcode');
                        let resMsg=`<xml> 
                    <ToUserName><![CDATA[${result.FromUserName[0]}]]></ToUserName> 
                    <FromUserName><![CDATA[${result.ToUserName[0]}]]></FromUserName>
                    <CreateTime> ${parseInt(new Date().valueOf() / 1000)}</CreateTime>
                    <MsgType><![CDATA[image] ]></MsgType>
                    <PicUrl><![CDATA[http://mmbiz.qpic.cn/mmbiz_jpg/icp7kPdwibdBDAW4njRWvaweGaBibv7wsh5W0xHnpzYg6by3ic3kDGXNuWogr7sDxIn7WAztibicImrljZCdWmlGnXRg/0] ]></PicUrl>`
                        //    <MediaId>< ![CDATA[media_id] ]></MediaId> 
                        //   <MsgId>1234567890123456</MsgId> </xml>`
                        res.send(resMsg);
                    }else{
                    let resMsg=`<xml> 
                    <ToUserName><![CDATA[${result.FromUserName[0]}]]></ToUserName>
                    <FromUserName><![CDATA[${result.ToUserName[0]}]]></FromUserName>
                    <CreateTime> ${parseInt(new Date().valueOf() / 1000)}</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[${result.Content[0]}]]></Content> 
                    </xml>`;
                    res.send(resMsg);
                    }
                    console.log(result);
                    break;

                    case 'event':
                    let event=result.Event[0];
                   
                    switch(event){
                        case 'subscribe':
                        console.log(result);
                        console.log(`${result.FromUserName[0]}关注了，应该调用方法王数据库添加数据`);
                        let resMsg=`<xml> 
                        <ToUserName><![CDATA[${result.FromUserName[0]}]]></ToUserName>
                        <FromUserName><![CDATA[${result.ToUserName[0]}]]></FromUserName>
                        <CreateTime> ${parseInt(new Date().valueOf() / 1000)}</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[谢谢你长得这么好看还来关注我]]></Content> 
                        </xml>`;
                        res.send(resMsg);
                        // console.log(result);
                        break;
                        case 'unsubscribe':
                        console.log(`${result.FromUserName[0]}取关了,应该调用方法删除一条记录`);
                        break;
                    }
                    break;  
                    default:
                    console.log(result.MsgType[0])
                }
                
        })
    
    });
} catch (error) {
    console.error(error);
}
}



const getToken=async ()=>{
    let dateNow=new Date().getTime();
    
    let {appID,AppSecret}=config.wechat;
    let url=`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${AppSecret}`
    let data=await fetch(url);
    let token=await data.json();
    this.access_token=token.access_token;
    let getTokenTime=new Date().getTime();
    console.log(token);
    return token;
}
module.exports={receiveData,getToken};