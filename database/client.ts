import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const DB_NAME = 'markers.db';
export const db = drizzle(openDatabaseSync(DB_NAME), { schema });