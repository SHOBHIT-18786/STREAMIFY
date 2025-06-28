import { generateStreamtoken } from "../lib/Stream.js";

export async function getStreamtoken(req,res){
    try {
        const token = generateStreamtoken(req.user.id);
        return res.status(200).json({token});
    } catch (error) {
        console.error("Error in getStreamtoken controller",error.message);
        return res.status(500).json({message:"Internal Server Error...."});
    }
}