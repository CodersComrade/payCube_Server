const express = require('express');
const app = express();

const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');


const cors = require('cors');
require('dotenv').config();


const ObjectId = require('mongodb').ObjectId


app.use(cors());

app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gmioh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {
    try {
        await client.connect();
        const database = client.db("fakeAccountNo");
        const accountCollection = database.collection("bbBank");
        const marchentsCollection = database.collection("marchents");



        app.get('/accountno', async (req, res) => {
            const cursor = accountCollection.find({});
            const accountno = await cursor.toArray();
            res.send(accountno);
        })

        //marchent
        app.post('/marchents', async (req, res) => {
            const marchents = req.body;
            const cursor = marchentsCollection.insertOne(marchents);
            console.log(req.body);
            res.json(result);
        })

        app.get('/marchents', async (req, res) => {
            const cursor = marchentsCollection.find({});
            const marchents = await cursor.toArray();
            res.send(marchents);
        })

        app.put('/marchents/:id', async (req, res) => {

            const id = req.params.id;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: `Approved`
                },
            };

            const filter = { _id: ObjectId(id) };
            const result = await marchentsCollection.updateOne(filter, updateDoc, options);

        })



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {

    res.send('Hello from World!')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
