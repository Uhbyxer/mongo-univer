

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

//============= lab *

db.movies.aggregate([
    {
      $match: {
        cast: { $elemMatch: { $exists: true } },
        directors: { $elemMatch: { $exists: true } },
        writers: { $elemMatch: { $exists: true } }
      }
    },
    {
      $project: {
        _id: 0,
        cast: 1,
        directors: 1,
        writers: {
          $map: {
            input: "$writers",
            as: "writer",
            in: {
              $arrayElemAt: [
                {
                  $split: ["$$writer", " ("]
                },
                0
              ]
            }
          }
        }
      }
    },
    {
      $project: {
        labor_of_love: {
          $gt: [
            { $size: { $setIntersection: ["$cast", "$directors", "$writers"] } },
            0
          ]
        }
      }
    },
    {
      $match: { labor_of_love: true }
    }
  ]).itcount()


  //================== lab 'cursor like stages'

  var pipeline = [
    { $match: { "tomatoes.viewer.rating" : {$gte: 3},  
    cast: { $elemMatch: { $exists: true } },
    "countries": { $elemMatch: { $eq: "USA" } }}},

    {
      $project: {
             title: 1,  
            tomatoRate:   "$tomatoes.viewer.rating",
            num_favs: {
               $size: { $setIntersection: ["$cast", [
                                "Sandra Bullock",
                                 "Tom Hanks",
                                 "Julia Roberts",
                                 "Kevin Spacey",
                                  "George Clooney"]] } 
        }
      }
    }
   ,
   {"$sort": { "num_favs": -1,  "tomatoRate": -1}},
   { "$skip": 24  },
   { "$limit": 1  }
   
];

db.getCollection('movies').aggregate(pipeline)

