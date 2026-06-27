import {io} from "socket.io-client";
import { BACKEND_URL } from "../config";
export const socket = io(
    BACKEND_URL,{
         autoConnect: false,
    auth: {
        token: sessionStorage.getItem("token")
    }
    }
);
socket.on("connect", () => {
    console.log("Socket Connected:", socket.id);
});

socket.on("connect_error", (err) => {
    console.log("Socket Error:", err.message);
});