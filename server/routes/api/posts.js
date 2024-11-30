const express = require('express');
const mongodb = require('mongodb');

const db = require("../../db/connection.js");

const router = express.Router();

//Get all Posts
router.get('/', async (req, res) => {
    let collection = await db.getDatabase().collection("books");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

//Get one post by id
router.get('/:id', async (req, res) => {
    let collection = await db.getDatabase().collection("books");
    let result = await collection.findOne({_id: new mongodb.ObjectId(req.params.id)});
    if (!result) {
        res.send("Not found").status(404);
    } else {
        res.send(result).status(200);
    }
});

//Get Posts with a specific status
router.get('/status/:status', async (req, res) => {
    let collection = await db.getDatabase().collection("books");
    let results = await collection.find({status: req.params.status}).toArray();
    res.send(results).status(200);
});

//Add Posts
router.post('/', async (req, res) => {
    try {
        let collection = await db.getDatabase().collection("books");
        let result = await collection.insertOne({
            title: req.body.title,
            author: req.body.author,
            status: req.body.status,
            series: req.body.series,
            genre: req.body.genre,
            format: req.body.format,
            notes: req.body.notes,
            priority: req.body.priority,
            progress: req.body.progress,
            rating: req.body.rating,
            date: req.body.date,
        });
        res.status(201).send(result);
    } catch(err) {
        console.error(err);
        res.status(500).send("Error adding book");
    }
});

//Update Posts
router.post('/:id', async (req, res) => {
    try {
        let collection = await db.getDatabase().collection("books");
        const updatedTask = {
            $set: {
                title: req.body.title,
                author: req.body.author,
                status: req.body.status,
                series: req.body.series,
                genre: req.body.genre,
                format: req.body.format,
                notes: req.body.notes,
                priority: req.body.priority,
                progress: req.body.progress,
                rating: req.body.rating,
                date: req.body.date,
            },
        }
        let result = await collection.updateOne({_id: new mongodb.ObjectId(req.params.id)}, updatedTask);
        res.status(200).send(result);
    } catch(err) {
        console.error(err);
        res.status(500).send("Error updating record");
    }
});

//Delete Posts
router.delete('/:id', async (req, res) => {
    try {
        let collection = await db.getDatabase().collection("books");
        let result = await collection.deleteOne({_id: new mongodb.ObjectId(req.params.id)});
        res.status(200).send(result);
    } catch(err) {
        console.error(err);
        res.status(500).send("Error deleting book");
    }
});

module.exports = router;