import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {myfriends,Recommendations,friendRequest,acceptRequest,getfriendRequests,sentRequests} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/",Recommendations);
router.get("/friends",myfriends);
router.post("/friend-request/:id",friendRequest);
router.put("/friend-request/:id/accept",acceptRequest);
router.get("/friend-requests",getfriendRequests);
router.get("/sent-friend-requests",sentRequests);

export default router;