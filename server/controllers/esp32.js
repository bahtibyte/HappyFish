const esp32 = require('../models/esp32Model')

const reset = async(req, res) => {
    const docs = await esp32.find()

    if (docs.length == 0) {
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

    return res.status(201).json(docs[0])
}

const configs = async(req, res) => {
    const docs = await esp32.find()
    var today = new Date();
    const doc = docs[0] 
    doc['tod'] =  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return res.status(201).json(docs)
}

module.exports = {
    reset,
    configs
}
