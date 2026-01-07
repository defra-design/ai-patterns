import statusCodes from 'http-status-codes'

import { sendQuestion, ChatApiError } from './chat-api.js'
import { getModels } from './models-api.js'
import { startPostSchema, startParamsSchema } from './chat-schema.js'
import { createLogger } from '../common/helpers/logging/logger.js'

const END_POINT_PATH = 'start/start'

/**
 * Creates an error message object for display in the conversation
 * @param {string} errorCode - The error code (e.g., BR400-20260106120000)
 * @param {Date} timestamp - The timestamp of the error
 * @returns {Object} Error message object
 */
function createErrorMessage (errorCode, timestamp) {
  return {
    role: 'error',
    errorCode,
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

    // TEST MODE: Simulate 400 error for design testing - REMOVE BEFORE PRODUCTION
    if (question.toLowerCase().trim() === 'test-400-error') {
      logger.info('TEST MODE: Simulating 400 error for design review')
      models = await getModels()
      const testErrorCode = `BR400-${new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)}`
      const messagesWithError = [
        {
          role: 'user',
          content: `<p>${question}</p>`,
          timestamp: new Date().toISOString()
        },
        createErrorMessage(testErrorCode, new Date())
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
          errorCode: error.errorCode,
          question,
          conversationId
        }, 'AWS Bedrock returned HTTP 400 error')

        // Create messages array with user's failed question and error message
        const messagesWithError = [
          {
            role: 'user',
            content: `<p>${question}</p>`,
            timestamp: new Date().toISOString()
          },
          createErrorMessage(error.errorCode, new Date())
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
