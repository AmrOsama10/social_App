
import jwt from "jsonwebtoken";
import { TokenProps } from "./token.interface.js";


export const generateToken = ({
  payload,
  secretKey = process.env.SECRET_KEY as string,
  options = { expiresIn: "10m" },
}: TokenProps) => {
  return jwt.sign(payload, secretKey, options);
};
