import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function Recommendations(req,res){
    try {
        const currentUserid = req.user.id;
        const currentUser = req.user;
        const recommendedUsers = await User.find({
            $and: [
                {_id: {$ne: currentUserid}},
                {_id: {$nin: currentUser.friends}},
                {isOnboarded:true},
            ],
        });
        return res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in Recommendations controller",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export async function myfriends(req,res) {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends","name profilePic nativelang learninglang");
        return res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in Myfriends controller",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export async function friendRequest(req,res){
    try {
        const myId = req.user._id;
        const {id:receiverId} = req.params;
        if(myId === receiverId) return res.status(400).json({message: "You can't be your own friend..."});

        const receiver = await User.findById(receiverId);
        if(!receiver) res.status(404).json({message:"Receiver not found..."});

        if(receiver.friends.include(myId)) return res.status(400).json({message:"Already a friend..."});

        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender:myId,recipient:receiverId},
                {sender:receiverId,recipient:myId},
            ],
        });
        if(existingRequest) return res.status(400).json({message:"Friend request already exists,waiting for approval...."});

        const friendRequest = await FriendRequest.create({
            sender:myId,
            receiver:receiverId,
        });

        return res.status(201).json(friendRequest);
    } catch (error) {
        console.error("Error in friendRequest controller",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export async function acceptRequest(req,res){
    try {
       const {id:requestId} = req.params;

       const friendRequest = await FriendRequest.findById(requestId);
       if(!friendRequest) return res.status(400).json({message:"Friend request not found...."});

       if(friendRequest.receiver.toString() !== req.user._id) return res.status(403).json({message:"You can't accept such requests..."});

       friendRequest.status = "accepted";
       await friendRequest.save();

       await User.findByIdAndUpdate(friendRequest.sender,{
        $addToSet: {friends:friendRequest.receiver},
       });

       await User.findByIdAndUpdate(friendRequest.receiver,{
        $addToSet: {friends:friendRequest.sender},
       });

       return res.status(200).json({message:"Friend request accepted...."});

    } catch (error) {
        console.error("Error in acceptRequest controller",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export async function getfriendRequests(req,res){
    try {
        const incomingRequests = await User.find({
            receiver:req.user._id,
            status:"pending",
        }).populate("sender","name profilePic nativelang learninglang");

        const acceptedReqs = await User.find({
            sender:req.user._id,
            status:"accepted",
        }).populate("receiver","name profilePic");

        return res.status(200).json(incomingRequests,acceptedReqs);

    } catch (error) {
        console.error("Error in getfriendRequests controller",error.message);
        return res.status(500).json({message:"Internal server error..."});
    }
}

export async function sentRequests(req,res){
    try {
        const sentrequests = await FriendRequest.find({
            sender:req.user._id,
            status:"pending",
        }).populate("receiver","name profilePic nativelang learninglang");
        
        return res.status(200).json(sentrequests);
    } catch (error) {
        console.error("Error in sentRequests controller",error.message);
        return res.status(500).json({message:"Internal server error..."});
    }    
}