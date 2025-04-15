import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'JSJovFEqU9SHQIBifPyrRwO2olQWwTlq',
    socket: {
        host: 'redis-15111.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 15111
    }
});


export default client;