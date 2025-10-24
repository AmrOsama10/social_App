import { Server as httpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { socketAuth } from "./middleware/index.js";
import { sendMessage } from "./chat/index.js";
import { UserRepository } from "./../DB/user/user.repository";
import { USER_STATUSES } from "../utils/index.js";
const connectedUser = new Map<string, string>();
const userRepository = new UserRepository();
export const initSocket = (server: httpServer) => {
  const io = new Server(server, { cors: { origin: "*" } });
  io.use(socketAuth);
  io.on("connection", async (socket: Socket) => {
    await userRepository.update(
      { _id: socket.data.id },
      {
        userStatues: USER_STATUSES.online,
      }
    );

    connectedUser.set(socket.data.user.id, socket.id);
    socket.on("sendMessage", sendMessage(connectedUser, socket, io));

    socket.on("disconnect", async () => {
      await userRepository.update(
        { _id: socket.data.id },
        { userStatus: USER_STATUSES.offline }
      );
    });
    socket.on("typing", (data: { destId: string }) => {
      const destSocket = connectedUser.get(data.destId);
      if (destSocket) {
        io.to(destSocket).emit("friendTyping", { senderId: socket.data.user.id });
      }
    });
    
    socket.on("stopTyping", (data: { destId: string }) => {
      const destSocket = connectedUser.get(data.destId);
      if (destSocket) {
        io.to(destSocket).emit("friendStopTyping", { senderId: socket.data.user.id });
      }
    });
    

  });
};
