import { MongoClient, ObjectId } from 'mongodb';
import { DB_COLLECTION_NAME, DB_NAME } from '../constants.js';

const client = new MongoClient(process.env.DB_URI);

export const insertData = async (username, email, password) => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Specify the database you want to work with
    const database = client.db(DB_NAME);
    const collection = database.collection(DB_COLLECTION_NAME);

    // Example operation: Insert a document
    const doc = { Username: username, Email: email, Password: password };
    const result = await collection.insertOne(doc);
    console.log(`New document inserted with the _id: ${result.insertedId}`);
  } finally {
    // Close the connection when you're done
    await client.close();
  }
};

export const findUser = async (username, email) => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Specify the database you want to work with
    const database = client.db(DB_NAME);
    const collection = database.collection(DB_COLLECTION_NAME);

    const result1 = await collection.findOne({ Username: username });
    const result2 = await collection.findOne({ Email: email });

    return result1 || result2;
  } finally {
    // Close the connection when you're done
    await client.close();
  }
};

export const updateDocumentById = async (id, newUsername) => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Specify the database you want to work with
    const database = client.db(DB_NAME);
    const collection = database.collection(DB_COLLECTION_NAME);

    // Example operation: Insert a document
    const doc = { Username: newUsername };
    const result = await collection.updateOne({ _id: id }, { $set: doc });
    console.log(`New document inserted with the _id: ${result.insertedId}`);
  } finally {
    // Close the connection when you're done
    await client.close();
  }
};
