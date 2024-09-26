 const mongoose = require ('mongoose');
 const DBconnect = ()=>{
    mongoose
    .connect(process.env.DB_URL)
    .then(()=>{
        console.log("Database is Connected");
        
    }).catch((err)=>{
        console.log(err);
        
    })
    
 }
 module.exports =DBconnect