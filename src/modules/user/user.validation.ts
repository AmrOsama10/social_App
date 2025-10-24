import {z}from "zod"
export const validateIdSchema= z.object({
    id : z.string().length(24)
})

export const requestFriendSchema = z.object({
  receiverId: z.string().length(24),
  senderId: z.string().length(24),
});
