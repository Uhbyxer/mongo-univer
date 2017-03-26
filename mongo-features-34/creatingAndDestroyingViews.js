function printCursor(curs) { 
    while (curs.hasNext()) { printjson(curs.next())}
};

db = db.getSiblingDB("personnel");  // analogous to 'use personnel'
    
var sevenEmployees = [
    { name: "Will Cross", team: "Curriculum", likes: ["physics", "lunch", "mongodb" ] },
    { name: "Zach Davis", team: "Curriculum", likes: ["video games", "windows", "lunch", "mongodb"] },
    { name: "Kirby Kohlmorgen", team: "Curriculum", likes: ["mongodb", "New York", "lunch"] },
    { name: "Graham Lowe", team: "University Platform", likes: ["mongodb", "Tim Horton's", "leadership"] },
    { name: "John Yu", team: "University Platform", likes: ["video games", "lunch", "mongodb", "rubik's cube"] },
    { name: "David Percy", team: "University Platform", likes: ["mongodb", "lunch", "video games", "puzzles"] },
    { name: "Jason Flax", team: "University Platform", likes: ["mongodb", "lunch", "current events", "design"] } ];
    
print("First, we'll initialize our data.");
db.employees.drop();
db.employees.insertMany(sevenEmployees);

print("Next, we'll create our view.")
db.createView( "justNameAndTeam", "employees", [
    { $project: { _id: 0, name: 1, team : 1 } } ] );

print("Next, we'll query our view, to remember what it looks like.");
printCursor(db.employees.find());

print("Now, let's look at the collections in the db.");
printjson(db.getCollectionNames());  // analogous to 'show collections'

print("Let's look into the system.views collection.");
printCursor(db.system.views.find());

print("Next, let's create a more interesting view of the 'employees' collection, one that determines what people on the Curriculum team like.\n")
db.createView( "whatCurriculumLikes", "employees", [
        { $match : { team : "Curriculum" } },
        { $unwind : "$likes" }, 
        { 
            $group : 
            { 
                _id : { topic : "$likes" },
                popularity : { $sum : 1 } 
            } 
        }, {
            $sort : { popularity: -1 }
        } ] );

print("Now that we've created a second view, let's look at the system.views collection, again.");
printCursor(db.system.views.find());

print("We've added another document to that system.views collection. Now, let's look at the new view we've created.");
printCursor(db.whatCurriculumLikes.find());

print("We can remove a view by dropping it:");
db.justNameAndTeam.drop();

print("Let's look at our list of collections, again.");
printjson(db.getCollectionNames());  // analogous to 'show collections'

print("Next, let's drop our underlying collection, and see what happens.");
db.employees.drop();

print("And we'll query the associated view:");
printCursor(db.whatCurriculumLikes.find());
print("It returned nothing. There are no documents in, so the view will have no documents out. It treats the missing underlying collection as an empty collection.");



