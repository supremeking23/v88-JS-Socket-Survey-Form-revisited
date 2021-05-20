const EXPRESS = require("express");
const APP = EXPRESS();
const PORT = 8080;
const SERVER = APP.listen(PORT);
const IO = require("socket.io")(SERVER);

var { random } = require("./my_modules/mathlib")();

let bodyParser = require("body-parser");
let session = require("express-session");
APP.use(bodyParser.urlencoded({ extended: true }));

APP.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 600000 },
	})
);

// for image/js/css
APP.use(EXPRESS.static(__dirname + "/static"));
// This sets the location where express will look for the ejs views
APP.set("views", __dirname + "/views");
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
APP.set("view engine", "ejs");
// use app.get method and pass it the base route '/' and a callback

IO.on("connection", function (socket) {
	//2

	socket.on("form-process", function (data) {
		//7
		console.log(`You emitted the following information to the server: ${data.form_process}`);

		socket.emit("updated_message", {
			updated_message: `You emitted the following information to the server: ${JSON.stringify(data.form_process)}`,
		});

		socket.emit("random_number", {
			random_number: `Your lucky number emitted by the server is : ${random(1, 1000)}`,
		});
	});
});

APP.get("/", (req, res) => {
	res.render("index");
});

APP.post("/process_form", (req, res) => {
	// console.log(req.body);
	// req.session.survey_information = req.body;
	// res.redirect("/result");
	// when the server loads
	// res.json({ data: req.body });
});

// APP.listen(PORT, (req, res) => {
// 	console.log(`Server is listening to ${PORT}`);
// });
