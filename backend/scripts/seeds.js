// establish database connection
const mongoose = require("mongoose");
const connection = process.env.MONGODB_URI;
mongoose.connect(connection);

// import model
const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");

// async function to inserting data to database
async function seedDatabase() {
    for (let i = 0; i < 100; i++) {
      // add user
    //   const user = { username: = `user${i}`, email: `user${i}@gmail.com` };
      const user = { username: `user${i}`, email: `user${i}@gmail.com` };
      const options = { upsert: true, new: true };
      const createdUser = await User.findOneAndUpdate(user, {}, options);
      
      // add item to user
      const item = {
        slug: `slug${i}`,
        title: `title ${i}`,
        description: `description ${i}`,
        seller: createdUser,
      };
      const createdItem = await Item.findOneAndUpdate(item, {}, options);
      
      // add comments to item
      if (!createdItem?.comments?.length) {
        let commentIds = [];
        for (let j = 0; j < 100; j++) {
          const comment = new Comment({
            body: `body ${j}`,
            seller: createdUser,
            item: createdItem,
          });
          await comment.save();
          commentIds.push(comment._id);
        }
        createdItem.comments = commentIds;
        await createdItem.save();
      }
    }
  }

seedDatabase()
  .then(() => {
  console.log("Finished DB seeding");
  process.exit(0);
})
.catch((err) => {
  console.log(`Error while running DB seed: ${err.message}`);
  process.exit(1);
});