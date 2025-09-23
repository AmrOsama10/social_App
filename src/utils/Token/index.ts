
import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenProps } from "./token.interface.js";


export const generateToken = ({
  payload,
  secretKey = process.env.SECRET_KEY as string,
  options = { expiresIn: "10m" },
}: TokenProps) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = (
  token: string,
  secretKey: string = process.env.SECRET_KEY as string
) => {
  return jwt.verify(token, secretKey) as JwtPayload;
};