from .client import get_openai_client
import logging

logger = logging.getLogger(__name__)

# System prompt for the AI coach
SYSTEM_PROMPT = """You are a friendly and motivating AI habit coach for the Reclaim app. 
Your role is to help users build better habits, stay consistent, and achieve their goals.

Guidelines:
- Be encouraging and supportive
- Provide practical, actionable advice
- Use a conversational, friendly tone
- Reference habit-building principles (consistency, small wins, etc.)
- Help users overcome common obstacles
- Celebrate their progress
- Keep responses concise but helpful (2-4 sentences typically)

The user is working on building habits through daily challenges. They can check in daily, earn XP, and track streaks. 
Be their supportive coach and guide them on their habit-building journey."""

def get_ai_response(user_message, user_context=None, conversation_history=None):
    """
    Get AI response from OpenAI
    
    Args:
        user_message: The user's message
        user_context: Optional dict with user stats (level, xp, active_challenges, etc.)
        conversation_history: Optional list of previous messages for context
    
    Returns:
        str: AI response message
    """
    try:
        client = get_openai_client()
        
        # Build context message if available
        context_text = ""
        if user_context:
            context_parts = []
            if user_context.get('level'):
                context_parts.append(f"Level {user_context['level']}")
            if user_context.get('xp'):
                context_parts.append(f"{user_context['xp']} XP")
            if user_context.get('active_challenges'):
                context_parts.append(f"{user_context['active_challenges']} active challenges")
            if user_context.get('current_streak'):
                context_parts.append(f"{user_context['current_streak']} day streak")
            
            if context_parts:
                context_text = f"\n\nUser context: {', '.join(context_parts)}"
        
        # Create messages array
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Add conversation history if available (keep last 10 messages for context)
        if conversation_history:
            # Filter to keep only last 10 messages to avoid token limits
            recent_history = conversation_history[-10:] if len(conversation_history) > 10 else conversation_history
            messages.extend(recent_history)
        
        # Add current user message with context
        messages.append({"role": "user", "content": user_message + context_text})
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-5.2",  # Using GPT-5.2 for latest AI capabilities
            messages=messages,
            max_tokens=300,
            temperature=0.7,
        )
        
        # Extract and return the response
        ai_message = response.choices[0].message.content.strip()
        return ai_message
        
    except Exception as e:
        # Log error server-side
        logger.error(f"OpenAI API error: {e}", exc_info=True)
        # Re-raise the exception so the endpoint can handle it properly
        raise

