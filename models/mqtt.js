var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MqttSchema = new Schema(
  {
    lastDataReceived: {type: Object, required: false},
    lastDataReceivedTime: {type: Date, required: false},
    topic: {type: String, required: true},
    intervalId: {type: Object, required : false }
  }
);

module.exports = mongoose.model('Mqtt', MqttSchema);