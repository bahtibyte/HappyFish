const path = require("path");
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
    const doc = docs[0] 
    const today = new Date();
    doc['tod'] =  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return res.status(201).json(doc)
}

const dashboard = async(req, res) => {
    res.sendFile(path.resolve(__dirname, "../public/esp32.html"));
}

const save = async (req, res) => {

    console.log('incoming data')
    console.log(JSON.stringify(req.body))

    if (!req.body.pin || !req.body.value) 
        return res.status(400).json({'error': 'missing pin / value'})

    const pin = req.body.pin
    if (pin != 'r' && pin != 'g' && pin != 'b')
        return res.status(400).json({'error': 'invalid pin'})

    const docs = await esp32.find()
    const doc = docs[0] 

    doc[pin+'Value'] = req.body.value

    await doc.save()

    return res.status(201).json(doc)
}


module.exports = {
    reset,
    configs,
    dashboard,
    save
}
