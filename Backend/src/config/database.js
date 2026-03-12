import mongoose from "mongoose";


async function connecttodb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connetcted to database")
    })
}


export default connecttodb