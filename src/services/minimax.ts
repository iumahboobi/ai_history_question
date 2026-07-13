export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  name?: string;
  content: string;
}

export const chatWithMinimax = async (
  messages: ChatMessage[],
  apiKey: string
): Promise<string> => {
  // Using OpenRouter API
  const url = `https://openrouter.ai/api/v1/chat/completions`;
  
  // Format messages to match OpenAI/OpenRouter format
  const formattedMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.href, // Required by OpenRouter
      'X-Title': 'AI History Explorer', // Optional but recommended by OpenRouter
    },
    body: JSON.stringify({
      model: 'cohere/north-mini-code:free', // Using the free Cohere model via OpenRouter
      messages: formattedMessages,
      stream: false
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `OpenRouter API Error: ${response.status} ${response.statusText} - ${
        errorData ? JSON.stringify(errorData) : ''
      }`
    );
  }

  const data = await response.json();
  
  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  }

  throw new Error(`Unexpected API response: ${JSON.stringify(data)}`);
};

