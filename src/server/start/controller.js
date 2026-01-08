import statusCodes from 'http-status-codes'

import { sendQuestion, ChatApiError } from './chat-api.js'
import { getModels } from './models-api.js'
import { startPostSchema, startParamsSchema } from './chat-schema.js'
import { createLogger } from '../common/helpers/logging/logger.js'

const END_POINT_PATH = 'start/start'

/**
 * Creates an error message object for display in the conversation
 * @param {Date} timestamp - The timestamp of the error
 * @param {string} [errorType] - The type of error: 'timeout' (can retry) or undefined (fatal - must start over)
 * @returns {Object} Error message object
 */
function createErrorMessage (timestamp, errorType) {
  return {
    role: 'error',
    errorType,
    timestamp: timestamp.toISOString()
  }
}

export const startGetController = {
  async handler (_request, h) {
    const logger = createLogger()
    try {
      const models = await getModels()
      return h.view(END_POINT_PATH, { models })
    } catch (error) {
      logger.error(error, 'Error calling chat API')
      return h.view('error/index', {
        pageTitle: 'Something went wrong',
        heading: statusCodes.INTERNAL_SERVER_ERROR,
        message: 'Sorry, there was a problem with the service request'
      }).code(statusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}

export const startPostController = {
  options: {
    validate: {
      payload: startPostSchema,
      params: startParamsSchema,
      failAction: async (request, h, error) => {
        const errorMessage = error.details[0]?.message
        const conversationId = request.params.conversationId

        let models = []
        models = await getModels()

        return h.view(END_POINT_PATH, {
          question: request.payload?.question,
          conversationId,
          modelId: request.payload?.modelId,
          models,
          errorMessage
        }).code(statusCodes.BAD_REQUEST).takeover()
      }
    }
  },
  async handler (request, h) {
    const logger = createLogger()

    logger.info({ modelId: request.payload.modelId }, 'Processing user question submission')

    const { modelId, question } = request.payload
    const conversationId = request.params.conversationId

    let models = []

    // TEST MODE: Simulate errors for design testing - REMOVE BEFORE PRODUCTION
    
    // Initial fatal error trigger
    if (question.toLowerCase().trim() === 'test-400-error') {
      logger.info('TEST MODE: Simulating fatal error for design review')
      models = await getModels()
      const messagesWithError = [
        {
          role: 'user',
          content: `<p>${question}</p>`,
          timestamp: new Date().toISOString()
        },
        createErrorMessage(new Date()) // Fatal error (no errorType)
      ]

      return h.view(END_POINT_PATH, {
        messages: messagesWithError,
        question,
        conversationId: 'test-fatal-mode', // Special ID to track test mode
        modelId,
        models,
        hasBedrockError: true
      }).code(statusCodes.BAD_REQUEST)
    }

    // Subsequent messages after fatal error - show error persists
    if (conversationId === 'test-fatal-mode') {
      logger.info('TEST MODE: Showing that fatal error persists on retry')
      models = await getModels()
      const messagesWithError = [
        {
          role: 'user',
          content: '<p>test-400-error</p>',
          timestamp: new Date(Date.now() - 60000).toISOString() // 1 minute ago
        },
        createErrorMessage(new Date(Date.now() - 60000)), // First error
        {
          role: 'user',
          content: `<p>${question}</p>`,
          timestamp: new Date().toISOString()
        },
        createErrorMessage(new Date()) // Second error - conversation still broken
      ]

      return h.view(END_POINT_PATH, {
        messages: messagesWithError,
        question,
        conversationId,
        modelId,
        models,
        hasBedrockError: true
      }).code(statusCodes.BAD_REQUEST)
    }

    // Initial timeout error trigger
    if (question.toLowerCase().trim() === 'test-timeout-error') {
      logger.info('TEST MODE: Simulating timeout error for design review')
      models = await getModels()
      const messagesWithError = [
        {
          role: 'user',
          content: `<p>${question}</p>`,
          timestamp: new Date().toISOString()
        },
        createErrorMessage(new Date(), 'timeout') // Timeout error (can retry)
      ]

      return h.view(END_POINT_PATH, {
        messages: messagesWithError,
        question,
        conversationId: 'test-timeout-mode', // Special ID to track test mode
        modelId,
        models,
        hasBedrockError: true
      }).code(statusCodes.BAD_REQUEST)
    }

    // Subsequent messages after timeout error - show recovery succeeds
    if (conversationId === 'test-timeout-mode') {
      logger.info('TEST MODE: Showing successful recovery after timeout error')
      models = await getModels()
      const messagesWithRecovery = [
        {
          role: 'user',
          content: '<p>test-timeout-error</p>',
          timestamp: new Date(Date.now() - 120000).toISOString() // 2 minutes ago
        },
        createErrorMessage(new Date(Date.now() - 120000), 'timeout'), // Timeout error
        {
          role: 'user',
          content: `<p>${question}</p>`,
          timestamp: new Date(Date.now() - 30000).toISOString() // 30 seconds ago
        },
        {
          role: 'assistant',
          content: '<p>This is a successful response after the timeout was resolved. The retry worked as expected.</p>',
          modelName: 'Claude 3.7 Sonnet',
          timestamp: new Date().toISOString()
        }
      ]

      return h.view(END_POINT_PATH, {
        messages: messagesWithRecovery,
        conversationId,
        modelId,
        models
      })
    }

    // Initial 403 access denied error trigger
    if (question.toLowerCase().trim() === 'test-403-error') {
      logger.info('TEST MODE: Simulating 403 access denied error for design review')
      models = await getModels()
      const messagesWithError = [
        {
          role: 'user',
          content: `<p>${question}</p>`,
          timestamp: new Date().toISOString()
        },
        createErrorMessage(new Date(), 'access-denied') // 403 error - service unavailable
      ]

      return h.view(END_POINT_PATH, {
        messages: messagesWithError,
        question,
        conversationId: 'test-access-denied-mode', // Special ID to track test mode
        modelId,
        models,
        hasBedrockError: true
      }).code(statusCodes.FORBIDDEN)
    }

    // Subsequent messages after 403 error - show error persists (service still unavailable)
    if (conversationId === 'test-access-denied-mode') {
      logger.info('TEST MODE: Showing that 403 access denied error persists on retry')
      models = await getModels()
      const messagesWithError = [
        {
          role: 'user',
          content: '<p>test-403-error</p>',
          timestamp: new Date(Date.now() - 60000).toISOString() // 1 minute ago
        },
        createErrorMessage(new Date(Date.now() - 60000), 'access-denied'), // First error
        {
          role: 'user',
          content: `<p>${question}</p>`,
          timestamp: new Date().toISOString()
        },
        createErrorMessage(new Date(), 'access-denied') // Second error - service still unavailable
      ]

      return h.view(END_POINT_PATH, {
        messages: messagesWithError,
        question,
        conversationId,
        modelId,
        models,
        hasBedrockError: true
      }).code(statusCodes.FORBIDDEN)
    }

    // Initial 403 no permission error trigger (Option B - user permissions issue)
    if (question.toLowerCase().trim() === 'test-no-permission') {
      logger.info('TEST MODE: Simulating 403 no permission error for design review')
      models = await getModels()
      const messagesWithError = [
        {
          role: 'user',
          content: `<p>${question}</p>`,
          timestamp: new Date().toISOString()
        },
        createErrorMessage(new Date(), 'no-permission') // 403 error - user doesn't have permission
      ]

      return h.view(END_POINT_PATH, {
        messages: messagesWithError,
        question,
        conversationId: 'test-no-permission-mode', // Special ID to track test mode
        modelId,
        models,
        hasBedrockError: true
      }).code(statusCodes.FORBIDDEN)
    }

    // Subsequent messages after no permission error - show error persists
    if (conversationId === 'test-no-permission-mode') {
      logger.info('TEST MODE: Showing that 403 no permission error persists on retry')
      models = await getModels()
      const messagesWithError = [
        {
          role: 'user',
          content: '<p>test-no-permission</p>',
          timestamp: new Date(Date.now() - 60000).toISOString() // 1 minute ago
        },
        createErrorMessage(new Date(Date.now() - 60000), 'no-permission'), // First error
        {
          role: 'user',
          content: `<p>${question}</p>`,
          timestamp: new Date().toISOString()
        },
        createErrorMessage(new Date(), 'no-permission') // Second error - still no permission
      ]

      return h.view(END_POINT_PATH, {
        messages: messagesWithError,
        question,
        conversationId,
        modelId,
        models,
        hasBedrockError: true
      }).code(statusCodes.FORBIDDEN)
    }

    try {
      models = await getModels()
      const response = await sendQuestion(question, modelId, conversationId)

      return h.view(END_POINT_PATH, {
        messages: response.messages,
        conversationId: response.conversationId,
        modelId,
        models
      })
    } catch (error) {
      models = await getModels()

      // Handle 400 errors from AWS Bedrock specifically
      if (error instanceof ChatApiError && error.statusCode === 400) {
        logger.error({
          error: error.message,
          question,
          conversationId
        }, 'AWS Bedrock returned HTTP 400 error')

        // Create messages array with user's failed question and error message
        // 400 errors are fatal - user must start a new conversation
        const messagesWithError = [
          {
            role: 'user',
            content: `<p>${question}</p>`,
            timestamp: new Date().toISOString()
          },
          createErrorMessage(new Date()) // Fatal error - no errorType
        ]

        return h.view(END_POINT_PATH, {
          messages: messagesWithError,
          question, // Preserve the question in the input field
          conversationId,
          modelId,
          models,
          hasBedrockError: true
        }).code(statusCodes.BAD_REQUEST)
      }

      // Handle other errors (500s, timeouts, etc.)
      logger.error({ error, question }, 'Error calling chat API')

      return h.view(END_POINT_PATH, {
        question,
        conversationId,
        modelId,
        models,
        errorMessage: 'Sorry, there was a problem getting a response. Please try again.'
      })
    }
  }
}

export const clearConversationController = {
  handler (_request, h) {
    const logger = createLogger()
    logger.info('Clear conversation requested')

    // TODO: Call downstream service to clear conversation when available
    // For now, just redirect to start page which will show a fresh form
    logger.info('Conversation cleared, redirecting to start page')
    return h.redirect('/start')
  }
}
