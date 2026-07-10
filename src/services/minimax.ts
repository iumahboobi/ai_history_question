export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  name?: string;
  content: string;
}

export const chatWithMinimax = async (
  messages: ChatMessage[],
  apiKey: string,
  groupId?: string
): Promise<string> => {
  // Minimax API sometimes requires GroupId in the URL parameters
  // Use api.minimax.io for Global keys and api.minimaxi.com for Mainland keys
  // By default we will use api.minimax.io which is the Global endpoint.
  // We can switch this to api.minimaxi.com if it's a Chinese key.
  const baseUrl = `https://api.minimax.io/v1/text/chatcompletion_v2`;
  // Some endpoints strictly require GroupId in the URL parameters
  const url = groupId ? `${baseUrl}?GroupId=${groupId}` : baseUrl;
  
  // Format messages to strictly match OpenAI/Minimax format
  const formattedMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'MiniMax-Text-01', // Updated to currently supported model on Global API
      messages: formattedMessages,
      stream: false
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Minimax API Error: ${response.status} ${response.statusText} - ${
        errorData ? JSON.stringify(errorData) : ''
      }`
    );
  }

  const data = await response.json();
  
  // Minimax sometimes returns API errors with a 200 OK status, but includes a base_resp object
  if (data.base_resp && data.base_resp.status_code !== 0) {
    throw new Error(`Minimax Error: ${data.base_resp.status_msg || JSON.stringify(data.base_resp)}`);
  }

  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  }

  throw new Error(`Unexpected API response: ${JSON.stringify(data)}`);
};
