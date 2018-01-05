


////////////    $expr
db.movies.find(
    {       
       $expr: { $gt : [ { $divide: [ "$metacritic", 10 ] }, "$imdb.rating" ] }
    }
 ).count();

////////////    arrayFilters

db.airline_claims.updateMany(
    {},
    { $unset: {"airlines.$[airlines]" : ""} },
    {arrayFilters: [{"airlines.airlineName":"-"}]}
)