//import mongoose from 'mongoose';

// export const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb+srv://progettoAgriTrento:pzsZ2WE4z0uUg58H@agritrento.hyvazu3.mongodb.net/?retryWrites=true&w=majority&appName=AgriTrento");
//     console.log('MongoDB connesso');
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// const uri = "mongodb+srv://progettoAgriTrento:pzsZ2WE4z0uUg58H@agritrento.hyvazu3.mongodb.net/?retryWrites=true&w=majority&appName=AgriTrento";
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
// async function run() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongoose.disconnect();
//   }
// }
// run().catch(console.dir);
