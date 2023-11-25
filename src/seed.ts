import * as fs from 'fs';
import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'service';

async function seedData() {
  try {
    const data = JSON.parse(fs.readFileSync('posts.json', 'utf8'));

    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);

    const postsCollection = db.collection('posts');
    await postsCollection.insertMany(data);

    console.log('Seeding completed successfully.');
    await client.close();
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

seedData();