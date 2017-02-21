/*
 * Copyright (c) 2008 - 2013 10gen, Inc. <http://10gen.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package com.mongodb.m101j.replication;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.DuplicateKeyException;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.MongoException;
import com.mongodb.ServerAddress;
import com.mongodb.WriteConcern;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.net.UnknownHostException;
import java.util.Arrays;

import static java.util.Arrays.asList;

public class WriteConcernTest {
    public static void main(String[] args) throws UnknownHostException, InterruptedException {
        MongoClient client = new MongoClient(asList(new ServerAddress("localhost", 27017),
                                                    new ServerAddress("localhost", 27018),
                                                    new ServerAddress("localhost", 27019)),
                                             MongoClientOptions.builder().writeConcern(WriteConcern.JOURNALED)
                                                               .build());


        MongoDatabase database = client.getDatabase("course").withWriteConcern(WriteConcern.REPLICA_ACKNOWLEDGED);
        MongoCollection<Document> collection = database.getCollection("replication");

        collection.drop();

        Document doc = new Document("_id", 1);

        collection.insertOne(doc);

        try {
            collection.withWriteConcern(WriteConcern.UNACKNOWLEDGED).insertOne(doc);
        } catch (DuplicateKeyException e) {
            System.out.println(e.getMessage());
        }

    }
}
