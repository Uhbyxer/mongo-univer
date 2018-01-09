


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

//lookup

db.air_alliances.aggregate([
    {
      "$lookup": {
        "from": "air_routes",
        "let": {
          "airlines": "$airlines"
        },
        "pipeline": [{
               $match:
                   { $expr:
                          { $in: [ "$airline.name", "$$airlines"] }
                         
                   }
                
          },
          {
            "$project": {
              "_id": 0,
              "airplanes": "$airplane"
            }
          }
        ],
        "as": "fleet"
      }
    },
    {
      "$project": {
        "name": 1,
        "fleet": {
          "$size": {
            "$reduce": {
              "input": "$fleet.airplanes",
              "initialValue": [],
              "in": {
                "$setUnion": [
                  "$$value",
                  {
                    "$split": ["$$this", " "]
                  }
                ]
              }
            }
          }
        }
      }
    }
  ])

  ///// jsonScheme validation


  db.createCollection("claims", {
    validator : {
      $jsonSchema : {
        type: "object",
        properties: {
            airportCode: {type: "string", minLength: 3},
            airlineName: {type: "string", minLength: 5},
            claims: {type: "object"},
            airportName: {type: "string"},
            "claims.itemCategory": {type: "array", maxItems: 3},
            "claims.amount": {type: "string", pattern: "^\\$", description: "pattern: started with dollar"},
            "claims.claimType" : {},
            "claims.claimSite": {},
            "_id": {}    

        },
        allOf: [
            {required: ["airportCode", "airlineName", "claims"]}
        ],
        additionalProperties: false  
      }
    }
  }
)


db.claims.insert(
    {
        "airportCode": "ABE",
        "airportName": "Lehigh Valley International Airport, Allentown",
        "airlineName": "MongoAir",
        "claims": {
          "claimType": "Property Damage",
          "claimSite": "Checked Baggage",
          "itemCategory": [
            "Sporting Equipment & Supplies"
          ],
          "amount": "$180.00"
        }
      }
);