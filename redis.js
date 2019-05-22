const redis = require("redis");
const client = redis.createClient(
    process.env.REDIS_URL || { host: "localhost", port: 6379 }
);

client.on("err", err => {
    console.log("REDIS err: ", err);
});

///--------FOR DEMO PURPOSES ONLY

// client.setex('name', 120, 'ivana')

// this is the function that promisifies callback functions

const { promisify } = require("util");

//Setex puts data into REDIS
exports.setex = promisify(client.setex).bind(client);
//GET pulls data or selects data from REDIS
exports.get = promisify(client.get).bind(client);
// DEL deletes data from REDIS
exports.del = promisify(client.del).bind(client);
