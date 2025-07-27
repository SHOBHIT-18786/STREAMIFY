import { Axios } from "./axios.js";

export const signup = async function (signupData) {
    const response = await Axios.post("/auth/signup", signupData);
    return response.data;
};

export const getAuthUser = async () => {
    try {
        const response = await Axios.get("/auth/me");
        return response.data;
    }
    catch (error) {
        console.log("Error in getAuthUser", error);
        return null;
    }
};

export const completeOnboarding = async (onboardingData) => {
    const response = await Axios.post("/auth/onboard", onboardingData);
    return response.data;
};

export const login = async function (loginData) {
    const response = await Axios.post("/auth/login", loginData);
    return response.data;
};

export const logout = async function () {
    const response = await Axios.post("/auth/logout");
    return response.data;
};

export const getUserFriends = async function () {
    const response = await Axios.get("/users/friends");
    return response.data;
};

export const getRecommendedUsers = async function () {
    const response = await Axios.get("/users");
    return response.data;
};

export const getSentFriendRequests = async function () {
    const response = await Axios.get("/users/sent-friend-requests");
    return response.data;
};

export const sendFriendRequest = async function (userId) {
    const response = await Axios.post(`/users/friend-request/${userId}`);
    return response.data;
};