const mongoose = require('mongoose');
const pwm = require('../models/pwmModel')

sampleAddr = {}
for (var i = 0; i < 16; i++) {
    sampleAddr['a'+i] = null
}

const sample = async (req, res) => {

    console.log('starting sample2')
    const newPwm = new pwm({
        name: 'sample6',
        addrs: sampleAddr
    })

    await newPwm.save();
    console.log('finished sample2')

    return res.status(200).json({msg: 'success'})
};

module.exports = {
    sample,
}