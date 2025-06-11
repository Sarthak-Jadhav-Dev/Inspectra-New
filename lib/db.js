const mongoose = require("mongoose")
const ConnectDB = async()=>{
    try{
        const Connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB Connection Successsfull!")
    }catch(error){
        console.log("Something is Wrong Please restart the Server(DB): ",error)
    }
}
module.exports = ConnectDB
