import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { postQuery } from "./modules/post/graphql/query.js";
let query = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        ...postQuery
    }
})

export const schema  = new GraphQLSchema({
    query,
})