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



        app.get('/accountno', async (req, res) => {
            const cursor = accountCollection.find({});
            const accountno = await cursor.toArray();
            res.send(accountno);
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
