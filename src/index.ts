import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
// import { Post } from "./entities/post";
import microConfig from "./mikro-orm.config";
import express from 'express';
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
const main = async () => { 
    const orm = await MikroORM.init(
        microConfig
    );
    await orm.getMigrator().up();
    const app = express();
    const apolloServer = new ApolloServer({ 
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: () => ({ em: orm.em })
    })
    apolloServer.applyMiddleware({app})
    app.listen(4000, ()=> { 
        console.log('Server is running at')
    })

    // const post = orm.em.create(Post,{title: "first post"})
    // await orm.em.persistAndFlush(post)
    // const posts =await orm.em.find(Post,{})
    // console.log(posts)
}

main().catch((err)=>  {
    console.log(err);
})