const path = require("path");
const esp32 = require("../models/esp32Model");

const reset = async (req, res) => {
	const docs = await esp32.find();

	if (docs.length == 0) {
		const newEsp32 = new esp32({
			tod: "00:00:00",
			sunrise: "08:00:00",
			sunset: "20:00:00",
			duration: 30,
			rValue: 0,
			gValue: 0,
			bValue: 0,
		});
		await newEsp32.save();
		return res.status(201).json(newEsp32);
	}

	return res.status(201).json(docs[0]);
};

const config = async (req, res) => {
	const docs = await esp32.find();
	const doc = docs[0];
	const today = new Date();
	//converting to utc time
	const utc = new Date(today.toUTCString().slice(0, -4));

	//doc["tod"] = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	//today.setHours(today.getHours());
    var hours =  utc.getHours() < 10 ? "0" +  utc.getHours() :  utc.getHours();
    var mins =  utc.getMinutes() < 10 ? "0" +  utc.getMinutes() :  utc.getMinutes();
    var secs =  utc.getSeconds() < 10 ? "0" +  utc.getSeconds() :  utc.getSeconds();
	doc["tod"] =hours + ":" + mins + ":" + secs;

	return res.status(201).json(doc);
};

const dashboard = async (req, res) => {
	res.sendFile(path.resolve(__dirname, "../public/esp32.html"));
};

const save = async (req, res) => {
	console.log("incoming data");
	console.log(JSON.stringify(req.body));

	if (!req.body.pin || !req.body.value)
		return res.status(400).json({ error: "missing pin / value" });

	const pin = req.body.pin;
	if (pin != "r" && pin != "g" && pin != "b")
		return res.status(400).json({ error: "invalid pin" });

	const docs = await esp32.find();
	console.log(docs);
	const doc = docs[0];
	console.log(doc);

	doc[pin + "Value"] = req.body.value;

	await doc.save();

	return res.status(201).json(doc);
};

const saveDuration = async (req, res) => {
	console.log("incoming data");
	console.log(JSON.stringify(req.body));

	if (!req.body.duration) return res.status(400).json({ error: "missing duration" });

	const docs = await esp32.find();
	const doc = docs[0];

	doc["duration"] = req.body.duration;

	await doc.save();

	return res.status(201).json(doc);
};

const saveCustom = async (req, res) => {
	console.log("incoming data");
	console.log(JSON.stringify(req.body));

	if (!req.body.sunrise || !req.body.sunset)
		return res.status(400).json({ error: "missing sunrise / sunset" });

	const docs = await esp32.find();
	console.log(docs);
	const doc = docs[0];
	console.log(doc);

	doc["sunrise"] = req.body.sunrise + ":00";
	doc["sunset"] = req.body.sunset+ ":00";

	await doc.save();

	return res.status(201).json(doc);
};

module.exports = {
	reset,
	config,
	dashboard,
	save,
	saveDuration,
	saveCustom,
};
