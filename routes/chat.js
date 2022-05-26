const express = require('express')
const router = express.Router();
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.39aol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("Leaves");
const usersChat = database.collection('chats');

client.connect();


// post user message

router.post('/', async (req, res) => {
    try {
        res.send(await usersChat.insertOne(req.body));
    }
    catch (err) {
        console.log(err);
    }
})

// get room data 
router.get('/:room', async (req, res) => {
    try {
        const roomId = req.params.room;
        if (isNaN(roomId) !== true) {
            const query = { roomId: parseInt(roomId) };
            res.send(await usersChat.find(query).toArray());
        };
    } catch (err) {
        res.status(500).json({ message: 'There was errror in server' })
    }
});

// get all data
router.get('/', async (req, res) => {
    try {
        res.send(await usersChat.find({}).toArray());
    } catch (err) {
        console.log(err?.message)
    }
});

// delete message data
router.put('/deletemessage/:id', async (req, res) => {
    // try {
    const messageId = req.params.id;
    const query = { _id: ObjectId(messageId) };
    const updatedDoc = { $set: { deleted: true } };
    res.send(await usersChat.updateOne(query, updatedDoc));
    // } catch (err) {
    //     res.status(500).json({ message: 'There was errror in server' })
    // }
});


//delete all message from room
router.delete('/deleteallmessages/:roomId', async (req, res) => {
    try {
        const roomId = parseInt(req.params.roomId);
        const query = { roomId: roomId };
        res.send(await usersChat.deleteMany(query));
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});


module.exports = router;