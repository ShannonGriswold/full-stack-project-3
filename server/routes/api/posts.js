const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

//Get Posts
router.get('/', async (req, res) => {
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());
});

//Add Posts
router.post('/', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.insertOne({
        title: req.body.title,
        description: req.body.description,
        deadline: req.body.deadline,
        priority: req.body.priority,
        isComplete: req.body.isComplete
    });
    res.status(201).send();
});

//Update Posts
router.post('/:id', async (req, res) => {
    const posts = await loadPostsCollection();
    const updatedTask = {
        $set: {
            description: req.body.description,
            deadline: req.body.deadline,
            priority: req.body.priority,
            isComplete: req.body.isComplete
        },
    }
    await posts.updateOne({_id: new mongodb.ObjectId(req.params.id)}, updatedTask);
    res.status(200).send();
});

//Delete Posts
router.delete('/:id', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.deleteOne({_id: new mongodb.ObjectId(req.params.id)});
    res.status(200).send();
});


async function loadPostsCollection() {
    const client = await mongodb.MongoClient.connect('mongodb+srv://shannonGriswold:FullStack@fullstackproject3.nyzxi.mongodb.net/?retryWrites=true&w=majority&appName=FullStackProject3');

    return client.db('FullStack').collection('tasks');
}

module.exports = router;