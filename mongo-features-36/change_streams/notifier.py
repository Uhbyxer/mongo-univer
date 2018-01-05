#!/usr/bin/python
"""
Notifications shell application.

Usage:
    ./notifier.py [options]

Options:
    -h --help                   Help command that lists all different command line options.
    --uri <uri>                 MongoDB URI https://docs.mongodb.com/manual/reference/connection-string/ [default: mongodb://m036:30000,m036:30001,m036:30002/m036?replicaSet=CS]
    --database <dbname>           Database where your data resides. [default: m036]
    --collection <collname>     Collection where the data resides. [default: messages]
"""
import pymongo
import json
from docopt import docopt
from bson.json_util import dumps

def get_change_stream():
    """
    Method that determines which ChangeStream to be used by the notifier.
    TODO: Make the necessary changes to this method so it returns the expected
    notifier change stream.
    """
    # TODO - change the change stream pipeline
    pipeline = [
        {"$match": { "operationType" : "update" }}
    ]
    return pipeline

def notify(collection, change_stream):
    """
    Captures a ``change_stream`` on ``collection`` and prints out the captured
    messages"""
    #TODO - provide change streams options that allow the correct completion of this lab
    change_stream_options = { 'full_document':'updateLookup' }

    print("Ready for messages:")
    for msg in collection.watch(change_stream, **change_stream_options):
        print(dumps(msg, indent=2))

def connect(uri):
    """
    Establishes a connection to the Replica Set.
    Tries to connect to a replica set node within 5 seconds
    """
    try:
        mc = pymongo.MongoClient(uri, connect=True, socketTimeoutMS=5000,
        serverSelectionTimeoutMS=5000)
        mc.server_info()
    except Exception, err:
        print("Could not connect to {}!".format(uri))
        print("Make sure your replica set is correctly configured.")
        quit()
    return mc

def check_database(mc, dbname):
    if dbname in mc.database_names():
        return mc[dbname]
    print("Cannot find {} database on server {}".format(dbname, mc.primary ))
    print("Please make sure that you have correctly imported the ``users.json`` file")
    quit()

def check_collection(collection):
    """
    Read majority is required to support Change Streams.
    """
    try:
        rc = pymongo.read_concern.ReadConcern(level='majority')
        collection.with_options(read_concern=rc).find({'_id': {'$exists': 1}})
    except Exception, ex:
        print("error: {}".format(ex))
        print("enableMajorityReadConcern is required to support Change Streams")
        quit()
    return collection

def main(uri, dbname, collname):
    """
    Script `main` method that establishes a connection to the database given an
    `uri`, `dbname` and `collname`.
    Initiates the notification cycle that prints out the captured messages
    """
    mc = connect(uri)
    db = check_database(mc, dbname)
    collection = check_collection(db[collname])
    notify(collection, get_change_stream())

if __name__ == '__main__':
    opts = docopt(__doc__)
    main(opts['--uri'], opts['--database'], opts['--collection'] )
