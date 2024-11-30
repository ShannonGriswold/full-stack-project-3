const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = 'mongodb+srv://shannonGriswold:FullStack@fullstackproject3.nyzxi.mongodb.net/?retryWrites=true&w=majority&appName=FullStackProject3';


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// try {
//     //Connect the client to the server
//     await client.connect();
//     //Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
// } catch(err) {
//     console.error(err);
// }

//let db = client.db("FullStack");

let db;

module.exports = {
    connectToDatabase: () => {
        db = client.db("FullStack");
    },
    getDatabase: () => {
        return db;
    }
};