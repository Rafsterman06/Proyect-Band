import dotenv from 'dotenv'
dotenv.config({ path: '/root/node-app/.env' })
import { createClient } from "./prep.js";
import { promises as fs } from 'fs';

// This method creates a client
let client = await createClient();
let dbName = process.env.DB_NAME
let collName = process.env.COLLECTION_NAME

async function run() {
  try {
    await client.connect();
    console.log("Connecting to MongoDB...");
    const coordinatesCollection = client
        .db(dbName)
        .collection(collName);

    const filter = { lat: { $gte: 40 } };

    /* Assignment: Run the method on the collection to find documents that match the filter
    and assign the output to the cursor variable 💡 */
    
    // const cursor =
    
    await fs.writeFile("/root/node-app/src/results.txt", "");
    for await (const doc of cursor) {
      await fs.appendFile("/root/node-app/src/results.txt", JSON.stringify(doc), "utf-8");
      console.log(doc);
    }
  } catch (err) {
    console.error(`Error: ${err}`);
  } finally {
    await client.close()
  }
}
run().catch(console.dir);
