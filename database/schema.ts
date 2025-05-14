import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";

export const markers = sqliteTable("markers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull().default(''),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  createdAt: text("created_at").default(new Date().toISOString()),
});

export const markerImages = sqliteTable("marker_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  markerId: integer("marker_id").references(() => markers.id, { onDelete: "cascade" }),
  uri: text("uri").notNull(),
  createdAt: text("created_at").default(new Date().toISOString()),
});

export type DbMarkerSelect = typeof markers.$inferSelect;
export type DbMarkerInsert = typeof markers.$inferInsert;
export type DbMarkerImageSelect = typeof markerImages.$inferSelect;
export type DbMarkerImageInsert = typeof markerImages.$inferInsert;