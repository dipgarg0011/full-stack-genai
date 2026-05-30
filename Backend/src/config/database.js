const mongoose= require('mongoose')

async function connectDB(){
    try{
        console.log(process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI)

        console.log('Connected to MongoDB')
    }
    catch(err){
        console.error('Failed to connect to MongoDB', err)
    }
}

module.exports= connectDB