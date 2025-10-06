import { z } from "zod";
import { GENDER } from "../../utils";
import { ForgetPasswordDTO, LoginDTO, RegisterDTO,   VerifyAccountDTO } from "./auth.dto.js";
export const registerSchema = z.object<RegisterDTO>({
  fullName: z.string().min(3).max(20) as unknown as string,
  email: z.email() as unknown as string,
  password: z.string() as unknown as string,
  phoneNumber: z.string().optional() as unknown as string,
  gender: z.enum(GENDER) as unknown as GENDER,
});

export const loginSchema = z.object<LoginDTO>({
  email:z.email() as unknown as string,
  password:z.string() as unknown as string
});

export const verifyAccountSchema = z.object<VerifyAccountDTO>({
  email:z.email() as unknown as string,
  otp:z.string().length(5) as unknown as string
})

export const forgetPasswordSchema = z.object<ForgetPasswordDTO>({
  email: z.email() as unknown as string,
  otp: z.string().length(5) as unknown as string,
  newPassword: z.string() as unknown as string,
});



// export const updatePasswordSchema = z.object<UpdatePasswordDTO>({
//   oldPassword: z.string() as unknown as string,
// });