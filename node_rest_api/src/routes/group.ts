import {Router} from "express";
import Group from "../models/Group";
import groupController from "../controllers/groupController";
import tokenMiddleware from "../middlewares/token.middleware";

const groupRoute:Router=Router();

groupRoute.post("/",tokenMiddleware.auth,groupController.accessChat);
groupRoute.get("/",tokenMiddleware.auth,groupController.fetchChat);
groupRoute.get("/:search",tokenMiddleware.auth,groupController.searchUser);
groupRoute.post("/creategroup",tokenMiddleware.auth,groupController.createGroupChat);
groupRoute.put("/renamegroup",tokenMiddleware.auth,groupController.renameGroupChat);
groupRoute.put("/groupremove",tokenMiddleware.auth,groupController.removeFromGroup);
groupRoute.put("/groupaddnumber",tokenMiddleware.auth,groupController.addToGroup);

export default groupRoute;