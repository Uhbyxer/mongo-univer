

//============= lab 1
var pipeline = [{ $match: { "imdb.rating" : {$gte: 7},  
    "genres" : {$nin: ["Crime" ,"Horror"]},
    "rated" : {$in: ["PG" ,"G"]} ,
    "languages" : {$all: ["English", "Japanese"]}  
}}
];

db.getCollection('movies').aggregate(pipeline).itcount()


//============= lab 2
var pipeline = [{ $match: { "imdb.rating" : {$gte: 7},  
    "genres" : {$nin: ["Crime" ,"Horror"]},
    "rated" : {$in: ["PG" ,"G"]} ,
    "languages" : {$all: ["English", "Japanese"]}  
}},
    {$project: 
        {_id: 0, title: 1, rated: 1}
    }
];

db.getCollection('movies').aggregate(pipeline).itcount()

//============= lab 3
var pipeline = [
    {$project: {title: 1,  wordsCount: {$size: {$split: ["$title", " "]}}},        
    },
    {$match: {"wordsCount": {$eq: 1}}}
];

db.getCollection('movies').aggregate(pipeline).itcount()