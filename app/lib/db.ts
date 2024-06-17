import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;
console.log(MONGODB_URL);

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already Connected");
    return;
  }
  if (connectionState === 2) {
    console.log("Connecting...");
  }

  try {
    if (MONGODB_URL === undefined) {
      throw new Error("MONGODB_URL is not defined");
    }

    await mongoose.connect(MONGODB_URL, {

    });

    console.log(`Connected`);
  } catch (err) {
    console.log("Error", err);
    throw new Error(`Error ${err}`);
  }
};

export default connect
