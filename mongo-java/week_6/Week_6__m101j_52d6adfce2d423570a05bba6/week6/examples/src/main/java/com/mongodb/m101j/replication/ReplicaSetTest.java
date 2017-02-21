package com.mongodb.m101j.replication;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

import java.net.UnknownHostException;
import java.util.Arrays;

import static java.util.Arrays.asList;

public class ReplicaSetTest {

    public static void main(String[] args) throws InterruptedException {
        MongoClient client = new MongoClient(asList(new ServerAddress("localhost", 27017),
                                                    new ServerAddress("localhost", 27018),
                                                    new ServerAddress("localhost", 27019)),
                                             MongoClientOptions.builder().requiredReplicaSetName("replset")
                                                               .build());

        MongoCollection<Document> collection = client.getDatabase("course").getCollection("replication");
        collection.drop();

        for (int i = 0; i < Integer.MAX_VALUE; i++) {
            collection.insertOne(new Document("_id", i));
            System.out.println("Inserted document: " + i);
            Thread.sleep(500);
        }
    }
}
