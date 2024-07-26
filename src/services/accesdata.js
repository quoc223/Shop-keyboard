const connectToDatabase = require('./connectToDatabase');
async function getDataProduct(){
    try {
        // Find documents in the collection
        const db = await connectToDatabase();
        const col = db.collection("product");
        const cursor = col.find();
        
        // Iterate over the cursor to access documents
        await cursor.forEach(document => {
            console.log("Document found:\n", document);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
getDataProduct();
