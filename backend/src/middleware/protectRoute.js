import jwt from 'jsonwebtoken'
export const protectRoute = async (req,res,next) =>{
    try {

        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({message:"Unauthorized - Invalid token"});
        }

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(401).json({message:"Unauthorized"});
        }
        req.userId = decodedToken.id;
        
        req.isAdmin = decodedToken.isAdmin;
        next();
        
    } catch (error) {

        console.log("error occured in protect route middleware: ",error);
        return res.status(500).json({message:"Internal server error"});
    }
}   