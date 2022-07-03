const { Schema, model } = require('mongoose')

const ESP32Schema = new Schema({
    tod: String,
    sunrise: String,
    sunset: String, 
    duration: Number,
    rValue: Number,
    gValue: Number,
    bValue: Number
})

const esp32 = model('esp32', ESP32Schema)
module.exports = esp32
