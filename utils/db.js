import mongoose from 'mongoose';

// save the previous connection to the {}
const connection = {};

async function connect() {
  if (connection.isConnected) {
    console.log('already connected');
    return;
  }
  // have connection in connection que and failed
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    // connected
    if (connection.isConnected === 1) {
      console.log('use previous connection');
      return;
    }
    // not in connected mode
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URI);
  console.log('new connection');
  connection.isConnected = db.connections[0].readyState;
}
// only disconnect in the production mode but not in development mode
async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log('not disconnected');
    }
  }
}
function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connect, disconnect, convertDocToObj };
export default db;