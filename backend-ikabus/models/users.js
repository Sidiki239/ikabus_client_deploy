const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  compagnie: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  numero_telephone: { type: String, required: true },
  isAdmin: { type: Boolean, required: false},
  
});

const user = mongoose.model("user", UserSchema);

module.exports = user;
