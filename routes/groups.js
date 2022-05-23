const express = require('express')
const router = express.Router();
const { MongoClient } = require("mongodb");
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.39aol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("Leaves");
const allGroups = database.collection('groups');
const usersCollection = database.collection('users');
const usersChat = database.collection('chats');

client.connect();

router.get('/', async (req, res, next) => {
    try {
        res.send(await allGroups.find({}).toArray());
    } catch (err) {
        next(err);
    }
})

// post groups
router.post('/', async (req, res, next) => {
    try {
        res.send(await allGroups.insertOne(req.body));
    } catch (err) {
        next(err);
    }
});

// set group id in user data
router.post('/saveinuserdata/:uid', async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const query = { uid: uid };
        const result = await usersCollection.updateOne(query, { $push: { groups: { $each: [req.body.groupId] } } });
        res.send(result);
    } catch (err) {
        next(err)
        console.log(err)
    }
});

// get group chat data
router.get('/groupchat/:groupId', async (req, res) => {
    try {
        const groupId = parseInt(req.params.groupId);
        const query = { groupId: groupId };
        res.send(await usersChat.find(query).toArray());
    } catch (err) {
        console.error(err);
    }
})




module.exports = router;