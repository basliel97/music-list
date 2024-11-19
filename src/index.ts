import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import db from './db.js';
import { cors } from 'hono/cors';

// Set up the Hono app
const app = new Hono();

app.use("*", cors());

// Fetch all music
app.get('/musics', async (c) => {
  const title = c.req.query("title"); // Extract 'title' query parameter
  try {
    let result;
    if (title) {
      // Search for music by title
      result = await db`SELECT * FROM music WHERE title ILIKE ${'%' + title + '%'}`;
    } else {
      // Fetch all music if no title query is provided
      result = await db`SELECT * FROM music`;
    }
    return c.json(result);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Error fetching music' }, 500);
  }
});


app.post('/musics', async (c) => {
  try {
    const body = await c.req.json();

    if (!body.title || !body.artist || !body.album || !body.genre || !body.release_date) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    const result = await db`INSERT INTO music (title, artist, album, genre, release_date) 
      VALUES (${body.title}, ${body.artist}, ${body.album}, ${body.genre}, ${body.release_date})`;

    return c.json(result);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to add music' }, 500);
  }
});

// Get music by ID
app.get('/music/:id', async (c) => {
  const id = c.req.param("id");
  try {
    const result = await db`SELECT * FROM music WHERE id = ${id}`;
    return c.json(result[0]);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to fetch music' }, 500);
  }
});

app.put('/musics/:id', async (c) => {
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    const result = await db`UPDATE music SET title = ${body.title}, artist = ${body.artist}, album = ${body.album}, genre = ${body.genre}, release_date = ${body.release_date} WHERE id = ${id}`;
    return c.json(result);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Failed to update music' }, 500);
    }
    });

    app.delete('/music/:id', async (c) => {
      const id = c.req.param("id");
      try {
        const result = await db`DELETE FROM music WHERE id = ${id}`;
        if (result.count === 0) {
          return c.json({ error: 'Music not found' }, 404);
        }
        return c.json({ success: true });
      } catch (error) {
        console.error(error);
        return c.json({ error: 'Failed to delete music' }, 500);
      }
    });

    

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
