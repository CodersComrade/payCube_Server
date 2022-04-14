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



        const budgetCollection = database.collection("budget");


        //add budget
        app.post('/budget', async (req, res) => {
            const budget = req.body;
            console.log(budget);
            const result = await budgetCollection.insertOne(budget);
            res.json(result);
        });

        // GET budget
        app.get('/getBudget', async (req, res) => {
            const budget = await budgetCollection.find({}).toArray();
            res.send(budget);
        });


        app.get('/accountno', async (req, res) => {
            const cursor = accountCollection.find({});
            const accountno = await cursor.toArray();
            res.send(accountno);
        })


        //marchent get post put

        app.post('/marchents', async (req, res) => {
            const businessName = req.body.businessName;
            const businessLogo = req.body.businessLogo;
            const marchentPhone = req.body.marchentPhone;
            const picData = businessLogo.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const marchent = {
                businessName,
                marchentPhone,
                businessLogo: imageBuffer
            }
            const result = await marchentsCollection.insertOne(marchent)

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
