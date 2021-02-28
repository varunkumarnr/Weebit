
import { Post } from "./entities/post";
import { __PROD__ } from "./constants";
import {MikroORM} from "@mikro-orm/core";
import path from "path";
export default {
    migrations:{
        path: path.join(__dirname,'./migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    },
    entities: [Post],
    dbName: 'weebit',
    type: "postgresql",
    password: "V@run2018",
    debug: !__PROD__,
} as Parameters<typeof MikroORM.init>[0]; 