"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const mongodb_1 = require("mongodb");
const url = 'mongodb://localhost:27017';
const dbName = 'service';
async function seedData() {
    try {
        const data = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
        const client = new mongodb_1.MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const postsCollection = db.collection('posts');
        await postsCollection.insertMany(data);
        console.log('Seeding completed successfully.');
        await client.close();
    }
    catch (err) {
        console.error('Error seeding data:', err);
    }
}
seedData();
