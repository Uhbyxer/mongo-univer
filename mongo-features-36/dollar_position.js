// insert the positional document
db.position.insert({"array": [1,2,3,4]});

// find the inserted document
db.position.findOne();

// update array at position -1
db.position.update({},{
  "$push": {
    array: {"$each": [5], "$position": -1}
  }
});

// fetch the document again
db.position.findOne();
