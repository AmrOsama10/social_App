import { Server as httpServer } from "node:http";
import { Server, Socket } from 'socket.io';
import { socketAuth } from "./middleware/index.js";
import { sendMessage } from "./chat/index.js";
const connectedUser= new Map<string,string>()
export const initSocket = (server: httpServer) => {
  const io = new Server(server, { cors: { origin: "*" } });
  io.use(socketAuth)
  io.on("connection",(socket:Socket)=>{
  
    connectedUser.set(socket.data.user.id,socket.id)
    socket.on("sendMessage", sendMessage(connectedUser,socket,io));
  })
};