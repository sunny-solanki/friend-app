const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith ('Bearer')){
        try{
            console.log(req.headers.authorization.split)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");
            next();
        } catch(error){
            res.status(401).json({ message: "Not authorized, token failed"});
        }
    }
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
    
};


const isAdmin = async (req, res, next ) => {
    try {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: "Not authorized as an admin" });
        }
    } catch (error) {
        res.status(401).json({ message: "Not authorized as an admin" });
        
    }
};
module.exports = {protect, isAdmin};