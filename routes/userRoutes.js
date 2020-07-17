const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const authController = require('../controllers/authController');
const existenceController = require('../controllers/existenceController');

const router = express.Router();
dotenv.config({ path: './config.env' });

router.post('/isemailavailable',authController.isEmailAvailable)
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get(
  '/loginGoogle',
  passport.authenticate('google', {
    scope: ['profile']
  })
);

router.get(
  '/loginGoogle/redirect',
  passport.authenticate('google'),
  (req, res, next) => {
    const targetObj = authController.createSendTokenLoginGoogleInternal(
      req.user
    );
    res.redirect(
      `http://localhost:3000/loggedingooglepage?userid=${req.user._id}&username=${req.user.name}&token=${targetObj.token}`
    );
  }
);

router
  .route('/:userId/q1results/')
  .post(authController.protect, existenceController.bringQ1Results);
router
  .route('/:userId/jobqueue/')
  .post(authController.protect, existenceController.bringJobQueueResults);

module.exports = router;
