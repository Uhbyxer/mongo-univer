db.getCollection('people').find({})
db.people.dropIndexes()

db.people.find({"address.state": "Nebraska", "last_name": /^G/, "job": "Police officer"})
    
db.people.find({"job": /^P/, "first_name": /^C/, "address.state": "Indiana"}).sort({"last_name": 1})    
    
db.people.find({"address.state": "Connecticut","birthday":{"$gte": ISODate("2010-01-01T00:00:00.00Z"),"$lt": ISODate("2011-01-01T00:00:00.00Z")}
    })    

-------
db.people.createIndex({"address.state":1, "job":1});

var exp = db.people.explain();
exp.find({"address.state": "Nebraska", "last_name": /^G/, "job": "Police officer"});    +
exp.find({"job": /^P/, "first_name": /^C/, "address.state": "Indiana"}).sort({"last_name": 1}) +-
+ exp.find({"address.state": "Connecticut","birthday":{"$gte": ISODate("2010-01-01T00:00:00.00Z"),"$lt": ISODate("2011-01-01T00:00:00.00Z")}})
    
-----
db.people.dropIndexes()
db.people.createIndex({"address.state":1, "job":1, "first_name":1});

exp.find({"address.state": "Nebraska", "last_name": /^G/, "job": "Police officer"});    +++
exp.find({"job": /^P/, "first_name": /^C/, "address.state": "Indiana"}).sort({"last_name": 1}) ++-
+ exp.find({"address.state": "Connecticut","birthday":{"$gte": ISODate("2010-01-01T00:00:00.00Z"),"$lt": ISODate("2011-01-01T00:00:00.00Z")}})

----
db.people.dropIndexes()
db.people.createIndex({"address.state":1, "last_name":1, "job":1});

exp.find({"address.state": "Nebraska", "last_name": /^G/, "job": "Police officer"});    +++
exp.find({"job": /^P/, "first_name": /^C/, "address.state": "Indiana"}).sort({"last_name": 1}) +++
+exp.find({"address.state": "Connecticut","birthday":{"$gte": ISODate("2010-01-01T00:00:00.00Z"),"$lt": ISODate("2011-01-01T00:00:00.00Z")}})

----
db.people.dropIndexes()
db.people.createIndex({"job":1, "address.state":1});

exp.find({"address.state": "Nebraska", "last_name": /^G/, "job": "Police officer"}); +
exp.find({"job": /^P/, "first_name": /^C/, "address.state": "Indiana"}).sort({"last_name": 1}) +-
--exp.find({"address.state": "Connecticut","birthday":{"$gte": ISODate("2010-01-01T00:00:00.00Z"),"$lt": ISODate("2011-01-01T00:00:00.00Z")}})


