#!/bin/sh

mongo --quiet --eval 'db.getSiblingDB("records").travellers.insert({"name" : "John Doe", "lastEntry" : "2017-05-23T06:00:00.00", "lastEntryLocation" : "Berlin Brandenburg Airport", "ids" : [{passport: "C03005988", nationality: "Portugal"}, {driver_license_number: 243234234, state: "New York"}, {ssn: "123-45-6789", } ] })'

echo '================='
echo 'Original Document'
echo '================='

mongo --quiet --eval 'db.getSiblingDB("records").travellers.findOne()'

echo '==========================='
echo 'Aggregation Pipeline Output'
echo '==========================='

mongo --quiet --eval 'db.getSiblingDB("records").travellers.aggregate([{$project : {name : 1, lastEntry: {$dateFromString : {dateString : "$lastEntry", timezone : "Europe/Berlin"} }, ids: {$mergeObjects : "$ids"}, lastEntryLocation : 1 } } ]).pretty()'