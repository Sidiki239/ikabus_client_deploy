const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
// const cookie_parser = require("cookie-parser");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "jkdewuiue9832iujrop2knlkfoijforf[]]d3u3838ui3ui3";
const bcrypt = require("bcryptjs") 
const User = require("./models/users")
const Trajet = require("./models/Trajet")
const Reservation = require("./models/reservation")
const connection_url = 'mongodb+srv://Sidiki:HEylwqwmKEFI80Qm@cluster123.qfpfory.mongodb.net/IKABUS';


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookie_parser());
// Route racine
app.get("/", (req, res) => {
  res.send("Express fonctionne bien !");
});


// Connexion à MongoDB
mongoose
  .connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connecté à MongoDB...");
    // Démarrer le serveur une fois connecté à la base de données
    app.listen(3002, () => {
      console.log("Le serveur est en cours d'exécution sur le port 3002...");
     // console.log("Fait !!!");
    });
  })
  .catch((error) => {
    console.error("Erreur de connexion à MongoDB :", error);
  });
//---------------------------------------------------

//AJOUT DE TRAJET 
app.post("/insert", async(req,res)=>{
  const date1 = req.body.date1
  const departure = req.body.departure
  const arrival = req.body.arrival
  const hour_departure = req.body.hour_departure
  const hour_arrival = req.body.hour_arrival
  const price = req.body.price
  const places = req.body.places
  const compagnie = req.body.compagnie
  
const trajet = new Trajet({
  date1: date1,
  departure: departure,
  arrival: arrival,
  hour_departure: hour_departure,
  hour_arrival: hour_arrival,
  price: price,
  places: places,
  compagnie :compagnie,
})
try{
await trajet.save();
res.send("Données insérées !!");
} catch(err){
  console.log(err);
}
})
//--------------------------------


//------FETCHING trajets-----------------
app.get("/read", async (req, res) => {
  try {
    const result = await Trajet.find({}).sort({ date1: -1 });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});
//fetching departure and arrivals 
app.get("/departures", async (req, res) => {
  try {
    const departures = await Trajet.distinct("departure");
    res.send(departures);
  } catch (err) {
    res.send(err);
  }
});

app.get("/arrivals", async (req, res) => {
  try {
    const arrivals = await Trajet.distinct("arrival");
    res.send(arrivals);
  } catch (err) {
    res.send(err);
  }
});



//-------------------------------------------------
//Fetching users 
app.get("/readuser", async (req, res) => {
  try {
    const result = await User.find({}).sort({ prenom: -1 });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

// Endpoint pour la modification d'un trajet
app.put("/updateuser/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const nom = req.body.nom1;
    const prenom = req.body.prenom1;
    const compagnie = req.body.compagnie1;
    const email = req.body.email1;
    const numero_telephone = req.body.numero_telephone1;

    const updatedTrajet = {
      nom: nom,
      prenom: prenom,
      compagnie: compagnie,
      email: email,
      numero_telephone: numero_telephone,
    };

    const user = await User.findByIdAndUpdate(id, updatedTrajet, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'Trajet non trouvé' });
    }

    await user.save();

    res.json({ message: 'Trajet modifié avec succès', user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du trajet' });
  } 
});


// Endpoint pour la modification d'un trajet
app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const date1m = req.body.date1m;
  const departurem = req.body.departurem;
  const arrivalm = req.body.arrivalm;
  const hour_departurem = req.body.hour_departurem;
  const hour_arrivalm = req.body.hour_arrivalm;
  const pricem = req.body.pricem;
  const placesm = req.body.placesm;

  const updatedTrajet = {
    date1: date1m,
    departure: departurem,
    arrival: arrivalm,
    hour_departure: hour_departurem,
    hour_arrival: hour_arrivalm,
    price: pricem,
    places: placesm,
  };

  try {
    const trajet = await Trajet.findByIdAndUpdate(id, updatedTrajet, { new: true });

    if (!trajet) {
      return res.status(404).json({ error: 'Trajet non trouvé' });
    }

    res.json({ message: 'Trajet modifié avec succès', trajet });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du trajet' });
  }
});


app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user= await Trajet.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'Trajet non trouvé' });
    }

    res.json({ message: 'Trajet supprimé avec succès' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du trajet' });
  }
});

app.delete("/deleteuser/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user= await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'Trajet non trouvé' });
    }

    res.json({ message: 'Trajet supprimé avec succès' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du trajet' });
  }
});


//------------------------------------------


