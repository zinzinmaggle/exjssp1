var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ObjetSchema = new Schema(
  {
    typeObjetCd: {type: String, required: true, max: 100},
    libelle: {type: String, required: true, max:100},
    mqttId: {type: String, required: true, max: 100},
    code :{type : String, required: true, max :100}
  }
);

// // Virtual for author's full name
// AuthorSchema
// .virtual('name')
// .get(function () {
//   return this.family_name + ', ' + this.first_name;
// });

// // Virtual for author's lifespan
// AuthorSchema
// .virtual('lifespan')
// .get(function () {
//   return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
// });

// // Virtual for author's URL
// AuthorSchema
// .virtual('url')
// .get(function () {
//   return '/catalog/author/' + this._id;
// });

//Export model
module.exports = mongoose.model('Objet', ObjetSchema);