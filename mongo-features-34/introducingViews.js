// To follow what we're doing in the courseware,
// run everything through line 35. Then continue,
// as each operation is performed in the video.

function printCursor(curs) { 
    while (curs.hasNext()) { printjson(curs.next())}
};

db = db.getSiblingDB("personnel");  // analogous to 'use personnel'

print("\nFirst, let's set everything up.\n");

var sevenEmployees = [
    { name: "Will Cross", team: "Curriculum", likes: ["physics", "lunch", "mongodb" ] },
    { name: "Zach Davis", team: "Curriculum", likes: ["video games", "windows", "lunch", "mongodb"] },
    { name: "Kirby Kohlmorgen", team: "Curriculum", likes: ["mongodb", "New York", "lunch"] },
    { name: "Graham Lowe", team: "University Platform", likes: ["mongodb", "Tim Horton's", "leadership"] },
    { name: "John Yu", team: "University Platform", likes: ["video games", "lunch", "mongodb", "rubik's cube"] },
    { name: "David Percy", team: "University Platform", likes: ["mongodb", "lunch", "video games", "puzzles"] },
    { name: "Jason Flax", team: "University Platform", likes: ["mongodb", "lunch", "current events", "design"] } ];

Norberto = { name: "Norberto Leite", team: "Curriculum", likes: ["languages", "lunch", "mongodb", "leadership"] };

print("Dropping the database and inserting 7 documents into the 'employees' collection.\n")
db.dropDatabase();  // let's start clean
db.employees.insertMany( sevenEmployees );

print("First, let's create a view, 'justNameAndTeam', that's just a projection of the 'name' and 'team' fields of the 'employees' collection.\n")
db.createView( "justNameAndTeam", "employees", [
        { $project: { _id: 0, name: 1, team : 1 } } ] );

// Here's the start of the courseware video for Introducing Views
print("First, let's show collections");
printjson(db.getCollectionNames());  // analogous to 'show collections'

print("Next, let's look at the 'employees' collection.");
printCursor(db.employees.find());

print("Let's look at the system.views collection:\n");
printCursor(db.system.views.find());

print("Next, let's demonstrate that we can do a more complicated query:\n");
printCursor(db.justNameAndTeam.find( { name : { $lte : "K" } }, { name : 1 } ).sort( { name : -1 } ));

print("We can also aggregate on a view.");
db.justNameAndTeam.aggregate( [ { $group : { _id : 0, numDocuments : { $sum : 1 } } } ] );

print("What if we try to insert a document into a view?\n");
db.justNameAndTeam.insertOne( { name: "Shannon Bradshaw" } ); // this will fail   

print("But we *can* insert documents into the source collection:\n");
db.employees.insertOne( Norberto );
printCursor(db.justNameAndTeam.find());
