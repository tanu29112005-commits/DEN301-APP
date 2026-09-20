const express = require('express');
const redis = require('redis');

const app = express();
const port = 3000;

// Connect to Redis using environment variables
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
  socket: {
    host: redisHost,
    port: redisPort
  }
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function startServer() {
  await client.connect();

  app.get('/', async (req, res) => {
    try {
      const count = await client.incr('visits');
      res.send(`
        <h1>DEN 301 - Cloud Native Demo</h1>
        <p>This page has been visited <strong>${count}</strong> times.</p>
        <p>Served by container: ${require('os').hostname()}</p>
      `);
    } catch (err) {
      res.status(500).send('Error connecting to Redis: ' + err.message);
    }
  });

  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}

startServer();