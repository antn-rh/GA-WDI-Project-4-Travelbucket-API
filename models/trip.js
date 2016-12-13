var mongoose = require('mongoose');

var flightSceham = new mongoose.Schema){
  flightOrigin: String,
  flightDestination: String,
  flightDepartureTime: String,
  flightDuration: String,
}

var tripSchema = new mongoose.Schema({
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  location: String,
  startDate: Date,
  endDate: Date,
  departingFlight: [flightSchema],
  returnFlight: [flightSchema],
  lodgingAddress: String,
  bookmarks: []
});

var Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
