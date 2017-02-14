//db.getCollection('products').find({})


//Q1
//use agg
db.products.aggregate([
    {$group:
     {
	 _id:"$manufacturer", 
	 num_products:{$sum:1}
     }
    }
]);
    
    db.products.aggregate([
    {$group:
     {
	 _id:"$category", 
	 num_products:{$sum:1}
     }
    }
]);
    
    
    

