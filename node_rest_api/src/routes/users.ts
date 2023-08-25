import {Router} from "express";
import bcrypt from 'bcryptjs';
import User from "../models/User";
import userController from "../controllers/userController";
import tokenMiddleware from "../middlewares/token.middleware";
const userRoute:Router=Router();


//updateuser pass
userRoute.put("/:id",tokenMiddleware.auth,userController.updateuser)
//updateinfo
userRoute.post("/update",userController.updateinfo)
//deleteuser
userRoute.delete("/:id",userController.deleteuser)


//get a user
userRoute.get("/",userController.getuser)
//getallusers
userRoute.get("/allusers",userController.getalluser)
//get friends
userRoute.get("/friends/:userId", tokenMiddleware.auth ,userController.getfriends)
//follow a user
userRoute.put("/:id/follow",tokenMiddleware.auth,userController.followuser)
//unfollow a user
userRoute.put("/:id/unfollow",tokenMiddleware.auth,userController.unfollouser)

export default userRoute;