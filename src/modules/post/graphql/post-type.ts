import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UserType } from "../../user/graphql/user-type.js";

export const PostType = new GraphQLObjectType({
    name:"Post",
    fields: {
       _id:{type:GraphQLID},
       content:{type:GraphQLString},
       createdAt:{type:GraphQLString},
       updatedAt:{type:GraphQLString},
       userId:{type:UserType}
    }
})

export const PostResponse = new GraphQLObjectType({
    name:"PostResponse",
    fields: {
       message:{type:GraphQLString},
       success:{type:GraphQLBoolean},
       data:{type:PostType}
    }
})

export const postsResponse = new GraphQLObjectType({
    name:"PostsResponse",
    fields: {
       message:{type:GraphQLString},
       success:{type:GraphQLBoolean},
       data:{type: new GraphQLList(PostType)}
    }
})