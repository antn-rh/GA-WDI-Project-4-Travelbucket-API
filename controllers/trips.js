var Trip = require('../models/trip');

module.exports = {
  index: index,
  create: create,
  show: show,
  update: update,
  destroy: destroy
}

function index(req, res, next) {
  Trip.find({}, function(err, trips) {
    if(err) next(err);

    res.json({trips: trips});
  }).select('-__v');
}

function create(req, res, next) {
  var trip = new Trip(req.body);

  trip.save(function(err, savedTrip) {
    if(err) next(err);

    res.json(savedTrip);
  });
}

function show(req, res, next) {
  var id = req.params.id;

  Trip.findById(id, function(err, trip) {
    if(err) next(err);

    res.json(trip);
  });
}

function update(req, res, next) {
  var id = req.params.id;

  Trip.findById(id, function(err, trip) {
    if(err) next(err);

    trip.location = req.body.location;
    trip.startDate = req.body.startDate;
    trip.endDate = req.body.endDate;
    trip.departingFlight.flightOrigin = req.body.departingFlight.flightOrigin;
    trip.departingFlight.flightDestination = req.body.departingFlight.flightDestination;
    trip.departingFlight.flightDepartureTime = req.body.departingFlight.flightDepartureTime;
    trip.departingFlight.flightDuration = req.body.departingFlight.flightDuration;
    trip.returnFlight.flightOrigin = req.body.returnFlight.flightOrigin;
    trip.returnFlight.flightDestination = req.body.returnFlight.flightDestination;
    trip.returnFlight.flightDepartureTime = req.body.returnFlight.flightDepartureTime;
    trip.returnFlight.flightDuration = req.body.returnFlight.flightDuration;
    trip.lodgingAddress = req.body.lodgingAddress;
    trip.bookmarks = req.body.bookmarks;

    trip.save(function(err, updatedTrip) {
      if(err) next(err);

      res.json(updatedTrip);
    });
  });
}

function destroy(req, res, next) {
  var id = req.params.id;

  Trip.remove({_id: id}, function(err) {
    if(err) next(err);

    res.json({message: 'Trip successfully deleted.'});
  });
}
