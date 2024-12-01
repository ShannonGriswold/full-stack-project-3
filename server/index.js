const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json());


//The connection to the database
const connect = require("./db/connection.js");

//Lets it use /api/posts to route to /routes/api/posts
const posts = require('./routes/api/posts');
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

//connect to the database
connect.connectToDatabase();

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});