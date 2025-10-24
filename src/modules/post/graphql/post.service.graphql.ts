import { PostRepository } from "../../../DB/index.js"
import { isAuthGraphql } from "../../../middleware/auth.graphql.middleware.js"

export const getSpecificPost =  async (parent,args,context)=>{
   await isAuthGraphql(context)
    const postRepo = new PostRepository()
    const post = await postRepo.getOne({_id:args.id},{},{
        populate:[{
            path:"userId",
        }]
    })
    if(!post){
        throw new Error("Post not found")
    }
    return {
        message:"done",
        success:true,
        data:post
    }
}
    
export const getAllPosts = async (parent,args,context)=>{
    await isAuthGraphql(context)
    const postRepo = new PostRepository()
    const posts = await postRepo.getAll({},{},{
        populate:[{
            path:"userId",
        }]
    })
    if (!posts) {
        throw new Error("Posts not found")
    }
    return {
        message:"done",
        success:true,
        data:posts
    }
}