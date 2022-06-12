const pwm = require('../models/pwmModel')
const rack = require('../models/rackModel')
const shelf = require('../models/shelfModel')
const sync = require('../models/syncModel')

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

    const shelves = await shelf.find()
    for (var i = 0; i < shelves.length; i++) {
        data[shelves[i]._id] = shelves[i]
    }

    const syncs = await sync.find()
    if (syncs.length == 0) {
        data['sync'] = true
    }else{
        data['sync'] = syncs[0].sync
    }

    return res.status(200).json(data)
};

const syncdNotify = async (req, res) => {

    const docs = await sync.find()

    if (docs.length == 0) {
        const newSync = new sync({sync: false})
        await newSync.save();
        return res.status(201).json(newSync)
    }

    const doc = docs[0]
    doc.sync = false
    await doc.save()
    return res.status(201).json(doc)
}

const modeChange = async (req, res) => {

    if (!req.body._id) 
        return res.status(400).json({'error': 'missing shelf _id'})
    
    if (!req.body.mode) 
        return res.status(400).json({'error': 'missing mode'})

    const doc = await shelf.findById(req.body._id)

    if (!doc)
        return res.status(400).json({'error': 'corresponding shelf does not exist'})

    if (doc.kind == 'tbd')
        return res.status(400).json({'error': 'shelf not configured'})
    
    const mode = parseInt(req.body.mode)
    
    if (doc.kind == 'white') {
        if (mode != 0 && mode != 1) 
            return res.status(400).json({'error': 'only mode 0 or 1 accepted for white shelf'})
        
        doc.wValue = 0;
        doc.mode = mode;
        await doc.save()
        return res.status(201).json(doc)
    }

    if (doc.kind == 'rgb') {
        if (mode < 0 || mode > 2) 
            return res.status(400).json({'error': 'only mode 0 to 2 accepted for rgb shelf'})
        
        if (mode == 0) {
            doc.rValue = 0
            doc.gValue = 0
            doc.bValue = 0
        }

        doc.mode = 0
        await doc.save()
        return res.status(201).json(doc) 
    }

    if (doc.kind == 'hybrid') {
        if (mode < 0 || mode > 3) 
            return res.status(400).json({'error': 'only mode 0 to 3 accepted for hybrid shelf'})
        
        if (mode == 0 || mode == 1) {
            doc.rValue = 0
            doc.gValue = 0
            doc.bValue = 0
        }

        doc.wValue = 0
        doc.mode = 0
        await doc.save()
        return res.status(201).json(doc) 
    }
    
    return res.status(400).json({'error': 'this will never happen'})
}

const valueChange = async (req, res) => {

    if (!req.body._id) 
        return res.status(400).json({'error': 'missing shelf _id'})

    const doc = await shelf.findById(req.body._id)

    if (!doc)
        return res.status(400).json({'error': 'corresponding shelf does not exist'})

    if (doc.kind == 'tbd')
        return res.status(400).json({'error': 'shelf not configured'})
    
    if (doc.kind == 'hybrid' || doc.kind == 'white') {
        if (!req.body.wValue) 
            return res.status(400).json({'error': 'missing wValue'})
        
        const wValue = parseInt(req.body.wValue)
        if (wValue < 0 || wValue > 100)
            return res.status(400).json({'error': 'wValue must be between 0 and 100'})

        doc.wValue = wValue
    }
    
    if (doc.kind == 'hybrid' || doc.kind == 'rgb') {
        if (!req.body.rValue || !req.body.gValue || !req.body.bValue) 
            return res.status(400).json({'error': 'missing rgb values'})

        const rValue = parseInt(req.body.rValue)
        const gValue = parseInt(req.body.gValue)
        const bValue = parseInt(req.body.bValue)
        if (rValue < 0 || rValue > 255 || gValue < 0 || gValue > 255 || bValue < 0 || bValue > 255)
            return res.status(400).json({'error': 'rgb values must be between 0 and 100'})
        
        doc.rValue = rValue
        doc.gValue = gValue
        doc.bValue = bValue
    }

    await doc.save()
    return res.status(201).json(doc) 
}

module.exports = {
    config, 
    syncdNotify,
    modeChange,
    valueChange
}
