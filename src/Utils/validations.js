const validator = require("validator");


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

module.exports = {
    ValidateSignUpData
}