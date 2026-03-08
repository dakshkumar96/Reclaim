# OpenAI Integration Setup Guide

## Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in to your OpenAI account
3. Click "Create new secret key"
4. Copy your API key (it starts with `sk-`)

## Step 2: Add API Key to Environment

Add your OpenAI API key to `Backend/database.env`:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

**Important:** Never commit your API key to git! Make sure `database.env` is in `.gitignore`.

## Step 3: Restart Backend Server

After adding the API key, restart your Flask backend:

```bash
cd Backend
python app.py
```

## Step 4: Test the Chatbot

1. Go to the ChatAI page in your frontend
2. Send a message like "How do I stay consistent with my habits?"
3. You should receive a real AI response!

## Features

- **Personalized Responses**: The AI coach knows your level, XP, active challenges, and streaks
- **Context-Aware**: Provides advice based on your current progress
- **Encouraging**: Designed to motivate and support your habit-building journey

## Cost Information

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens (recommended for most use cases)
- **GPT-4**: ~$0.03 per 1K tokens (better quality, more expensive)

The current setup uses GPT-3.5-turbo for cost efficiency. To upgrade to GPT-4, edit `Backend/AI/ai_coach.py` and change:
```python
model="gpt-3.5-turbo"  # Change to "gpt-4"
```

## Troubleshooting

### Error: "OPENAI_API_KEY not found"
- Make sure you added `OPENAI_API_KEY=your-key` to `Backend/database.env`
- Restart the backend server after adding the key

### Error: "Invalid API key"
- Check that your API key is correct
- Make sure there are no extra spaces or quotes around the key

### API Rate Limits
- Free tier has rate limits
- If you hit limits, wait a few minutes or upgrade your OpenAI plan

## Security Notes

- ✅ API key is stored server-side only
- ✅ Never expose API key in frontend code
- ✅ API key is loaded from environment variables
- ✅ All API calls go through your backend

