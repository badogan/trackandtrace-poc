const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel.js');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const query = await Model.findById(req.params.appointmentId);

    if (String(query.user._id) !== String(req.user._id)) {
      return next(
        new AppError(
          'No document found with that ID (may be there is, but not yours)',
          404
        )
      );
    }

    const doc = await Model.findByIdAndDelete(req.params.appointmentId);

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const query = await Model.findById(req.params.appointmentId);

    if (query && String(query.user._id) !== String(req.user._id)) {
      return next(
        new AppError(
          'No document found with that ID (may be there is, but not yours)',
          404
        )
      );
    }

    const doc = await Model.findByIdAndUpdate(
      req.params.appointmentId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    // console.log('doc IS: ', doc)
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    if (false) {
      //TODO This is a shortcut to accelerate Tolga's PoC request. Must split the code to handle the route properly
      if (!req.body.user) req.body.user = req.user; //IMPORTANT */
      //Reason for the code below: Appointment should only be created if user roles are different
      //Known BUG: Must be a doctor or a user
      const otherPartyObject = await User.findById(req.body.otherParty);
      if (req.body.user.role === otherPartyObject.role) {
        return next(
          new AppError('Appointment cannot be created for same user type', 404)
        );
      }
      //
    }

    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: newDoc
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let doc = await Model.findById(req.params.appointmentId);

    if (String(doc.user._id) !== String(req.user._id)) {
      return next(
        new AppError(
          'No document found with that ID (may be there is, but not yours)',
          404
        )
      );
    }

    if (populateOptions) {
      doc = doc.populate(populateOptions);
    }

    // const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    //   To allow for nested GEt reviews
    const filter = { user: req.user };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });
