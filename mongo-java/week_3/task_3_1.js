cursor = db.students.aggregate(
[{ "$unwind": "$scores" }, 
 { "$match": { "scores.type": "homework"}},
 { "$group": {'_id': '$_id', 'minitem': {
                '$min': "$scores.score"
            }
        }
    }

]);
    
cursor.forEach(
function(coll) {
    db.students.update({
        '_id': coll._id
    }, {
        '$pull': {
            'scores': {
                'score': coll.minitem
            }
        }
    })
})
    