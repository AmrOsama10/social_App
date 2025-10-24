import { GraphQLID } from "graphql"
import { PostResponse, postsResponse } from "./post-type.js"
import { getAllPosts, getSpecificPost } from "./post.service.graphql.js"


export const postQuery = {
    getPost:{
        type:PostResponse,
        args:{
            _id:{type:GraphQLID}
        },
        resolve:getSpecificPost
    },
    getPosts:{
        type:postsResponse,
        resolve:getAllPosts
    }
}
    
