
import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";


@InputType()
class UsernamePasswordInput {
   @Field()
   username: string
   @Field()
   name : string
   @Field()
   password: string
}
@InputType()
class LoginInput  {
    @Field()
    username: string
    @Field()
    password: string
}

@Resolver()
export class UserResolver {
    @Mutation(()=> User)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em} : MyContext
    ) { 
        const hashpassword = await argon2.hash(options.password);
        const user = em.create(User, {username: options.username , password: hashpassword, name: options.name})
        await em.persistAndFlush(user);
        return user;
    }
    @Mutation(()=> User)
    async login(
        @Arg('options') options: LoginInput,
        @Ctx() {em} : MyContext
    ) { 
        const user = await em.findOne(User, {username: options.username});
        if(!user){
            return {
                errors: [{name: options.username}]
            }
        }
        const hashpassword = await argon2.hash(options.password);
        return user;
    }    
}