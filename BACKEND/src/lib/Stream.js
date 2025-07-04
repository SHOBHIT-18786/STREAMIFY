import "dotenv/config";
import {StreamChat} from "stream-chat";

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream api key or secret is missing....");
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error creating stream user...",error);
    }
};

export const generateStreamtoken = (userId) =>{
    try {
        const Id = userId.toString();
        return streamClient.createToken(Id);
    } catch (error) {
        console.error("Error generating Stream token",error.message);
    }
};