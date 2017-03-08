db.getCollection('restaurants').find({}).count() 

db.restaurants.createIndex({
        "cuisine":1,
        "name": 1,
        "address.zipcode":1,
    }
, {"background": true})

db.people.createIndex({
        "last_name":1}
, {"background": true})

db.people.createIndex({
    "address.state":1,    
    "last_name":1
    }
)

db.adminCommand( { listDatabases: 1 } )

var exp = db.people.explain("queryPlanner"); 
var expRun = db.people.explain("executionStats"); 
var expAll = db.people.explain("allPlansExecution"); 

expRun.find({"last_name" : "Johnson", "address.state":"New York"});

db.people.find({"last_name" : "Johnson", "address.state":"New York"});

var res = db.people.find({"last_name" : "Johnson", "address.state":"New York"}).sort({birthday:1}).explain("executionStats");

-------lab31
db.restaurants.createIndex({
    "address.state":1,    
    "name":1,
    "stars":1
    }
)    
    
db.restaurants.createIndex({
    "address.state":1,    
    "stars":1,
    "name":1,
    }
)  

db.restaurants.createIndex({
    "address.state":1,    
    "name":1,
    }
)   
    
db.restaurants.createIndex({
    "address.state":1,    
    }
)      
    
    


var exp = db.restaurants.explain("executionStats");
exp.find({ "address.state": "NY", stars: { $gt: 3, $lt: 4 } }).sort({ name: 1 }).hint("address.state_1_name_1_stars_1")

exp.find({ "address.state": "NY", stars: { $gt: 3, $lt: 4 } }).sort({ name: 1 }).hint("address.state_1_stars_1_name_1")

exp.find({ "address.state": "NY", stars: { $gt: 3, $lt: 4 } }).sort({ name: 1 }).hint("address.state_1_name_1")

exp.find({ "address.state": "NY", stars: { $gt: 3, $lt: 4 } }).sort({ name: 1 }).hint("address.state_1")

--------4
db.restaurants.dropIndexes();
var exp = db.restaurants.explain("executionStats");
exp.find({"address.zipcode": {$gt: "50000"}, cuisine: "Sushi"}).sort({stars: -1})

db.restaurants.createIndex({"address.zipcode":1, cuisine:1, stars:1})
db.restaurants.createIndex({cuisine:1, "address.zipcode":1, stars:1})
db.restaurants.createIndex({cuisine:1, stars:1, "address.zipcode":1})

db.restaurants.find({"address.zipcode":'50000'}).count()
db.restaurants.find({"address.zipcode":{$gt: "50000"}}).count()

!!!!  
Index Selectivity
Equality -> Sort -> Range

db.restaurants.find({name: {$gt: 'L'}, cuisine: "Sushi", stars: {$gte: 4.0}})
exp.find({name: {$gt: 'L'}, cuisine: "Sushi", stars: {$gte: 4.0}})
db.restaurants.createIndex({name:1, cuisine:1, stars:1, })



