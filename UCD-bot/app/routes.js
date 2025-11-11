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
