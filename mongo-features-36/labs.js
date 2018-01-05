

db.movies.find(
    {       
       $expr: { $gt : [ { $divide: [ "$metacritic", 10 ] }, "$imdb.rating" ] }
    }
 ).count();


 