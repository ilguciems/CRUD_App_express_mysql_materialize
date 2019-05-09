const express = require("express");
const app = express();
const path = require("path");

const mysql = require("mysql");

const config = require("./config");

const con = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password
});

const cont = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.db
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Database connected!");
  con.query("CREATE DATABASE IF NOT EXISTS myusers", function(err, result) {
    if (err) throw err;
    console.log("Database ready to use!");
    con.end(function(err) {
      if (err) {
        return console.log(err.message);
      }
    });
    var sql =
      "CREATE TABLE IF NOT EXISTS users (id int(11) NOT NULL auto_increment, name varchar(100) NOT NULL, age int(3) NOT NULL, email varchar(100) NOT NULL, PRIMARY KEY (id));";
    cont.query(sql, function(err, result) {
      if (err) throw err;
      console.log("Table ready to use!");
    });
  });
});

const connection = require("express-myconnection");

const dbOptions = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  port: config.database.port,
  database: config.database.db
};

app.use(connection(mysql, dbOptions, "pool"));

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

const index = require("./routes/index");
const users = require("./routes/users");

const expressValidator = require("express-validator");
app.use(expressValidator());

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const methodOverride = require("method-override");

app.use(
  methodOverride(function(req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(cookieParser("keyboard cat"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);
app.use(flash());

app.use("/", index);
app.use("/users", users);

app.listen(3000, function() {
  console.log("Server running at port 3000");
});
