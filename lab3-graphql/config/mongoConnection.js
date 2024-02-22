import {MongoClient} from 'mongodb';
import {mongoConfig} from './settings.js';

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
    await dropCollections();
    
  }

  return _db;
};
const closeConnection = async () => {
  await _connection.close();
};

// Function to drop collections during connection setup
const dropCollections = async () => {
  // List of collections to drop
  // const collectionsToDrop = ['artists', 'albums', 'recordcompanies'];
  const collectionsToDrop = ['albums'];

  // Drop each collection
  for (const collectionName of collectionsToDrop) {
    try {
      await _db.collection(collectionName).drop();
      console.log(`Dropped collection: ${collectionName}`);
    } catch (error) {
      console.error(`Error dropping collection ${collectionName}:`, error);
    }
  }
};

export {dbConnection, closeConnection};
