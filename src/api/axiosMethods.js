import axios from "axios";

export const request = axios.create({
  baseURL: "https://ecerestbackend.onrender.com/api/",
});

// export const request = axios.create({
//   baseURL: "http://172.20.10.5:3002/api/",
// });