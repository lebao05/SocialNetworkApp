import axios from "./axios";

export async function getTodayBirthdaysApi() {
    const response = await axios.get("/users/birthdays/today");
    return response.data;
}

export async function getUpcomingBirthdaysApi() {
    const response = await axios.get("/users/birthdays/upcoming");
    return response.data;
}
