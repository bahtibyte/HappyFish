const esp32 = require('../models/esp32Model')

const reset = async(req, res) => {
    const newEsp32 = new esp32({
        tod: '00:00:00',
        sunrise: '08:00',
        sunset: '20:00',
        duration: 30,
        rValue: 0,
        gValue: 0,
        bValue: 0
    })
    await newEsp32.save();
    return res.status(201).json(newEsp32)
}


module.exports = {
    reset
}
