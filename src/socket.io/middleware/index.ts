import { Socket } from "socket.io";
import { NotAuthorizedException, verifyToken } from "../../utils/index.js";
import { UserRepository } from "../../DB/index.js";

export const socketAuth = async (socket: Socket, next: Function) => {
      try {
        const { authorization } = socket.handshake.auth;
        const payload = verifyToken(authorization);
        const userRepository = new UserRepository();
        const user = await userRepository.exist({ _id: payload._id });
        if (!user) throw new NotAuthorizedException("user not found");
        socket.data.user = user;
        next();
      } catch (error) {
        next(error);
      }
    };

