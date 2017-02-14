db.getCollection('posts').find({})

//hw 1
db.getCollection('posts').aggregate([
  {$unwind: '$comments'}
  ,
    {"$group" : {_id:"$comments.author", count:{$sum:1}}},
    { $sort : { "count" : -1 } }
])   
    
//hw2
db.zips.aggregate(
    {
	$match : { $and: [ 
            {"state": {$in: ["CA", "NY"]}},
            { "pop": { $gt: 25000 }}
        ]}  
    },
    {
	$group : { _id : { "_id":"_id", "state": "$state", "city": "$city"}, population : { $sum : "$pop" } } 
    },
    {
	$group : { _id : "_id", avg_population : { $avg : "$population" } } 
    }
  ); 

//hw3
db.getCollection('grades').aggregate([
  {$unwind: '$scores'},
  {
    $match : {"scores.type": {$in: ["exam", "homework"]}}  
  },
  {
    $group : { _id : "$class_id", avg_class : { $avg : "$scores.score" } } 
  },
  { $sort : { "avg_class" : -1 } }
]) 
  
//hw4
db.zips.aggregate([
    {$project:
     {
        first_char: {$substr : ["$city",0,1]},
        pop:"$pop"
     }
   },
   {$match : {"first_char": {$in: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}} },
    
    { $group: { _id: null, pop: {$sum:"$pop"} } }
])  
     
