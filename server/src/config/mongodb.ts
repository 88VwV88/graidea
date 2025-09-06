import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("DATABASE CONNECTED"));
        
        // Use the MONGODB_URI directly, or provide a default
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hack-app';
        
        await mongoose.connect(mongoURI);
        console.log(`Connected to MongoDB: ${mongoURI}`);
    } catch (error) {
        console.log("Error in connecting Database:", error);
        process.exit(1); // Exit process if database connection fails
    }  
}

export default connectDB;