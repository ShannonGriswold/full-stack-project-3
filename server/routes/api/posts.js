const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

//Get all Posts
router.get('/', async (req, res) => {
    const books = await loadBooksCollection();
    res.send(await books.find({}).toArray());
});

//Get one post by id
router.get('/:id', async (req, res) => {
    const books = await loadBooksCollection();
    res.send(await books.findOne({_id: new mongodb.ObjectId(req.params.id)}));
});

//Add Posts
router.post('/', async (req, res) => {
    const books = await loadBooksCollection();
    await books.insertOne({
        title: req.body.title,
        author: req.body.author,
        status: req.body.status,
        series: req.body.series,
        genre: req.body.genre,
        format: req.body.format,
        notes: req.body.notes,
    });
    res.status(201).send();
});

//Update Posts
router.post('/:id', async (req, res) => {
    const books = await loadBooksCollection();
    const updatedTask = {
        $set: {
            title: req.body.title,
            author: req.body.author,
            status: req.body.status,
            series: req.body.series,
            genre: req.body.genre,
            format: req.body.format,
            notes: req.body.notes,
        },
    }
    await books.updateOne({_id: new mongodb.ObjectId(req.params.id)}, updatedTask);
    res.status(200).send();
});

//Delete Posts
router.delete('/:id', async (req, res) => {
    const books = await loadBooksCollection();
    await books.deleteOne({_id: new mongodb.ObjectId(req.params.id)});
    res.status(200).send();
});


async function loadBooksCollection() {
    const client = await mongodb.MongoClient.connect('mongodb+srv://shannonGriswold:FullStack@fullstackproject3.nyzxi.mongodb.net/?retryWrites=true&w=majority&appName=FullStackProject3');

    return client.db('FullStack').collection('books');
}

module.exports = router;