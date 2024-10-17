const mongoose = require("mongoose");
const validator = require("validator");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 5
    },
    lastName: {
        type: String
    },
    emailID: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true,
        index: true,
        validate: (value) => {
            if(!validator.isEmail(value)) {
                throw new Error("Email is not valid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Password is too weak");
            }
        }
    },
    age: {
        type: Number,
        min: 20
    },
    gender: {
        type: String,
        validate: (value) => {
            if(!["male","female","others"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
    },
    about: {
        type: String,
        default: "This is the default description of the User"
    },
    skills:{
        type:[String]
    }
},
{
    timestamps: true
});


userSchema.methods.getJWT = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id}, "DEVTINDER$790", {expiresIn: "1d"})
    console.log("generated token => ", token);
    return token;
}

userSchema.methods.validateUser = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user?.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}
           
const User = mongoose.model("User", userSchema);

module.exports = User