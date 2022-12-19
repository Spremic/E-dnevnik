const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const UserUcenik = require("./model/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3000;

const url = `mongodb+srv://spremic:
SrVMOhH2KtKlu1Fp@cluster0.szngxju.mongodb.net/?retryWrites=true&w=majority`;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

const JWT_SECRET = "HASGDHGQWEDQGWEHDAS~!@ew#$#56%$^%yhfgjhjrtrhrhtRHSFSfsdf";

const app = express();
app.use(express.static(__dirname + "/static/css"));
app.use(express.static(__dirname + "/static/js"));
app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

//registracija
app.post("/api/register", async (req, res) => {
  const {
    nameLastname,
    email,
    password: plainTextPassword,
    specialKey,
    ocena,
  } = req.body;

  let regEmptyInput = /([^\s])/;
  // validacija imena i prezimena
  let regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
  if (!regEmptyInput.test(nameLastname)) {
    return res.json({ status: "name", name: "Polje je obavezno" });
  }
  if (!regName.test(nameLastname)) {
    return res.json({
      status: "name",
      name: "Nepravilan format imena i prezimena",
    });
  }

  //validacija emaila
  let regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  if (!regEmptyInput.test(email)) {
    return res.json({ status: "email", email: "Polje je obavezno" });
  }

  if (!regEmail.test(email)) {
    return res.json({
      status: "email",
      email: "Nepravilan format email adrese",
    });
  }

  let emailCheck = await UserUcenik.findOne({ email }).lean();
  if (emailCheck) {
    return res.json({ status: "email", email: "Email adresa je zauzeta" });
  }

  //validacija passworda
  if (!regEmptyInput.test(plainTextPassword)) {
    return res.json({ status: "password", password: "Polje je obavezno" });
  }

  //validacija specialKey-a
  if (!regEmptyInput.test(specialKey)) {
    return res.json({ status: "key", key: "Polje je obavezno" });
  }

  let keyCheck = await UserUcenik.findOne({ specialKey }).lean();
  if (keyCheck) {
    return res.json({
      status: "key",
      key: "Kljuc je vec zauzet",
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await UserUcenik.create({
      nameLastname,
      email,
      specialKey,
      password,
      ocena,
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }

  res.json({ status: "ok" });
});

//login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  //email validacija
  let emailCheck = await UserUcenik.findOne({ email }).lean();
  if (!emailCheck) {
    return res.json({ status: "mail", mail: "Nepostojeca email adresa" });
  }

  if (await bcrypt.compare(password, emailCheck.password)) {
    const token = jwt.sign(
      {
        id: emailCheck._id,
        email: emailCheck.email,
        specialKey: emailCheck.specialKey,
        nameLastname: emailCheck.nameLastname,
        predmet: emailCheck.predmet,
        ocena: emailCheck.ocena,
      },
      JWT_SECRET
    );

    return res.json({ status: "ok", token: token });
  } else {
    return res.json({ status: "password", password: "Pogresna sifra" });
  }
});

//dodavanje ocena
app.post("/api/rating", async (req, res) => {
  const { keyValidate, newRating, newPredmet } = req.body;
  const ocena = newRating;
  const predmet = newPredmet;

  let regEmptyInput = /([^\s])/;

  //validacija input polja za key
  if (!regEmptyInput.test(keyValidate)) {
    return res.json({ status: "key", key: "Polje je obavezno" });
  }

  const user = await UserUcenik.findOne({ specialKey: keyValidate });
  if (!user) {
    return res.json({ status: "key", key: "Nepostojeci kljuc" });
  }

  //validacija input polja za unos predmet
  if (!regEmptyInput.test(newPredmet)) {
    return res.json({ status: "predmet", predmet: "Polje je obavezno" });
  }

  //validacija input polja za unos ocene
  if (!regEmptyInput.test(newRating)) {
    return res.json({ status: "ocena", ocena: "Polje je obavezno" });
  }

  try {
    const _id = user.id;
    await UserUcenik.updateOne(
      { _id },
      {
        $push: { predmet, ocena },
      }
    );
    console.log(user);
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
  }
});

// uzimanje podataka o ulogovanom korisniku koji se salje na front
app.post("/api/dynamicLoad", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const email = user.email;
    const id = user.id;
    const name = user.nameLastname;
    const predmet = user.predmet;
    const ocena = user.ocena;
    res.json({ status: "ok", email, id, name, predmet, ocena });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: "Greska" });
  }
});


app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
