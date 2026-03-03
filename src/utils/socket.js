import { io } from "socket.io-client";

const socket = io("http://192.168.137.1:7777", {
  withCredentials: true,
});

export default socket;