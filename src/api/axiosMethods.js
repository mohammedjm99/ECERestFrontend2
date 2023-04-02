import axios from "axios";

export const request = axios.create({
  baseURL: "https://ecerestbackend.onrender.com/api/",
});