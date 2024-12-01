const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//The connection to the database
const connect = require("./db/connection.js");

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors(
    {
        origin: ["https://full-stack-project-3-swart.vercel.app/"],
        mothods: ["POST", "GET", "DELETE"],
        credentials: true
    }
));

const posts = require('./routes/api/posts');

app.use('/api/posts', posts);


// //Handle production
// if(process.env.NODE_ENV === 'production') {
//     //static folder
//     app.use(express.static(__dirname + '/public/'));

//     //Handle SPA
//     app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
// }

const port = process.env.PORT || 5000;

connect.connectToDatabase();

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});