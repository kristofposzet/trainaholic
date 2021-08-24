const { Database, CollectionType } = require('arangojs'),
  dbConfig = require('./conf'),
  db = new Database({
    url: dbConfig.url,
    databaseName: dbConfig.database,
  });

db.useBasicAuth(dbConfig.username, dbConfig.password);
const documentType = CollectionType.DOCUMENT_COLLECTION;
const edgeType = CollectionType.EDGE_COLLECTION;
const createCollection = (collections) => {
  console.log('Creating collections if they do not already exist...');
  collections.forEach((collectionObj) => {
    const collection = db.collection(collectionObj.name);
    // ha még nem létezik, létrehozzuk a kollekciót
    collection.create({ type: collectionObj.type })
      .catch(() => {}) // kikerüljük a "duplicate name" errort
      .then(() => collection.get('')) // megnézzük, hogy létezik-e
      .catch((err) => {
        console.error(`Failed to create collection ${collectionObj.name}: ${err}`);
      });
  });
};

createCollection([{ name: 'Exercise', type: documentType }, { name: 'User', type: documentType }, { name: 'TrainingPlan', type: documentType },
  { name: 'Locality', type: documentType }, { name: 'ExerciseType', type: documentType }, { name: 'Country', type: documentType },
  { name: 'BeLocated', type: edgeType },  { name: 'LocatedIn', type: edgeType }, { name: 'Room', type: documentType },
  { name: 'BelongsTo', type: edgeType }, { name: 'BelongsToClient', type: edgeType }, { name: 'BelongsToCoach', type: edgeType },
  { name: 'PaysAttention', type: edgeType }]);

module.exports = db;
