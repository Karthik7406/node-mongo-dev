const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://karthik:jLa90szIpJEdrk3y@namastenode.ej9xr.mongodb.net/devTinder ")
}


module.exports = {
    connectDB
}


// connectDB()
//     .then(() => {
//         console.log("connected to DB successfully!!");
//     })
//     .catch((err) => {
//         console.error("error connecting to the database ==> "+err);
//     })