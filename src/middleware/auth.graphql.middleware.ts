
import { UserRepository } from "../DB";
import { BadRequestException, NotFoundException, verifyToken } from "../utils";

export const isAuthGraphql =  async(context) => {

    const token = context.token;
    const payload = verifyToken(token);
    const userRepository = new UserRepository();
    const user = await userRepository.exist({ _id: payload._id },{},{
      populate:{path:"friends",select:"fullName firstName lastName"}
    });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    if (user.credentialUpdatedAt > new Date(payload.iat * 1000)) {
      throw new BadRequestException("token expired");
    }
    context.user = user;
   
  
};
