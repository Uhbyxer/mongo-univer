db.getCollection('grades').find({}).count()

db.grades.find( { }, { 'student_id' : 1, 'type' : 1, 'score' : 1, '_id' : 0 } ).sort( { 'student_id' : 1, 'score' : 1, } ).limit( 5 )

db.grades.aggregate( { '$group' : { '_id' : '$student_id', 'average' : { $avg : '$score' } } }, { '$sort' : { 'average' : -1 } }, { '$limit' : 1 } )

var items = db.grades.aggregate(
   [
     {
       $group:
         {
           _id: "$student_id",
           minScore: { $min: "$score" }
         }
     }
   ]
);
     
var arr = new Array();     
     
while(items.hasNext()) {
   item = items.next();
   //print(item);
   
   //var elem = db.grades.findOne( { $and: [{"student_id": { $eq: item._id}}, {"score": { $eq: item.minScore}}]);
   var elem = db.grades.findOne( { $and: [ { student_id: { $eq: item._id } }, { score: { $eq: item.minScore } } ] });
   //print(elem);
   //arr.push(elem);
   db.grades.remove(elem);
}    
//print(arr.length);

