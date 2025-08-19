# AI Chatbot Backend

A robust Node.js/Express backend for an AI chatbot application with OpenAI integration, conversation management, and comprehensive security features.

## Features

- 🤖 **OpenAI Integration**: Connect to OpenAI's GPT models for intelligent responses
- 💬 **Conversation Management**: In-memory conversation history with automatic cleanup
- 🔒 **Security**: CORS, Helmet, rate limiting, and input validation
- 🎭 **Multiple Chat Modes**: Chat, Assistant, and Creative modes
- 📝 **Input Validation**: Comprehensive request validation using Joi
- 🚨 **Error Handling**: Centralized error handling with detailed responses
- 📊 **Health Monitoring**: Health check endpoints and conversation statistics
- 🔄 **Graceful Shutdown**: Proper server lifecycle management

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Copy the `.env` file and update it with your settings:
   ```bash
   # Server Configuration
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   AI_MODEL=gpt-3.5-turbo
   MAX_TOKENS=1000
   TEMPERATURE=0.7
   
   # Optional: Set to 'production' for production environment
   NODE_ENV=development
   ```

4. **Get your OpenAI API key:**
   - Sign up at [OpenAI](https://platform.openai.com/)
   - Go to API Keys section
   - Create a new API key
   - Replace `your_openai_api_key_here` in the `.env` file

## Usage

### Development
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Production
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Quick Test
```bash
# Health check
curl http://localhost:5000/

# Send a chat message
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, world!", "mode": "chat"}'
```

### Available Endpoints
- `GET /` - Server status
- `GET /health` - Detailed health check
- `POST /api/chat` - Send chat message
- `POST /api/chat/new` - Start new conversation
- `GET /api/chat/history/:conversationId` - Get conversation history
- `DELETE /api/chat/:conversationId` - Delete conversation
- `GET /api/chat/stats` - Get conversation statistics

For detailed API documentation, see [API.md](./API.md).

## Project Structure

```
backend/
├── middleware/
│   ├── errorHandler.js      # Error handling middleware
│   └── validation.js        # Input validation middleware
├── routes/
│   └── chatRoutes.js        # Chat API routes
├── services/
│   ├── aiService.js         # OpenAI integration
│   └── conversationManager.js # Conversation history management
├── .env                     # Environment variables
├── index.js                 # Main server file
├── package.json             # Dependencies and scripts
├── API.md                   # API documentation
└── README.md               # This file
```

## Chat Modes

The backend supports three different chat modes:

1. **Chat Mode** (`"chat"`): Default friendly conversational mode
2. **Assistant Mode** (`"assistant"`): Professional, concise responses
3. **Creative Mode** (`"creative"`): Imaginative and expressive responses

## Security Features

- **CORS**: Configured to allow frontend communication
- **Helmet**: Security headers for protection against common vulnerabilities
- **Rate Limiting**: 
  - General API: 100 requests per 15 minutes
  - Chat endpoints: 10 requests per minute
- **Input Validation**: All inputs validated and sanitized
- **Error Handling**: Secure error responses without sensitive information leaks

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `AI_MODEL` | OpenAI model to use | gpt-3.5-turbo |
| `MAX_TOKENS` | Max tokens per response | 1000 |
| `TEMPERATURE` | Response creativity (0.0-1.0) | 0.7 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `NODE_ENV` | Environment mode | development |

## Error Handling

The backend includes comprehensive error handling for:
- Validation errors
- OpenAI API errors (quota, rate limits, etc.)
- Network connectivity issues
- Invalid conversation IDs
- Rate limiting violations

All errors are returned in a consistent format with appropriate HTTP status codes.

## Conversation Management

Conversations are stored in memory with:
- Automatic cleanup after 30 minutes of inactivity
- Maximum 20 messages per conversation (sliding window)
- Unique UUID identifiers
- Periodic cleanup every 5 minutes

## Deployment

### Local Production
```bash
NODE_ENV=production npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Considerations
- Set `NODE_ENV=production` for production
- Use a proper database for conversation storage in production
- Consider using Redis for session management
- Implement proper logging with tools like Winston
- Use process managers like PM2 for production deployments

## Troubleshooting

### Common Issues

1. **OpenAI API Key Issues**
   ```
   Error: AI service is not configured
   ```
   - Ensure your OpenAI API key is correctly set in the `.env` file
   - Verify the API key is valid and has sufficient quota

2. **CORS Issues**
   ```
   Access to fetch blocked by CORS policy
   ```
   - Check that `FRONTEND_URL` in `.env` matches your frontend URL
   - Ensure the frontend is running on the expected port

3. **Rate Limiting**
   ```
   Too many requests
   ```
   - Wait a few minutes before trying again
   - Check if you're making too many requests too quickly

### Logs
The server logs important events and errors to the console. In production, consider using a proper logging solution.

## Contributing

1. Follow the existing code style and patterns
2. Add appropriate error handling for new features
3. Update API documentation for new endpoints
4. Test thoroughly before submitting changes

## License

This project is licensed under the MIT License.
