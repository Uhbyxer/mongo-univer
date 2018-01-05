// insert documents
db.grades.insertMany([
{
   "student" : "John Doe",
   "class" : "M036",
   "homework" : .95,
   "midterm" : .90,
   "final" : .85
},
{
   "student" : "Jane Doe",
   "class" : "M036",
   "homework" : .99,
   "midterm" : .82,
   "final" : .91
},
{
   "student" : "Joe Doe",
   "class" : "M036",
   "homework" : .70,
   "midterm" : .75,
   "final" : .85
},
{
   "student" : "Sue Doe",
   "class" : "M036",
   "homework" : .89,
   "midterm" : .88,
   "final" : .91
},
{
   "student" : "Phil Doe",
   "class" : "M036",
   "homework" : .81,
   "midterm" : .83,
   "final" : .79
},
{
   "student" : "Alice Doe",
   "class" : "M036",
   "homework" : .84,
   "midterm" : .91,
   "final" : .89
}
]);


// query documents using ``$expr`` operator
db.grades.find(
   {
      "class" : "M036",
      $expr: { $gt : [ "$midterm", "$final" ] }
   }
);
