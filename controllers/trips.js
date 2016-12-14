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
    trip.departingFlight.origin = req.body.departingFlight.origin;
    trip.departingFlight.destination = req.body.departingFlight.destination;
    trip.departingFlight.departureTime = req.body.departingFlight.departureTime;
    trip.departingFlight.duration = req.body.departingFlight.duration;
    trip.returnFlight.origin = req.body.returnFlight.origin;
    trip.returnFlight.destination = req.body.returnFlight.destination;
    trip.returnFlight.departureTime = req.body.returnFlight.departureTime;
    trip.returnFlight.duration = req.body.returnFlight.duration;
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
