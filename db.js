var config = require('./config');
const MongoClient = require('mongodb').MongoClient;

const serverConfig={server:{ poolSize: config.mongoPoolSize}};

getConnect=()=>{
    return new Promise((resolve,reject)=>{
        MongoClient.connect(config.mongo, serverConfig, (err, db)=> {
           err?reject(err):resolve(db);
        });
    })
    
}


module.exports=getConnect();
// module.exports=23;

// getConnect().then(c=>console.log(c))