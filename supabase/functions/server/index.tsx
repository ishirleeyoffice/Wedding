import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b8ec7463/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/make-server-b8ec7463/guestbook", async (c) => {
  try {
    const entries = await kv.getByPrefix("guestbook_");
    return c.json(entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  } catch (err) {
    console.error("Error fetching guestbook:", err);
    return c.json({ error: "Failed to fetch" }, 500);
  }
});

app.post("/make-server-b8ec7463/guestbook", async (c) => {
  try {
    const body = await c.req.json();
    const id = Date.now().toString() + "_" + Math.random().toString(36).substr(2, 9);
    const entry = {
      id,
      name: body.name,
      content: body.content,
      createdAt: new Date().toISOString()
    };
    await kv.set("guestbook_" + id, entry);
    return c.json(entry, 201);
  } catch (err) {
    console.error("Error creating guestbook entry:", err);
    return c.json({ error: "Failed to create" }, 500);
  }
});

app.delete("/make-server-b8ec7463/guestbook/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del("guestbook_" + id);
    return c.json({ success: true });
  } catch (err) {
    console.error("Error deleting guestbook entry:", err);
    return c.json({ error: "Failed to delete" }, 500);
  }
});

app.post("/make-server-b8ec7463/rsvp", async (c) => {
  try {
    const body = await c.req.json();
    const id = Date.now().toString() + "_" + Math.random().toString(36).substr(2, 9);
    const entry = {
      id,
      name: body.name,
      attending: body.attending,
      guestCount: body.guestCount,
      createdAt: new Date().toISOString()
    };
    await kv.set("rsvp_" + id, entry);
    return c.json(entry, 201);
  } catch (err) {
    console.error("Error creating RSVP entry:", err);
    return c.json({ error: "Failed to create" }, 500);
  }
});

// 식권 QR 사전 발급 - 하객 정보 등록
app.post("/make-server-b8ec7463/meal-ticket/guest", async (c) => {
  try {
    const body = await c.req.json();
    const id = Date.now().toString() + "_" + Math.random().toString(36).substr(2, 9);
    const entry = {
      id,
      name: body.name ?? "",
      phone: body.phone ?? "",
      createdAt: new Date().toISOString()
    };
    await kv.set("meal_ticket_guest_" + id, entry);
    return c.json(entry, 201);
  } catch (err) {
    console.error("Error creating meal-ticket guest entry:", err);
    return c.json({ error: "Failed to create" }, 500);
  }
});

Deno.serve(app.fetch);