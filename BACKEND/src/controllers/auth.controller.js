import { upsertStreamUser } from "../lib/Stream.js";
import User from "../models/User.js"
import jwt from "jsonwebtoken"

export async function signup(req, res) {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be of at least 6 characters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            email,
            name,
            password,
            profilePic: randomAvatar,
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.name,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.name}`);
        } catch (error) {
            console.log("Error creating Stream user....", error);
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevent XSS attacks
            sameSite: "Strict", // prevent CSRF attacks
            secure: process.env.Node_ENV === "production",
        });
        res.status(201).json({ success: true, User: newUser });
    }
    catch (error) {
        console.log("Error in signup", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields are required..." });
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });
        const IsPassowrdCorrect = await user.matchPassword(password);
        if (!IsPassowrdCorrect) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "Strict",
            secure: process.env.Node_ENV === "production",
        });
        res.status(201).json({ success: true, User: user });
    }
    catch (error) {
        console.log("Error in login", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout Successfull..." });
}

export async function onboard(req, res) {
    try {
        const userId = req.user._id;
;        const { name, bio, nativelang, learninglang, location } = req.body;
        if (!name || !bio || !nativelang || !learninglang || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !name && "name",
                    !bio && "bio",
                    !nativelang && "nativelang",
                    !learninglang && "learninglang",
                    !location && "location",
                ].filter(Boolean),
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, { new: true });

        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.name,
                image: updatedUser.profilePic || "",
            });
            console.log(`Stream user updated after onboarding for ${updatedUser.name}`);
        } catch (streamError) {
            console.log("error updating Stream user during onboarding:",streamError.message);
        }
        return res.status(200).json({ succes: true, user: updatedUser,});
    }
    catch(error){
        console.error("Onboarding Error",error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}