const express = require('express');
const authController = require('../controllers/authController');
const existenceController = require('../controllers/existenceController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
  .route('/:userId/q1results/')
  .post(authController.protect, existenceController.bringQ1Results);
router
  .route('/:userId/jobqueue/')
  .post(authController.protect, existenceController.bringJobQueueResults);

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
