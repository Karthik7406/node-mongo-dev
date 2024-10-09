const adminAuth = (req, res, next) => {

    console.log("auth middlewares");

    const token = "xyz";
    const isAdminAuthenticated = token === "xyz";

    if(!isAdminAuthenticated) {
        res.status(401).send("user is not authenticated");
    } else {
        next();
    }

}


const userAuth = (req, res, next) => {

    console.log("user middlewares");

    const token = "xyzab";
    const isAdminAuthenticated = token === "xyz";

    if(!isAdminAuthenticated) {
        res.status(401).send("user is not authenticated");
    } else {
        next();
    }

}


module.exports = {
    adminAuth,
    userAuth
}