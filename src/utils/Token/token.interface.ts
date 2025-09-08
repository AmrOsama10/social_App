import {type SignOptions } from "jsonwebtoken";

export interface TokenProps {
  payload: string | object | Buffer;
  secretKey?: string;
  options?: SignOptions;
}