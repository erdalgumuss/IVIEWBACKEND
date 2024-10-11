// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('iViewNewDB');

// Create a new document in the collection.
db.getCollection('admins').insertOne({
    "username": "admin",
    "password": "$2a$10$HSIyfGbA646Nu2jwqs73netJ8Eo8lD04KeEFO4VS5jJkrCCfSlu4q"
  }
  );
