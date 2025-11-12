//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here

// Version 1 routes
// Password protection
router.get('/version-1/password', function (req, res) {
  res.render('version-1/password', {
    errorMessage: null
  })
})

router.post('/version-1/password', function (req, res) {
  const password = req.session.data['password']
  const correctPassword = 'prototype'

  if (password === correctPassword) {
    // Store authentication in session
    req.session.data['authenticated'] = 'true'
    res.redirect('/version-1/start')
  } else {
    // Show error
    res.render('version-1/password', {
      errorMessage: 'Enter the correct password'
    })
  }
})

// Middleware to check authentication for version 1 pages
router.use('/version-1/*', function (req, res, next) {
  // Skip authentication check for password page
  if (req.path === '/version-1/password') {
    return next()
  }
  
  // Check if authenticated
  if (req.session.data['authenticated'] === 'true') {
    next()
  } else {
    res.redirect('/version-1/password')
  }
})

// Version 2 routes
// Password protection
router.get('/version-2/password', function (req, res) {
  res.render('version-2/password', {
    errorMessage: null
  })
})

router.post('/version-2/password', function (req, res) {
  const password = req.session.data['password']
  const correctPassword = 'prototype'

  if (password === correctPassword) {
    // Store authentication in session
    req.session.data['authenticatedV2'] = 'true'
    res.redirect('/version-2/start')
  } else {
    // Show error
    res.render('version-2/password', {
      errorMessage: 'Enter the correct password'
    })
  }
})

// Middleware to check authentication for version 2 pages
router.use('/version-2/*', function (req, res, next) {
  // Skip authentication check for password page
  if (req.path === '/version-2/password') {
    return next()
  }
  
  // Check if authenticated
  if (req.session.data['authenticatedV2'] === 'true') {
    next()
  } else {
    res.redirect('/version-2/password')
  }
})

// Chat interface routes
router.get('/version-2/start', function (req, res) {
  // Initialize chat history and selected model if not exists
  if (!req.session.data['chatHistory']) {
    req.session.data['chatHistory'] = []
  }
  if (!req.session.data['selectedModel']) {
    req.session.data['selectedModel'] = 'sonnet'
  }
  
  res.render('version-2/start')
})

// Update selected model
router.post('/version-2/select-model', function (req, res) {
  const selectedModel = req.session.data['selectedModel']
  
  // Store the selected model
  req.session.data['selectedModel'] = selectedModel
  
  res.redirect('/version-2/start')
})

// Send message to chat
router.post('/version-2/send-message', function (req, res) {
  const userMessage = req.session.data['userMessage']
  const selectedModel = req.session.data['selectedModel'] || 'sonnet'
  
  // Initialize chat history if it doesn't exist
  if (!req.session.data['chatHistory']) {
    req.session.data['chatHistory'] = []
  }
  
  // Add user message to chat history
  if (userMessage && userMessage.trim() !== '') {
    req.session.data['chatHistory'].push({
      role: 'user',
      content: userMessage
    })
    
    // TODO: Call LLM API here
    // For now, we'll add a placeholder response
    const botResponse = generatePlaceholderResponse(userMessage, selectedModel)
    
    // Add bot response to chat history
    req.session.data['chatHistory'].push({
      role: 'bot',
      content: botResponse,
      model: selectedModel === 'sonnet' ? 'Sonnet 3.7' : 'Haiku'
    })
    
    // Clear the input field
    req.session.data['userMessage'] = ''
  }
  
  res.redirect('/version-2/start')
})

// Clear chat history
router.get('/version-2/clear-chat', function (req, res) {
  req.session.data['chatHistory'] = []
  req.session.data['userMessage'] = ''
  
  res.redirect('/version-2/start')
})

// Placeholder function for bot response
// TODO: Replace this with actual LLM API integration
function generatePlaceholderResponse(userMessage, model) {
  const modelName = model === 'sonnet' ? 'Sonnet 3.7' : 'Haiku'
  
  return `<p class="govuk-body">This is a placeholder response from ${modelName}.</p>
<p class="govuk-body">You asked: "${userMessage}"</p>
<p class="govuk-body">To connect this to a real LLM, you'll need to:</p>
<ul class="govuk-list govuk-list--bullet">
  <li>Set up API credentials for your chosen LLM service (e.g., Anthropic Claude API)</li>
  <li>Install the necessary npm packages</li>
  <li>Replace the generatePlaceholderResponse function with actual API calls</li>
</ul>`
}
