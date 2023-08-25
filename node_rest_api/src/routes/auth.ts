import {Router} from "express";
import User from "../models/User";
import bcrypt from 'bcryptjs';
import createtoken from "../middlewares/token.middleware";
const authRoute:Router=Router();
import authController from "../controllers/authController";
//register
authRoute.post("/register",authController.register)


//login
authRoute.post("/login",authController.login)


authRoute.post("/verify",authController.verify)


export default authRoute;