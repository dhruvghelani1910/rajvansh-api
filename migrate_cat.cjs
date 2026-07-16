const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dhruvghelani2004:GqL6LP6fVMx2Mupa@rajvansh.26onatl.mongodb.net/rajvansh').then(async () => {
  const db = mongoose.connection.db;
  const categories = await db.collection('categories').find({}).toArray();
  const catMap = {};
  categories.forEach(c => { catMap[c.name] = c._id; });

  const products = await db.collection('products').find({}).toArray();
  let count = 0;
  for (let p of products) {
    if (typeof p.category === 'string' && catMap[p.category]) {
      await db.collection('products').updateOne({_id: p._id}, {$set: {category: catMap[p.category]}});
      console.log('Updated', p.productname, 'to category ID', catMap[p.category]);
      count++;
    }
  }
  console.log('Migration complete. Updated', count, 'products.');
  process.exit(0);
});
