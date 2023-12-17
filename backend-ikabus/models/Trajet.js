const mongoose = require("mongoose");


const trajetSchema = new mongoose.Schema({
  date1: { type: Date, required: true },
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  hour_departure: { type: String, required: true },
  hour_arrival: { type: String, required: true },
  price: { type: Number, required: true },
  places: { type: Number, required: true },
  compagnie: { type: String, required: false },
});

trajetSchema.methods.formattedDate = function () {
  return format(this.date1, 'dd/mm/yyyy');
};

const Trajet = mongoose.model('Trajet', trajetSchema);

module.exports = Trajet;
