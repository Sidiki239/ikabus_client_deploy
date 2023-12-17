const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true },
  nombre_personnes: { type: Number, required: true },
  prix: { type: Number, required: true },
  compagnie: { type: String, required: true },
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  hour_departure: { type: String, required: true },
  hour_arrival: { type: String, required: true },
  date2:{type : String, required:true},
  codereservation:{type : String, required:true}
});

const Reservation = mongoose.model("reservation", reservationSchema);

module.exports = Reservation;
