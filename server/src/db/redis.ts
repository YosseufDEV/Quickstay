import { createClient } from 'redis';

const DB_PASSWORD = process.env.REDIS_PASSWORD || "";

const client = createClient({
    username: 'default',
    password: '',
    socket: {
        host: 'localhost',
        port: 6379
    }
});

client.on('error', err => console.log('Redis Client Error: ', err));

export default client;
