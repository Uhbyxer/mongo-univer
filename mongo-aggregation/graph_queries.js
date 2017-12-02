
//1
db.air_airlines.aggregate([
    {$match: {country: {$in: ["Spain", "Germany", "Canada"]}}},
    {$lookup: {
        from: "air_alliances",
        foreignField: "airlines",
        localField: "name",
        as: "alliance"    
    }},
    {$match: {"alliance.name": "OneWorld"}},
    {$graphLookup: {
        startWith: "$base",
        from: "air_routes",
        connectFromField: "dst_airport",
        connectToField: "src_airport",
        as: "connections",
        maxDepth: 1
    }},
    {$project: {"connections.dst_airport": 1}},
    {$unwind: "$connections"},
    {$group: {"_id": "$connections.dst_airport"}}
])
  .toArray().length

//2
db.air_alliances.aggregate([
    {$match: {name: "OneWorld"}},
    {$graphLookup: {
        startWith: "$airlines",
        from: "air_airlines",
        connectFromField: "name",
        connectToField: "name",
        as: "airlines",
        maxDepth: 0,
        restrictSearchWithMatch: {
           country: {$in: ["Spain", "Germany", "Canada"]}
        }
    }},
    {$graphLookup: {
        startWith: "$airlines.base",
        from: "air_routes",
        connectFromField: "dst_airport",
        connectToField: "src_airport",
        as: "connections",
        maxDepth: 1
    }},
    {$project: {
        validAirlines: "$airlines.name",
        "connections.dst_airport": 1,
        "connections.airline.name": 1
    }},
    {$unwind: "$connections"},
    {$project: {
        isValid: {$in: ["$connections.airline.name", "$validAirlines"]}, 
        "connections.dst_airport": 1
    }},
    {$match: {isValid: true}},
    {$group: {"_id": "$connections.dst_airport"}}
]).toArray().length

//3

var airlines = [];
db.air_alliances.find({"name": "OneWorld"}).forEach(function(doc) {
    airlines = doc.airlines
})
var oneWorldAirlines = db.air_airlines.find({"name": {"$in": airlines}})
oneWorldAirlines.forEach(function(airline) {
    var arr = db.air_alliances.aggregate([
     {$graphLookup: {
        startWith: airline.base,
        from: "air_routes",
        connectFromField: "dst_airport",
        connectToField: "src_airport",
        as: "connections",
        maxDepth: 1
      }},
    ]).toArray()
      print(arr)
})

//4
db.air_routes.aggregate([
      {$lookup: {
          from: "air_alliances",
          foreignField: "airlines",
          localField: "airline.name",
          as: "alliance"    
      }},
      {$match: {"alliance.name": "OneWorld"}},
      
      {$lookup: {
          from: "air_airlines",
          foreignField: "name",
          localField: "airline.name",
          as: "airline"    
      }},
      
      {$graphLookup: {
          startWith: "$airline.base",
          from: "air_routes",
          connectFromField: "dst_airport",
          connectToField: "src_airport",
          as: "connections",
          maxDepth: 1
      }},    
      {$project: {"connections.dst_airport": 1}},
      {$unwind: "$connections"},
      {$group: {"_id": "$connections.dst_airport"}}    
  ]).toArray().length    
    