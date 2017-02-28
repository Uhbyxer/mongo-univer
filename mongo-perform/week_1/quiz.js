
db.getCollection('people').find({"last_name": "Frazier", "first_name": "Jasmine"})

db.getCollection('people').find({"job":"Jewellery designer", "employer":"Baldwin-Nichols"})

db.getCollection('people').find({"job":"Jewellery designer", "employer":"Baldwin-Nichols", "last_name" : "Cook"})


db.getCollection('people').find({"job":"Jewellery designer", "employer":"Baldwin-Nichols", "first_name" : "Sara"})


====================
 ./mongo m201
db.getCollection('people').getIndexes()
db.getCollection('people').sort({job:1, employer:1});

db.getCollection('people').find({job:"Graphic designer"}).sort({birthday:-1});

var exp = db.people.explain("executionStats");
exp.find({}).sort({job:1, employer:1, last_name:1, first_name:1});
exp.find({}).sort({job:1, employer:1});
exp.find({}).sort({employer:1, job:1});
exp.find({job:"Graphic designer"}).sort({job:-1});
exp.find({job:"Graphic designer"}).sort({job:-1, employer:-1});
exp.find().sort({job:-1, employer:-1});


db.products.insert({
    productName: "MongoDB Short Sleeve T_Shirt",
    categories: ["T-Shirts", "Clothing", "Apparel"],
    stock: {
        size: "L",
        color: "green",
        quantity: 100
        }
    });

db.products.find().pretty()
db.products.createIndex({"stock.quantity": 1})    

var exp = db.products.explain();
exp.find({"stock.quantity":100});    


db.products.insert({
    productName: "MongoDB Long Sleeve T_Shirt",
    categories: ["T-Shirts", "Clothing", "Apparel"],
    stock:[ 
        {
          size: "S",
          color: "red",
          quantity: 25
        },
        {
          size: "S",
          color: "blue",
          quantity: 10,
        },        

        {
          size: "M",
          color: "blue",
          quantity: 50,
        },        
       ] 
    });

db.products.createIndex({categories:1, "stock.quantity": 1})
db.products.createIndex({productName:1, "stock.quantity": 1})

-------
db.restaurant.insert({
    name: "Han Dynasty",
    cuisine: "Sinchuan",
    stars: 4.4,
    adress :{
        street : "90 3rd Ave",
        city: "New York",
        state: "NY",
        zipcode: "10003"
        
    }
})

db.restaurant.createIndex(
    {"adress.city": 1, "cuisine": 1},
    {partialFilterExpression: {"stars" : {$gte: 3.5}}}
);
db.restaurant.dropIndexes();  
    
var exp = db.restaurant.explain();
exp.find({"adress.city":"New York", cuisine: "Sinchuan"}); 
exp.find({"adress.city":"New York", cuisine: "Sinchuan", stars: {$gt: 4.0}});  

--------

db.createCollection("foreign_text", {collation: {locale: "pt"}})
db.foreign_text.insert({name: "Maximo", text: "Bom bom bom"})
db.foreign_text.createIndex({name: 1}, {collation: {locale:"it"}})
db.foreign_text.getIndexes()

var exp = db.foreign_text.explain();
exp.find({name:"Maximo"}).collation({locale:"it"});

****
db.createCollection("case_ins", {collation: {locale: "en", strength:1}})
db.case_ins.insert({name: "aAAaa"})
db.case_ins.find().sort({name:-1})


