var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommandSchema = new Schema(
  {
    date: {type: Date, required: true},
    statut: {type: String, required: true},
    mqttId: {type: String, required: true},
    command: {type: String, required : true }
  }
);

module.exports = mongoose.model('Command', CommandSchema);