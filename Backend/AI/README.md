# AI Coach Integration

## Overview
The AI Coach uses OpenAI's GPT-5.2 model to provide personalized habit-building guidance to users.

## Features

### ✅ Implemented
- **OpenAI Integration**: Uses `gpt-5.2` model (latest AI capabilities)
- **Conversation History**: Maintains context across messages (last 10 messages)
- **Personalized Responses**: Uses user stats (level, XP, active challenges, streaks) for context
- **Error Handling**: Graceful fallback messages if API fails
- **Secure**: API key stored server-side only, never exposed to frontend

## Model Choice: GPT-5.2

We use `gpt-5.2` for:
- ✅ **Latest AI capabilities** - most advanced model available
- ✅ **Superior performance** - better understanding and responses
- ✅ **Enhanced context handling** - better conversation flow
- ✅ **Optimized for chat** - excellent for conversational AI

### Alternative Models
- `gpt-4o`: Previous generation, still excellent
- `gpt-4o-mini`: Cost-effective option
- `gpt-3.5-turbo`: Older, cheaper model

To change models, edit `Backend/AI/ai_coach.py`:
```python
model="gpt-5.2"  # Change to "gpt-4o", "gpt-4o-mini", or "gpt-3.5-turbo"
```

## Architecture

### Backend Flow
1. User sends message → Frontend (`ChatAI.jsx`)
2. Frontend calls → `/api/ai/chat` endpoint
3. Backend fetches → User context (level, XP, challenges, streaks)
4. Backend retrieves → Conversation history (last 10 messages)
5. Backend calls → OpenAI API with context + history
6. OpenAI returns → AI response
7. Backend stores → Conversation history
8. Backend returns → Response to frontend

### Security
- ✅ API key stored in `Backend/database.env` (gitignored)
- ✅ All API calls made server-side
- ✅ Frontend never sees API key
- ✅ Protected endpoint (requires JWT authentication)

## API Endpoint

### POST `/api/ai/chat`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "How do I stay consistent with my habits?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "AI response here...",
  "response": "AI response here..."
}
```

## Conversation History

- Stored in-memory per user (in `user_conversations` dict)
- Keeps last 10 messages (5 exchanges) for context
- Automatically managed - no manual cleanup needed

**Note:** For production, consider storing in:
- Redis (for scalability)
- Database (for persistence across server restarts)
- Session storage (for temporary sessions)

## Cost Estimation

With `gpt-5.2`:
- Average message: ~50 tokens input, ~100 tokens output
- Cost per message: Varies based on OpenAI pricing
- Check OpenAI pricing page for current rates

## Error Handling

If OpenAI API fails:
- Error is logged server-side
- User receives friendly fallback message
- No sensitive error details exposed to frontend

## Future Enhancements

- [ ] Store conversation history in database
- [ ] Add rate limiting per user
- [ ] Add conversation reset endpoint
- [ ] Support for different AI personalities
- [ ] Analytics on AI usage

