const mongoose = require("mongoose");

const connectToDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.DB_string)
        console.log(`MongoDB Connected ${conn.connection.host}`)
    }
    catch (err){
        console.error(err);
        process.exit(1);
    };
}

module.exports = connectToDB