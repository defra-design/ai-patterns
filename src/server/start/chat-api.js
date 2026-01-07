import fetch from 'node-fetch'

import { config } from '../../config/config.js'
import { marked } from 'marked'

/**
 * Custom error class for chat API errors that includes HTTP status code
 */
class ChatApiError extends Error {
  constructor (message, statusCode, timestamp) {
    super(message)
    this.name = 'ChatApiError'
    this.statusCode = statusCode
    this.timestamp = timestamp
    this.errorCode = `BR${statusCode}-${timestamp}`
  }
}

/**
 * Generates a timestamp string for error codes
 * @returns {string} Timestamp in format YYYYMMDDHHmmss
 */
function generateErrorTimestamp () {
  const now = new Date()
  return now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
}

/**
 * Calls the chat API with a user question and returns the response.
 *
 * @param {string} question - The user's question
 * @param {string} modelId - The ID of the AI model to use
 * @param {string} conversationId - Optional conversation ID to continue an existing conversation
 * @returns {Promise<Object>} The API response containing conversationId and messages
 * @throws {ChatApiError} If the API returns a 400 error
 * @throws {Error} If the API request fails for other reasons
 */
async function sendQuestion (question, modelId, conversationId) {
  const chatApiUrl = config.get('chatApiUrl')
  const url = `${chatApiUrl}/chat`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question,
        conversation_id: conversationId || null,
        modelId
      })
    })

    if (!response.ok) {
      const timestamp = generateErrorTimestamp()

      // Handle 400 Bad Request specifically (e.g., from AWS Bedrock)
      if (response.status === 400) {
        let errorMessage = response.statusText
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || response.statusText
        } catch {
          // If we can't parse the error body, use statusText
        }
        throw new ChatApiError(errorMessage, 400, timestamp)
      }

      throw new Error(`Chat API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    const parsedMessages = data.messages.map(message => {
      return {
        ...message,
        content: marked.parse(message.content)
      }
    })

    return {
      conversationId: data.conversationId,
      messages: parsedMessages
    }
  } catch (error) {
    // Re-throw ChatApiError as-is
    if (error instanceof ChatApiError) {
      throw error
    }
    throw new Error(`Failed to connect to chat API at ${url}: ${error.message}`)
  }
}

export { sendQuestion, ChatApiError, generateErrorTimestamp }
