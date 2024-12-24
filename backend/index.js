const { MongoClient, ServerApiVersion } = require("mongodb");

const connectionString = 'mongodb://loglensdb:27001';

const client = new MongoClient(connectionString, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
});

client.connect()
    .then(async () => {
        console.log('Connected to MongoDB');
        const db = client.db('mydb');
        const collection = db.collection('mycollection');
        const document = await collection.findOne();
        console.log('Sample Document:', document);
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });
