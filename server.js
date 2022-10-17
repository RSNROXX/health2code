const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { log } = require("console");
const { chownSync } = require("fs");
const path = require("path");
const { type } = require("os");
var session = require("express-session");
// storing session into db
var MongoSession = require("connect-mongodb-session")(session);
// var MongoSession = require('mongo-session')(session

var cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

dotenv.config();
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("db connected");
  }
);

const store = new MongoSession({
  uri: process.env.DB_CONNECT,
  collection: "Session",
});

// using cookie-parser
app.use(
  session({
    key: "user_email",
    secret: "secerts",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 60000,
    },
  })
);

var isAuthUser = (req, res, next) => {
  if (req.session.isAuthUser == true) {
    next();
  } else {
    res.redirect("/user/login");
  }
};

// register schema
const userScheme = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    require: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    require: true,
    min: 6,
    max: 1000,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

var User = mongoose.model("User", userScheme);

//anemai scheme
const anemiaScheme = new mongoose.Schema({
  rbc: {
    type: String,
  },
  hemoglobin: {
    type: String,
  },
  hematocrit: {
    type: String,
  },
  wbc: {
    type: String,
  },
  platelet: {
    type: String,
  },

  iron: {
    type: String,
  },

  b12: {
    type: String,
  },
  folate: {
    type: String,
  },

  ulcers: {
    type: String,
  },
  redTongue: {
    type: String,
  },
  muscleWeakness: {
    type: String,
  },
  result: {
    type: Object,
  },
});

const anemia = mongoose.model("Anemia", anemiaScheme);

//beriberi schema
const beriberiScheme = new mongoose.Schema({
  rbc: {
    type: String,
  },
  hemoglobin: {
    type: String,
  },
  hematocrit: {
    type: String,
  },
  wbc: {
    type: String,
  },
  platelet: {
    type: String,
  },

  b1: {
    type: String,
  },
  fatigue: {
    type: String,
  },
  slnf: {
    type: String,
  },
  result: {
    type: Object,
  },
});

const beriberi = mongoose.model("Beriberi", beriberiScheme);

//pellagra Schema
const pellagraScheme = new mongoose.Schema({
  rbc: {
    type: String,
  },
  hemoglobin: {
    type: String,
  },
  hematocrit: {
    type: String,
  },
  wbc: {
    type: String,
  },
  platelet: {
    type: String,
  },

  b3: {
    type: String,
  },
  diarrhea: {
    type: String,
  },
  skinin: {
    type: String,
  },
  dementia: {
    type: String,
  },
  result: {
    type: Object,
  },
});
const pellagra = mongoose.model("Pellagra", pellagraScheme);

//scurvy schema
const scurvyScheme = new mongoose.Schema({
  rbc: {
    type: String,
  },
  hemoglobin: {
    type: String,
  },
  hematocrit: {
    type: String,
  },
  wbc: {
    type: String,
  },
  platelet: {
    type: String,
  },

  vitaC: {
    type: String,
  },
  bonePain: {
    type: String,
  },
  gumDisease: {
    type: String,
  },
  lossOfTeeth: {
    type: String,
  },
  result: {
    type: Object,
  },
});
const scurvy = mongoose.model("Scurvy", scurvyScheme);

app.set("view engine", "ejs");

app.post("/saveData", async (req, res) => {
  console.log("entered");

  // Final Result
  let finalResult = {
    rbc: "Normal",
    hemoglobin: "Normal",
    hematocrit: "Normal",
    wbc: "Normal",
    platelet: "Normal",
    iron: "Normal",
    b12: "Normal",
    folate: "Normal",

    ulcers: "Normal",
    redTongue: "Normal",
    muscleWeakness: "Normal",
  };

  // logic for Rbc

  if (parseFloat(req.body.rbc) < 3.93 || parseFloat(req.body.rbc) > 5) {
    let rbc_result = parseFloat(req.body.rbc) < 3.93 ? "Low" : "High";
    finalResult.rbc = rbc_result;
  }
  //logic for hemo
  if (
    parseFloat(req.body.hemoglobin) < 12.6 ||
    parseFloat(req.body.hemoglobin) > 17.5
  ) {
    let hemoglobin_result =
      parseFloat(req.body.hemoglobin) < 12.6 ? "Low" : "High";
    finalResult.hemoglobin = hemoglobin_result;
  }

  //logic for hema
  if (
    parseFloat(req.body.hematocrit) < 38 ||
    parseFloat(req.body.hematocrit) > 47.7
  ) {
    let hematocrit_result =
      parseFloat(req.body.hematocrit) < 38 ? "Low" : "High";
    finalResult.hematocrit = hematocrit_result;
  }

  //logic for wbc
  if (parseFloat(req.body.wbc) < 3300 || parseFloat(req.body.wbc) > 8700) {
    let wbc_result = parseFloat(req.body.wbc) < 3300 ? "Low" : "High";
    finalResult.wbc = wbc_result;
  }
  //logic for platelet
  if (
    parseFloat(req.body.platelet) < 1.47 ||
    parseFloat(req.body.platelet) > 3.47
  ) {
    let platelet_result = parseFloat(req.body.platelet) < 1.47 ? "Low" : "High";
    finalResult.platelet = platelet_result;
  }
  //logic for iron
  if (parseFloat(req.body.iron) > 8) {
    let iron_result = parseFloat(req.body.iron) > 8 ? "High" : "Low";
    finalResult.iron = iron_result;
  }
  //logic for b12
  if (parseFloat(req.body.b12) > 2.4) {
    let b12_result = parseFloat(req.body.b12) > 2.4 ? "High" : "Low";
    finalResult.b12 = b12_result;
  }
  //logic for folate
  if (parseFloat(req.body.folate) > 400) {
    let folate_result = parseFloat(req.body.folate) > 400 ? "High" : "Low";
    finalResult.folate = folate_result;
  }

  const newData = new anemia({
    rbc: req.body.rbc,
    hemoglobin: req.body.hemoglobin,
    hematocrit: req.body.hematocrit,
    wbc: req.body.wbc,
    platelet: req.body.platelet,

    iron: req.body.iron,
    b12: req.body.b12,
    folate: req.body.folate,

    ulcers: req.body.ulcers,
    redTongue: req.body.redTongue,
    muscleWeakness: req.body.muscleWeakness,
    result: finalResult,
  });

  await newData.save().then(() => {
    console.log("datasaved");
    // anemia.find({},(err,data)=>{})

    const finalArray = [
      "RBC:" + finalResult.rbc,
      "Hemoglobin:" + finalResult.hemoglobin,
      "Hematocrit:" + finalResult.hematocrit,
      "WBC:" + finalResult.wbc,
      "Platelet:" + finalResult.platelet,

      "Iron:" + finalResult.iron,
      "B-12:" + finalResult.b12,
      "Folate:" + finalResult.folate,

      "Ulcers:" + finalResult.ulcers,
      "Red Tongue:" + finalResult.redTongue,
      "Muscle Weakness:" + finalResult.muscleWeakness,
    ];

    let high_low = [];
    let normal = [];

    // entering high low values inside of high_low array
    finalArray.forEach((element) => {
      if (element.indexOf("Normal") == -1) {
        high_low.push(element);
      } else {
        normal.push(element);
      }
    });
    console.log(high_low, normal);

    // entering normal values inside of normal array

    res.render("./result/Anemiaresult.ejs", {
      result1: high_low,
      result2: normal,
      result: finalResult,
    });
    //
    //
  });
});
//post for beriberi
app.post("/beriberiData", async (req, res) => {
  // Final Result
  let finalResult = {
    rbc: "Normal",
    hemoglobin: "Normal",
    hematocrit: "Normal",
    wbc: "Normal",
    platelet: "Normal",

    b1: "Normal",

    fatigue: "Normal",
    slnf: "Normal",
  };

  // logic for Rbc

  if (parseFloat(req.body.rbc) < 3.93 || parseFloat(req.body.rbc) > 5) {
    let rbc_result = parseFloat(req.body.rbc) < 3.93 ? "Low" : "High";
    finalResult.rbc = rbc_result;
  }
  //logic for hemo
  if (
    parseFloat(req.body.hemoglobin) < 12.6 ||
    parseFloat(req.body.hemoglobin) > 17.5
  ) {
    let hemoglobin_result =
      parseFloat(req.body.hemoglobin) < 12.6 ? "Low" : "High";
    finalResult.hemoglobin = hemoglobin_result;
  }

  //logic for hema
  if (
    parseFloat(req.body.hematocrit) < 38 ||
    parseFloat(req.body.hematocrit) > 47.7
  ) {
    let hematocrit_result =
      parseFloat(req.body.hematocrit) < 38 ? "Low" : "High";
    finalResult.hematocrit = hematocrit_result;
  }

  //logic for wbc
  if (parseFloat(req.body.wbc) < 3300 || parseFloat(req.body.wbc) > 8700) {
    let wbc_result = parseFloat(req.body.wbc) < 3300 ? "Low" : "High";
    finalResult.wbc = wbc_result;
  }
  //logic for platelet
  if (
    parseFloat(req.body.platelet) < 1.47 ||
    parseFloat(req.body.platelet) > 3.47
  ) {
    let platelet_result = parseFloat(req.body.platelet) < 1.47 ? "Low" : "High";
    finalResult.platelet = platelet_result;
  }
  //logic for Vitamin B1
  if (parseFloat(req.body.b1) < 74 || parseFloat(req.body.b1) > 222) {
    let b1_result = parseFloat(req.body.b1) < 74 ? "Low" : "High";
    finalResult.b1 = b1_result;
  }

  const newData = new beriberi({
    rbc: req.body.rbc,
    hemoglobin: req.body.hemoglobin,
    hematocrit: req.body.hematocrit,
    wbc: req.body.wbc,
    platelet: req.body.platelet,

    b1: req.body.b1,

    fatigue: req.body.fatigue,
    slnf: req.body.slnf,

    result: finalResult,
  });

  await newData.save().then(() => {
    console.log("datasaved");
    // anemia.find({},(err,data)=>{})

    const finalArray = [
      "RBC:" + finalResult.rbc,
      "Hemoglobin:" + finalResult.hemoglobin,
      "Hematocrit:" + finalResult.hematocrit,
      "WBC:" + finalResult.wbc,
      "Platelet:" + finalResult.platelet,

      "Vitamin B1:" + finalResult.b1,

      "Fatigue:" + finalResult.fatigue,
      "Swellin legs and feet:" + finalResult.slnf,
    ];

    let high_low = [];
    let normal = [];

    // entering high low values inside of high_low array
    finalArray.forEach((element) => {
      if (element.indexOf("Normal") == -1) {
        high_low.push(element);
      } else {
        normal.push(element);
      }
    });
    console.log(high_low, normal);

    // entering normal values inside of normal array

    res.render("./result/beriberiResult.ejs", {
      result1: high_low,
      result2: normal,
      result: finalResult,
    });
    //
    //
  });
});

//Post for pellagra
app.post("/pellagraData", async (req, res) => {
  // Final Result
  let finalResult = {
    rbc: "Normal",
    hemoglobin: "Normal",
    hematocrit: "Normal",
    wbc: "Normal",
    platelet: "Normal",

    b3: "Normal",

    diarrhea: "Normal",
    skinin: "Normal",
    dementia: "Normal",
  };

  // logic for Rbc

  if (parseFloat(req.body.rbc) < 3.93 || parseFloat(req.body.rbc) > 5) {
    let rbc_result = parseFloat(req.body.rbc) < 3.93 ? "Low" : "High";
    finalResult.rbc = rbc_result;
  }
  //logic for hemo
  if (
    parseFloat(req.body.hemoglobin) < 12.6 ||
    parseFloat(req.body.hemoglobin) > 17.5
  ) {
    let hemoglobin_result =
      parseFloat(req.body.hemoglobin) < 12.6 ? "Low" : "High";
    finalResult.hemoglobin = hemoglobin_result;
  }

  //logic for hema
  if (
    parseFloat(req.body.hematocrit) < 38 ||
    parseFloat(req.body.hematocrit) > 47.7
  ) {
    let hematocrit_result =
      parseFloat(req.body.hematocrit) < 38 ? "Low" : "High";
    finalResult.hematocrit = hematocrit_result;
  }

  //logic for wbc
  if (parseFloat(req.body.wbc) < 3300 || parseFloat(req.body.wbc) > 8700) {
    let wbc_result = parseFloat(req.body.wbc) < 3300 ? "Low" : "High";
    finalResult.wbc = wbc_result;
  }
  //logic for platelet
  if (
    parseFloat(req.body.platelet) < 1.47 ||
    parseFloat(req.body.platelet) > 3.47
  ) {
    let platelet_result = parseFloat(req.body.platelet) < 1.47 ? "Low" : "High";
    finalResult.platelet = platelet_result;
  }
  //logic for Vitamin B3
  if (parseFloat(req.body.b3) < 6 || parseFloat(req.body.b3) > 16) {
    let b3_result = parseFloat(req.body.b3) < 6 ? "Low" : "High";
    finalResult.b3 = b3_result;
  }

  const newData = new pellagra({
    rbc: req.body.rbc,
    hemoglobin: req.body.hemoglobin,
    hematocrit: req.body.hematocrit,
    wbc: req.body.wbc,
    platelet: req.body.platelet,

    b3: req.body.b3,

    diarrhea: req.body.diarrhea,
    skinin: req.body.skinin,
    dementia: req.body.dementia,

    result: finalResult,
  });

  await newData.save().then(() => {
    console.log("datasaved");
    // anemia.find({},(err,data)=>{})

    const finalArray = [
      "RBC:" + finalResult.rbc,
      "Hemoglobin:" + finalResult.hemoglobin,
      "Hematocrit:" + finalResult.hematocrit,
      "WBC:" + finalResult.wbc,
      "Platelet:" + finalResult.platelet,

      "Vitamin B3:" + finalResult.b3,

      "Diarrhea:" + finalResult.diarrhea,
      "Skin inflammation:" + finalResult.skinin,
      "Dementia:" + finalResult.dementia,
    ];

    let high_low = [];
    let normal = [];

    // entering high low values inside of high_low array
    finalArray.forEach((element) => {
      if (element.indexOf("Normal") == -1) {
        high_low.push(element);
      } else {
        normal.push(element);
      }
    });
    console.log(high_low, normal);

    // entering normal values inside of normal array

    res.render("./result/pellagraResult.ejs", {
      result1: high_low,
      result2: normal,
      result: finalResult,
    });
    //
    //
  });
});

//post for Scurvy
app.post("/scurvyData", async (req, res) => {
  // Final Result
  let finalResult = {
    rbc: "Normal",
    hemoglobin: "Normal",
    hematocrit: "Normal",
    wbc: "Normal",
    platelet: "Normal",

    vitaC: "Normal",

    bonePain: "Normal",
    gumDisease: "Normal",
    lossOfTeeth: "Normal",
  };

  // logic for Rbc

  if (parseFloat(req.body.rbc) < 3.93 || parseFloat(req.body.rbc) > 5) {
    let rbc_result = parseFloat(req.body.rbc) < 3.93 ? "Low" : "High";
    finalResult.rbc = rbc_result;
  }
  //logic for hemo
  if (
    parseFloat(req.body.hemoglobin) < 12.6 ||
    parseFloat(req.body.hemoglobin) > 17.5
  ) {
    let hemoglobin_result =
      parseFloat(req.body.hemoglobin) < 12.6 ? "Low" : "High";
    finalResult.hemoglobin = hemoglobin_result;
  }

  //logic for hema
  if (
    parseFloat(req.body.hematocrit) < 38 ||
    parseFloat(req.body.hematocrit) > 47.7
  ) {
    let hematocrit_result =
      parseFloat(req.body.hematocrit) < 38 ? "Low" : "High";
    finalResult.hematocrit = hematocrit_result;
  }

  //logic for wbc
  if (parseFloat(req.body.wbc) < 3300 || parseFloat(req.body.wbc) > 8700) {
    let wbc_result = parseFloat(req.body.wbc) < 3300 ? "Low" : "High";
    finalResult.wbc = wbc_result;
  }
  //logic for platelet
  if (
    parseFloat(req.body.platelet) < 1.47 ||
    parseFloat(req.body.platelet) > 3.47
  ) {
    let platelet_result = parseFloat(req.body.platelet) < 1.47 ? "Low" : "High";
    finalResult.platelet = platelet_result;
  }
  //logic for Vitamin C
  if (parseFloat(req.body.vitaC) > 90) {
    let vitaC_result = parseFloat(req.body.vitaC) > 90 ? "High" : "Low";
    finalResult.vitaC = vitaC_result;
  }

  const newData = new scurvy({
    rbc: req.body.rbc,
    hemoglobin: req.body.hemoglobin,
    hematocrit: req.body.hematocrit,
    wbc: req.body.wbc,
    platelet: req.body.platelet,

    vitaC: req.body.vitaC,

    bonePain: req.body.bonePain,
    gumDisease: req.body.gumDisease,
    lossOfTeeth: req.body.lossOfTeeth,

    result: finalResult,
  });

  await newData.save().then(() => {
    console.log("datasaved");
    // anemia.find({},(err,data)=>{})

    const finalArray = [
      "RBC:" + finalResult.rbc,
      "Hemoglobin:" + finalResult.hemoglobin,
      "Hematocrit:" + finalResult.hematocrit,
      "WBC:" + finalResult.wbc,
      "Platelet:" + finalResult.platelet,

      "Vitamin C:" + finalResult.vitaC,

      "Bone Pain:" + finalResult.bonePain,
      "Gum Disease:" + finalResult.gumDisease,
      "Loss of Teeth:" + finalResult.lossOfTeeth,
    ];

    let high_low = [];
    let normal = [];

    // entering high low values inside of high_low array
    finalArray.forEach((element) => {
      if (element.indexOf("Normal") == -1) {
        high_low.push(element);
      } else {
        normal.push(element);
      }
    });
    console.log(high_low, normal);

    // entering normal values inside of normal array

    res.render("./result/scurvyResult.ejs", {
      result1: high_low,
      result2: normal,
      result: finalResult,
    });
    //
    //
  });
});

