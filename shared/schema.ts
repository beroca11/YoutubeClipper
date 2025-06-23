import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  youtubeId: text("youtube_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in seconds
  thumbnailUrl: text("thumbnail_url"),
  channelName: text("channel_name"),
  viewCount: text("view_count"),
  publishDate: text("publish_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clips = pgTable("clips", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull().references(() => videos.id),
  title: text("title").notNull(),
  startTime: real("start_time").notNull(), // in seconds
  endTime: real("end_time").notNull(), // in seconds
  duration: real("duration").notNull(), // in seconds
  quality: text("quality").notNull().default("720p"),
  format: text("format").notNull().default("mp4"),
  fileSize: integer("file_size"), // in bytes
  fileName: text("file_name"),
  downloadUrl: text("download_url"),
  isAiGenerated: boolean("is_ai_generated").default(false),
  processingStatus: text("processing_status").default("pending"), // pending, processing, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiSuggestions = pgTable("ai_suggestions", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").notNull().references(() => videos.id),
  title: text("title").notNull(),
  description: text("description"),
  startTime: real("start_time").notNull(),
  endTime: real("end_time").notNull(),
  duration: real("duration").notNull(),
  category: text("category").notNull(), // highlight, action, scenic, etc.
  confidence: real("confidence").notNull().default(0.8),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const insertClipSchema = createInsertSchema(clips).omit({
  id: true,
  createdAt: true,
  duration: true, // We'll calculate this on the server
}).extend({
  quality: z.string().optional(),
  format: z.string().optional(),
  fileSize: z.number().optional(),
  fileName: z.string().optional(),
  downloadUrl: z.string().optional(),
  isAiGenerated: z.boolean().optional(),
  processingStatus: z.string().optional(),
});

export const insertAiSuggestionSchema = createInsertSchema(aiSuggestions).omit({
  id: true,
  createdAt: true,
});

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertClip = z.infer<typeof insertClipSchema>;
export type Clip = typeof clips.$inferSelect;
export type InsertAiSuggestion = z.infer<typeof insertAiSuggestionSchema>;
export type AiSuggestion = typeof aiSuggestions.$inferSelect;
