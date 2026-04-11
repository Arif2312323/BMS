import {config as conf} from "dotenv";
conf();

const _config = {
    port : process.env.PORT as string,
    databaseUrl : process.env.MONGO_URI as string,
    jwtSecretKey : process.env.JWT_SECRET_KEY as string,
    hashSecret : process.env.HASH_SECRET as string,
    emailUsename : process.env.EMAIL_USERNAME as string,
    emailPassword : process.env.EMAIL_PASSWORD as string,
}

export const config = Object.freeze(_config);