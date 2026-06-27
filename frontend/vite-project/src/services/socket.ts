import {io} from "socket.io-client";
export const socket = io(
    "http://localhost:3000",{
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