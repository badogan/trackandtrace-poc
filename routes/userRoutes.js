const express = require('express');
const authController = require('../controllers/authController');
const existenceController = require('../controllers/existenceController');
const passport = require('passport');
const dotenv = require('dotenv');

const router = express.Router();
dotenv.config({ path: './config.env' });

const testingThis = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
};

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
    // console.log('req.user:', req.user);
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

//=========================================
// router
//   .route('/:userId/appointments')
//   .post(authController.protect, appointmentController.createAppointment)
//   .get(authController.protect, appointmentController.getAllAppointments);

// router
//   .route('/:userId/appointments/:appointmentId')
//   .get(authController.protect, appointmentController.getAppointment)
//   .delete(authController.protect, appointmentController.deleteAppointment)
//   .patch(authController.protect, appointmentController.updateAppointment);

module.exports = router;
