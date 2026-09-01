import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('hello world'));

export default app;
