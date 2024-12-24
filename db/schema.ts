import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  serial,
  text,
  integer,
  primaryKey,
  pgTable,
  varchar,
  pgEnum,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const assetType = pgEnum("type", [
  "video",
  "image",
  "other",
  "undefined",
]);
export const statusEnum = pgEnum("status", ["active", "disabled"]);
export const messageStatus = pgEnum("status", [
  "seen",
  "received",
  "failed",
  "canceled",
]);

export const assetTable = pgTable("assets", {
  id: varchar("id").primaryKey(),
  url: varchar("url").notNull(),
  height: integer("height").notNull(),
  width: integer("width").notNull(),
  type: assetType().default("undefined").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  asset_id: varchar("asset_id").references(() => assetTable.id),
  bio: text("bio"),
  status: statusEnum().default("disabled").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const sessionTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => userTable.id)
    .notNull()
    .unique(),
  expires_at: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const postTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  content: text("content"),
  asset_id: varchar("asset_id").references(() => assetTable.id),
  user_id: integer("user_id")
    .references(() => userTable.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const commentTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content"),
  asset_id: varchar("asset_id").references(() => assetTable.id),
  user_id: integer("user_id")
    .references(() => userTable.id)
    .notNull(),
  post_id: integer("post_id")
    .references(() => postTable.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const likeTable = pgTable(
  "likes",
  {
    user_id: integer("user_id").references(() => userTable.id),
    post_id: integer("post_id").references(() => postTable.id),
    like: boolean("like"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return [
      {
        pk: primaryKey({ columns: [table.user_id, table.post_id] }),
      },
    ];
  }
);

export const messageTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: varchar("content"),
  status: messageStatus().notNull(),
  sender_id: integer("sender_id").references(() => userTable.id),
  receiver_id: integer("receiver_id").references(() => userTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertAsset = InferInsertModel<typeof assetTable>;
export type SelectAsset = InferSelectModel<typeof assetTable>;

export type InsertUser = InferInsertModel<typeof userTable>;
export type SelectUser = InferSelectModel<typeof userTable>;

export type InsertSession = InferInsertModel<typeof sessionTable>;
export type SelectSession = InferSelectModel<typeof sessionTable>;

export type InsertPost = InferInsertModel<typeof postTable>;
export type SelectPost = InferSelectModel<typeof postTable>;

export type InsertComment = InferInsertModel<typeof commentTable>;
export type SelectComment = InferSelectModel<typeof commentTable>;

export type InsertLike = InferInsertModel<typeof likeTable>;
export type SelectLike = InferSelectModel<typeof likeTable>;

export type InsertMessage = InferInsertModel<typeof messageTable>;
export type SelectMessage = InferSelectModel<typeof messageTable>;
