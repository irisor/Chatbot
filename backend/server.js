import express from 'express'
import cors from 'cors'
import path from 'path'
import { processChatStream } from './services/chat.service.js'
import { loggerService } from './services/logger.service.js';

const app = express();
const port = 3031;

console.log("NODE_ENV:", process.env.NODE_ENV)

const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5174',
        'http://localhost:5174'
    ],
    credentials: true
}


//* App Configuration
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())


app.post('/chat', async (req, res) => {
  const { message, history } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required in the request body' });
  }
  
  try {
    const result = await processChatStream(message, history);
    res.status(200).json(result);
  } catch (error) {
    loggerService.error('Error processing chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//* Express Example Routing:
app.get('/', (req, res) => {
    res.send('<h1>Default Data</h1>')
})

//* For SPA (Single Page Application) - catch all routes and send to the index.html
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
