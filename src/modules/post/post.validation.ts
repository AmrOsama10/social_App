import z from "zod";
import { CreatePostDTO } from "./post.dto.js";

export const createPostSchema = z.object<CreatePostDTO>({
    content: z.string() as unknown as string,
})

export const addReactionSchema = z.object({
    id:z.string().length(24),
    reaction:z.number()
})

export const getPostSchema = z.object({
    id:z.string().length(24)
})

export const updateInfoSchema = z.object({
    id:z.string().length(24),
    content: z.string() 
})