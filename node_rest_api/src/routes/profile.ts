import {Router} from "express";

import profileController from "../controllers/profileController";
import tokenMiddleware from "../middlewares/token.middleware";
const profileRoute:Router=Router();
//get user's all post
profileRoute.get("/:userId", tokenMiddleware.auth,profileController.getProfile,);

export default {profileRoute};