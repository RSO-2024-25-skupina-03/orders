import mongoose from 'mongoose';

// TODO: REPLACE WITH ACTUAL MONGODB URI
let dbURI = "mongodb://orders-mongo-db/Orders";
if (process.env.NODE_ENV === "production")
    dbURI = process.env.MONGODB_PROD_URI;
  else if (process.env.NODE_ENV === "test") 
    dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI);

// CONNECTION EVENTS LOGS
mongoose.connection.on("connected", () =>
    console.log(`Mongoose connected to ${dbURI}.`)
);
mongoose.connection.on("error", (err) =>
    console.log(`Mongoose connection error: ${err}.`)
);
mongoose.connection.on("disconnected", () =>
    console.log("Mongoose disconnected")
);

const gracefulShutdown = async (msg, callback) => {
    await mongoose.connection.close();
    console.log(`Mongoose disconnected through ${msg}.`);
    callback();
};


// BRING IN YOUR SCHEMAS & MODELS
import "./orders.js";

export { gracefulShutdown };