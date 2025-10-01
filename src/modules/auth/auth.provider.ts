
import { BadRequestException, NotFoundException } from '../../utils';
import { UserRepository } from './../../DB';
import { VerifyAccountDTO } from './auth.dto';
export const authProvider = {
  async checkOtp(verifyAccountDTO: VerifyAccountDTO) {
    const userRepository = new UserRepository();
    const userExist = await userRepository.exist({
      email: verifyAccountDTO.email,
    });
    if (!userExist) {
      throw new NotFoundException("user not found");
    }
    if (!userExist.otp || !userExist.otpExpire) {
      throw new BadRequestException("otp not found");
    }
    if (userExist.otp != verifyAccountDTO.otp)
      throw new BadRequestException("invalid otp");
    if (userExist.otpExpire < new Date())
      throw new BadRequestException("expire otp");
  },
};