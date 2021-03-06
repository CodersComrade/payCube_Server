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
        const merchantsCollection = database.collection("merchants");
        const budgetCollection = database.collection("budget");
        const expAccountCollection = database.collection("accounts");
        const addMoneyToAccountCollection = database.collection("addedMoney");

        //add money to accounts
        app.post('/addedMoney', async (req, res) => {
            const addedMoney = req.body;
            const result = await addMoneyToAccountCollection.insertOne(addedMoney);
            res.json(result);
        });

        // get all added money from accounts
        app.get('/getAddedMoney', async (req, res) => {
            const addedMoney = await addMoneyToAccountCollection.find({}).toArray();
            res.send(addedMoney);
        });


        //add accounts
        app.post('/accounts', async (req, res) => {
            const accounts = req.body;
            const result = await expAccountCollection.insertOne(accounts);
            res.json(result);
        });

        // get accounts
        app.get('/getAccounts', async (req, res) => {
            const accounts = await expAccountCollection.find({}).toArray();
            res.send(accounts);
        });

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


        //merchant get post put

        app.post('/merchants', async (req, res) => {
            const businessName = req.body.businessName;
            const businessLogo = req.files.businessLogo;
            const merchantPhone = req.body.merchantPhone;
            const merchantNid = req.body.merchantNid;
            const picData = businessLogo.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const merchant = {
                businessName,
                merchantPhone,
                merchantNid,
                businessLogo: imageBuffer
            }
            const result = await merchantsCollection.insertOne(merchant)

            res.json(result);
        })

        app.get('/merchants', async (req, res) => {
            const cursor = merchantsCollection.find({});
            const merchants = await cursor.toArray();
            res.send(merchants);
        })

        app.put('/merchants/:id', async (req, res) => {

            const id = req.params.id;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: `Approved`
                },
            };

            const filter = { _id: ObjectId(id) };
            const result = await merchantsCollection.updateOne(filter, updateDoc, options);

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