//INSCRIPTION DE UTILISATEUR
app.post("/register", async (req, res) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const compagnie = req.body.compagnie;
  const password = req.body.password;
  const email = req.body.email;
  const type = req.body.type;
  const numero_telephone = req.body.numero_telephone;

  const encprtPass = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      res.send({ error: "User already exists" });
    } else {
      const user = new User({
        nom: nom,
        prenom: prenom,
        compagnie: compagnie,
        email : email,
        type : type,
        password: encprtPass,
        numero_telephone: numero_telephone // Utiliser le mot de passe haché
      });

      await user.save();
      res.send("Données insérées !!");
    }
  } catch (err) {
    console.log(err);
  }
});

//----------------------------
//LOGIN DE UTILISATEUR
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email  });
    if (!user) {
      return res.json({ error: "User not found" });
    }
    //const = user._id;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ email :user.email}, JWT_SECRET , {
      expiresIn: 3000,
      
      });

      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ status: "error", error: "Invalid password" });
    }
  } catch (error) {
    return res.json({ status: "error", error: "An error occurred" });
  }
});



app.get('/getreservation/:userCompany', async (req, res) => {
  const userCompany = req.params.userCompany;
  try {
    
    // Fetch reservations based on the user's company
    const reservations = await Reservation.find({ compagnie: userCompany });

    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations' });
  }
});


app.post("/userinfo", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET , (err,res) =>{
   if(err){
  return "token expire";
  }
  return res;
    });
    console.log(user);
    if(user == "token expire"){
      return res.send({ status : "ok" , data :"token expire"});
    }
    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        console.log(data); // Vérifier les données renvoyées par la requête
        if (data) {
          const { nom, prenom, email , password , compagnie, } = data;
          res.send({ status: "ok", data: { nom, prenom, email , password , compagnie } });
          console.log(data);
        } else {
          res.send({ status: "error", data: "User not found" });
        }
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {
    console.log(error);
    res.send({ status: "error", data: error });
  }
});


//code pour reservation--
// Route pour la recherche de trajets
app.post('/search', async (req, res) => {
  const { departure, arrival } = req.body;
  

  try {
    const trajets = await Trajet.find({departure , arrival});
    console.log("success !!!!");
    res.status(200).json(trajets);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la recherche de trajets', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la recherche de trajets' });
  }
});
app.get("/trajets/:id", async (req, res) => {
  try {
    const trajetId = req.params.id;
    const trajet = await Trajet.findById(trajetId);
    
    if (!trajet) {
      return res.status(404).json({ error: "Trajet non trouvé" });
    }
    
    res.json(trajet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Une erreur s'est produite lors de la récupération du trajet" });
  }
});




app.get('/trajets', async (req, res) => {
  const { departure, arrival } = req.query;

  try {
    const trajets = await Trajet.find({ departure, arrival });
    res.status(200).json(trajets);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la recherche des trajets', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la recherche des trajets' });
  }
});
//RESERVATION  
app.post("/reservations", async (req, res) => {
  const trajetId = req.body.trajetId;
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const telephone = req.body.telephone;
  const nombre_personnes = req.body.nombre_personnes;
  const prix= req.body.prix;
  const compagnie= req.body.compagnie;
  const departure = req.body.departure;
  const arrival = req.body.arrival;
  const hour_departure= req.body.hour_departure;
  const hour_arrival= req.body.hour_arrival;
  const date2 = req.body.date2;
  const codereservation = req.body.codereservation;
  

  try {
    // Vérifier la disponibilité des places
    const trajet = await Trajet.findById(trajetId);
    if (!trajet) {
      return res.status(404).json({ error: "Trajet non trouvé" });
    }

    const placesRestantes = trajet.places - nombre_personnes;
    if (nombre_personnes > placesRestantes) {
      return res.status(400).json({ error: "Il n'y a pas suffisamment de places disponibles" });
    }

    // Effectuer la réservation
    const reservation = new Reservation({
     // _id: trajetId,
      nom: nom,
      prenom: prenom,
      telephone: telephone,
      nombre_personnes: nombre_personnes,
      prix: prix,
      compagnie:compagnie,
      departure:departure,
      arrival:arrival,
      hour_departure:hour_departure,
      hour_arrival:hour_arrival,
      date2:date2,
      codereservation:codereservation
    });

    await reservation.save();

    // Mettre à jour le nombre de places réservées dans le trajet
    trajet.places -= nombre_personnes;
    await trajet.save();

    res.send("Réservation effectuée avec succès");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Une erreur s'est produite lors de la réservation" });
  }
});

app.get('/ticket/:codereservation', async (req, res) => {
  const { codereservation } = req.params;

  try {
    const ticket = await Reservation.find({ codereservation: codereservation });
    console.log("Resulat trouve");
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la recherche de trajets', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la recherche de trajets' });
  }
});
