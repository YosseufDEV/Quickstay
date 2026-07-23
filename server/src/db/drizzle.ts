import { drizzle as d } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import * as schema from './schema';

const drizzle = d(process.env.DATABASE_URL!, { schema, relations: { ...schema.relations }});

export type Transaction = Parameters<Parameters<typeof drizzle.transaction>[0]>[0];

export default drizzle;

