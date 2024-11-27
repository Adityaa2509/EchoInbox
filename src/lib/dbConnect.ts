import mongoose from "mongoose";


//type of connection which is return value for database connection
type connectionObject = {
    isConnected?:number

}

//value returned for database connection
const connection:connectionObject = {};

async function dbConnect():Promise<void>{
    try{
        //check if databse is already connected
        if(connection.isConnected){
            console.log("Database already connected");
            return ;
        }
        const db = await mongoose.connect(process.env.MONGODB_URI || '');
        
        //connection in db object is array and we have to take its first value in which ready state is present
       
        //ready state is a number that why taken
       
         //do not want just do it using a boolean flag  
       connection.isConnected = db.connections[0].readyState;
        console.log("Db Connected");

    }catch(err){
        console.log("Database connection Failed");
        console.error(err)
        process.exit(1);
    }
}

export default dbConnect;