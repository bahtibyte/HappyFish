const pwm = require('../models/pwmModel')
const rack = require('../models/rackModel')

const config = async (req, res) => {

    data = {
        'pwms': [],
        'racks': []
    }

    const pwms = await pwm.find()
    for (var i = 0; i < pwms.length; i++) {
        data['pwms'].push(pwms[i]._id)
        data[pwms[i]._id] = pwms[i]
    }

    const racks = await rack.find()
    for (var i = 0; i < racks.length; i++) {
        data['racks'].push(racks[i]._id)
        data[racks[i]._id] = racks[i]
    }

    return res.status(200).json(data)
};

module.exports = {
    config, 
}