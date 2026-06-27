import {Request,Response,NextFunction} from "express"
import jwt from "jsonwebtoken"

export const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const header = req.headers["authorization"];
    if(!header){
        return res.status(401).json({
            message:"Token missing"
        });
    }
   try{

        const decode = jwt.verify(
            header as string,process.env.JWT_SECRET!
        );
        //@ts-ignore
        req.userId = (decode as any).id
        next();
    } catch{
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}