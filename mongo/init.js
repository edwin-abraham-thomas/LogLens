// Switch to the desired database or create it if it doesn't exist
db = db.getSiblingDB('mydb'); 

// Create a new user with readWrite access to the database
db.createUser({
    user: "user",
    pwd: "pass",
    roles: [{ role: "readWrite", db: "mydb" }]
});

// Create a new collection
db.createCollection('mycollection');

// Insert a sample document into the collection
db.mycollection.insertOne({
    name: "Sample Document",
    created_at: new Date(),
    status: "active"
});

print("Database, user, collection, and initial document created successfully.");