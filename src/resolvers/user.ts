
import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
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
@ObjectType()
class FieldError{
    @Field()
    field: string
    @Field()
    message: string;
}
@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
  
    @Field(() => User, { nullable: true })
    user?: User;
  }

@Resolver()
export class UserResolver {
    @Mutation(()=> UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em} : MyContext
    ) :Promise<UserResponse>{ 
        if(options.username.length <= 2){
            return {
                errors: [{
                    field: "username",
                    message: "lenght must be greater then 2"
                }]
            }
        }
        if(options.password.length <= 2){
            return {
                errors: [{
                    field: "password",
                    message: "lenght must be greater then 2"
                }]
            }
        }
        
        const hashpassword = await argon2.hash(options.password);
        const user = em.create(User, {username: options.username , password: hashpassword, name: options.name})
        await em.persistAndFlush(user);
        return {user};
    }
    @Mutation(()=> UserResponse)
    async login(
        @Arg('options') options: LoginInput,
        @Ctx() {em} : MyContext
    ) :Promise<UserResponse> { 
        const user = await em.findOne(User, {username: options.username});
        if(!user){
            return {
                errors: [{
                    field: "username",
                    message: "that username does not exist",
                },
            ],
          };
        }
        const hashpassword = await argon2.verify(user.password, options.password);
        if(!hashpassword) {
            return { 
                errors: [{
                    field: "password",
                    message: "enter correct password"
                }]
            }
        }
        return {user,};
    }    
}