// const scheme = Joi.object({
//     name: Joi.string().min(6).required(),
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required()
// })

app.post("/user/register", async (req, res) => {
  //validation when post
  // const { error } = scheme.validate(req.body)
  // if (error) return res.status(400).send((error.details[0].message))

  //email exists or not
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(401).send("email already exist");

  //hashing the password
  const salt = await bcrypt.genSalt(10);
  if (req.body.p1 === req.body.p2) {
    const hashedPassword = await bcrypt.hash(req.body.p1, salt);

    const userCollection = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    try {
      const savedUser = await userCollection.save();
      console.log(savedUser);
      res.redirect("/user/login");
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    alert("Password dosen't match!");
  }
});

//validation for login
// const scheme1 = Joi.object({
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required()
// })

//login post route
app.post("/user/login", async (req, res) => {
  //validation when post
  // const { error } = scheme1.validate(req.body)
  // if (error) return res.status(400).send((error.details[0].message))

  //if email does not exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send("email not found");

  //invalid password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  console.log(validPassword);
  if (validPassword === true) {
    req.session.isAuthUser = true;
    res.redirect("/");
  } else {
    res.redirect("/user/login");
  }

  // res.send("logged in")
});

//home route
app.get("/", (req, res) => {
  console.log(req.session.isAuthUser);
  const data = {
    isAuth: req.session.isAuthUser,
  };
  res.render("home/index.ejs", { datas: data });
});

//anemia route
app.get("/anemia", isAuthUser, (req, res) => {
  res.render("anemia/anemia.ejs");
});

//beriberi route
app.get("/beriberi", isAuthUser, (req, res) => {
  res.render("Beriberi/beriberi.ejs");
});
//pellagra
app.get("/pellagra", isAuthUser, (req, res) => {
  res.render("Pellagra/pellagra.ejs");
});
//scurvy
app.get("/scurvy", isAuthUser, (req, res) => {
  res.render("Scurvy/scurvy.ejs");
});

// result page routes

app.get("/anemia/Anemiaresult", (req, res) => {
  res.render("result/Anemiaresult.ejs");
});

app.get("/anemia/scurvyResult", (req, res) => {
  res.render("result/scurvyResult.ejs");
});

app.get("/anemia/pellagraResult", (req, res) => {
  res.render("result/pellagraResult.ejs");
});

app.get("/anemia/beriberiResult", (req, res) => {
  res.render("result/beriberiResult.ejs");
});

app.get("/about", (req, res) => {
  res.render("about/about.ejs");
});

app.get("/user/login", (req, res) => {
  res.render("login/login.ejs");
});

app.get("/user/logout", (req, res) => {
  req.session.isAuthUser = false;
  // res.clearCookie()
  res.redirect("/user/login");
});

app.get("/user/register", (req, res) => {
  res.render("register/register.ejs");
});

app.listen(8000, () => {
  console.log("running on port 8000");
});

// css ,js ,img public folder -->static
// views--> ejs,html
