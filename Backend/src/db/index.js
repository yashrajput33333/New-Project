import { DB_NAME } from "../constant.js";
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MONGODB connected !! DBHOST: ${connectionInstance.connection.host} `)
    } catch (error) {
        console.log("MONGO DB ERROR" , error)
    }
}
export default connectDB