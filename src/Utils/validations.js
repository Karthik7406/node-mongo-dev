const validator = require("validator");
const bcrypt = require("bcrypt");

function ValidateSignUpData(req) {

    const {firstName,lastName, emailID, password} = req.body;

    if(!firstName || !lastName) {
        throw new Error("Name is invalid, Please enter first and lastnames correctly");
    } else if(!validator.isEmail(emailID)) {
        throw new Error("EmailID is invalid");
    } else if(!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }

}


function validateEditProfileData (req) {
    const allowed_Updates = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
        "photoUrl",
        "skills"
    ];

    const isUpdateAllowed = Object.keys(req.body).every(key => allowed_Updates.includes(key));
    console.log(isUpdateAllowed);

    if(isUpdateAllowed) {
        //validation for photoUrl
        if(req.body?.photoUrl && !validator.isURL(req.body?.photoUrl)) {
            throw new Error("photoUrl is not valid");
        }
    }
    return isUpdateAllowed;

}


async function verifyPassword (req) {
    const {oldPassword} = req.body;


    const loggedInUser = req.user;
    const passwordHash = loggedInUser.password;



    const isPasswordValid = await bcrypt.compare(oldPassword,passwordHash);

    console.log("password valid or not", isPasswordValid);

    return isPasswordValid;

    
}

module.exports = {
    ValidateSignUpData,
    validateEditProfileData,
    verifyPassword
}