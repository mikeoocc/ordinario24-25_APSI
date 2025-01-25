import { MongoClient } from 'mongodb'
import type { Contact } from "./types.ts";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// Connection URL
const MONGO_URL = Deno.env.get('MONGO_URL')
if(!MONGO_URL){
  throw new Error('Bad mongo url. . .')
}

const client = new MongoClient(MONGO_URL);
await client.connect();
console.log('Connected successfully to server');

const dbName = 'ordinaria_24-25';
const db = client.db(dbName);

const contactCollection = db.collection<Contact>('contactos');

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {context: async() => ({ contactCollection })});
console.log(`🚀 Server ready at ${url}`);