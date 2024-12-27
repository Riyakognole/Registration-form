const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

const app = express();
const port = 3000;

// Middleware
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Serve the index.html file for the root URL (/)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); 
});

// Define validation rules
const userValidationRules = () => {
  return [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email format'),
    check('mobile')
      .isLength({ min: 10, max: 10 })
      .withMessage('Mobile number must be 10 digits')
      .matches(/^[789]\d{9}$/)
      .withMessage('Mobile number must start with 7, 8, or 9'),
    check('password')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage(
        'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character'
      ),
  ];
};

// Define a route for handling user registration
app.post('/register', userValidationRules(), (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Return errors as JSON for better client-side handling
    return res.status(400).json({ errors: errors.array() }); 
  }

  // If validation passes, send success message
  res.json({ message: 'Form submitted successfully!' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
