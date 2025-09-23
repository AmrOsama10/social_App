import {type SignOptions } from "jsonwebtoken";

export interface TokenProps {
  payload: object;
  secretKey?: string;
  options?: SignOptions;
}