// Run this in mongosh (paste into an open shell or save and run with `mongosh <file>.js`)
use('tour');

const validator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'createdAt'],
    properties: {
      name: { bsonType: 'string', description: 'must be a string and is required' },
      description: { bsonType: 'string', description: 'tour description', nullable: true },
      price: {
        bsonType: ['double', 'int', 'long', 'decimal'],
        description: 'numeric price'
      },
      imageUrl: { bsonType: 'string', description: 'image URL', nullable: true },
      departure: { bsonType: 'string', description: 'departure location', nullable: true },
      spots: { bsonType: ['int', 'long'], description: 'available spots', minimum: 0 },
      createdAt: { bsonType: 'date', description: 'creation timestamp' },
      updatedAt: { bsonType: 'date', description: 'last update timestamp', nullable: true }
    }
  }
};

try {
  db.createCollection('tours', { validator, validationLevel: 'strict' });
  print('Created collection: tours');
} catch (e) {
  if (e.codeName === 'NamespaceExists') {
    print('Collection exists — updating validator');
    db.runCommand({ collMod: 'tours', validator, validationLevel: 'strict' });
  } else {
    throw e;
  }
}

db.tours.createIndex({ createdAt: -1 });
db.tours.createIndex({ name: 1 });

print('Done: collection "tours" with validator and indexes created/updated.');

//auth user
use('tour');

// Create/modify "tours" with a validator and indexes
const toursValidator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'createdAt'],
    properties: {
      name: { bsonType: 'string' },
      description: { bsonType: ['string','null'] },
      price: { bsonType: ['double','int','long','decimal','null'] },
      imageUrl: { bsonType: ['string','null'] },
      departure: { bsonType: ['string','null'] },
      spots: { bsonType: ['int','long','double','null'], minimum: 0 },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: ['date','null'] }
    }
  }
};

if (!db.getCollectionInfos({ name: 'tours' }).length) {
  db.createCollection('tours', { validator: toursValidator, validationLevel: 'strict' });
} else {
  db.runCommand({ collMod: 'tours', validator: toursValidator, validationLevel: 'strict' });
}
db.tours.createIndex({ createdAt: -1 });
db.tours.createIndex({ name: 1 });

// Create "users" collection and unique index on username
const usersValidator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['username','password','role','createdAt'],
    properties: {
      username: { bsonType: 'string' },
      password: { bsonType: 'string' },
      role: { enum: ['poster','finder'] },
      createdAt: { bsonType: 'date' }
    }
  }
};

if (!db.getCollectionInfos({ name: 'users' }).length) {
  db.createCollection('users', { validator: usersValidator, validationLevel: 'strict' });
} else {
  db.runCommand({ collMod: 'users', validator: usersValidator, validationLevel: 'strict' });
}
db.users.createIndex({ username: 1 }, { unique: true });