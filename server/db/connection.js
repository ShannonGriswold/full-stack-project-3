const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = 'mongodb+srv://shannonGriswold:FullStack@fullstackproject3.nyzxi.mongodb.net/?retryWrites=true&w=majority&appName=FullStackProject3';


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

//Stores the database
let db;

module.exports = {
    connectToDatabase: () => {
        client.connect();
        db = client.db("FullStack");
    },
    getDatabase: () => {
        return db;
    }
};