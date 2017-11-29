

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

//======================= lab all
var pipeline = [
    { $match: 
        { 
        "imdb.rating" : {$gte: 1},
        "imdb.votes" : {$gte: 1},  
        "languages" : {$in: ["English"]} ,
       "released": { $exists: true },
       "released":     { $type : "date" }  
    }},
    
    {$project: 
        {title: 1, rated: 1, "imdb.votes": 1, "imdb.rating": 1,
         year: { $year: "$released" },
       
            scaled_votes: 
            {
            $add: [
            1,
            {
                $multiply: [
                9,
                {
                    $divide: [
                    { $subtract: ["$imdb.votes", 5] },
                    { $subtract: [1521105, 5] }
                    ]
                }
                ]
            }
            ]
     }  ,
        }
    },
    
      { $match: 
        { 
        "year" : {$gte: 1990}
         }  
    },
    
    {
     $project: {
         title: 1,
         scaled_votes: 1,
         "imdb.votes": 1,
         "imdb.rating": 1,
         year: 1,
         normalized_rating: { $avg: [ "$scaled_votes", "$imdb.rating" ] }
     }
   },
   {
      "$sort": { "normalized_rating": 1 }
   },
   { "$limit": 1 }
    
];

db.getCollection('movies').aggregate(pipeline).pretty()


//====== group lab
db.movies.aggregate([
    {$match: {"awards": {$regex : ".*Oscar.*"}}},
    
     {$project: {
         "imdb.rating": 1,
          awards: 1, 
          awards_arr: { $split: ["$awards", " "] }
     }},
     {$match: {"awards_arr.0": new RegExp('^Won', "i")}},
     {$match: {"awards_arr.2": new RegExp('^Oscar', "i")}},
    
    
    {
      "$group": {
        "_id": 0,
        "min_rating": { "$min": "$imdb.rating" },
        "max_rating": { "$max": "$imdb.rating" },
        "average_rating": { "$avg": "$imdb.rating" },
        "deviation": { "$stdDevPop": "$imdb.rating" }
      }
    }
  ]).pretty()


  //====== unwind lab
  db.movies.aggregate([
    { $match: { 
        languages: { $elemMatch: { $eq: "English" } },
    }},

    { $unwind : "$cast" },
    
     {
        $group : {
           _id : "$cast",
           average: { $avg: "$imdb.rating" },
           numFilms: { $sum: 1 }
        }
      },
      
   {"$sort": { "numFilms": -1}},
   { "$limit": 3  }

 ])
