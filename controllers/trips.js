var Trip = require('../models/trip');
var NodeGeocoder = require('node-geocoder');
var request = require('request');

module.exports = {
  index: index,
  create: create,
  show: show,
  update: update,
  destroy: destroy,
  getYelp: getYelp
}

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GOOGLE_MAPS_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

function index(req, res, next) {
  Trip.find({}, function(err, trips) {
    if(err) next(err);

    res.json({trips: trips});
  }).select('-__v');
}

function create(req, res, next) {
  var trip = new Trip(req.body);
  trip.createdBy = req.decoded._id;

  geocoder.geocode(trip.city + ' ' + trip.state, function(err, data) {
    trip.latitude = data[0].latitude;
    trip.longitude = data[0].longitude;
    console.log(trip.latitude);
    console.log(trip.longitude);
    trip.save(function(err, savedTrip) {
      if(err) next(err);

      res.json(savedTrip);
    });
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

    trip.city = req.body.city;
    trip.state = req.body.state;
    geocoder.geocode(req.body.city + ' ' + req.body.state, function(err, data) {
      if(err) throw err;
      trip.latitude = data[0].latitude;
      trip.longitude = data[0].longitude;
      console.log('geocoder latitude and longitude: ' + data[0].latitude + ' ' + data[0].longitude);
      // trip.save(function(savedCoordinates) {})
    });
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
      console.log('my updated trip: ' + updatedTrip.latitude + ' ' + updatedTrip.longitude)
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

function getYelp(req, res) {
  var searchTerm = req.body.searchTerm;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var url = 'https://api.yelp.com/v3/businesses/search?term=' + searchTerm + '&latitude=' + latitude + '&longitude=' + longitude;

  request.get(url, {
    headers: {
      'Authorization': 'Bearer Vn0NavY8VIp6fySwq2HbX4Oa5bOVaD1hUpPGvUDgQav5utoqZ31wtIofBiU-AqgXTGECcj7U4q833e7piQjcP0_h47L5gcmLciGm0vp62JgblxC4vyJKWMwuMeBSWHYx'
    }
  }, function(err, response, body) {
    if(err) console.log(err);

    res.json(JSON.parse(body));
  });
}
