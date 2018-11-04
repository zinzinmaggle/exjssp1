var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MqttSchema = new Schema(
  {
    statutCd: {type: String, required: true, max: 100},
    lastDataReceived: {type: Object, required: false},
    lastDataReceivedTime: {type: Date, required: false},
    topic: {type: String, required: true},
    broker: {type: String, required: true},
  }
);

module.exports = mongoose.model('Mqtt', MqttSchema);