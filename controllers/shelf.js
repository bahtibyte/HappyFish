const pwm = require('../models/pwmModel')
const rack = require('../models/rackModel')
const shelf = require('../models/shelfModel')
const mongoose = require('mongoose')

const newShelf = async (req, res) => {

    if (!req.body.rackId) 
        return res.status(400).json({'error': 'missing rackId'})

    const doc = await rack.findById(req.body.rackId)

    if (!doc)
        return res.status(400).json({'error': 'rack does not exist'})

    const newShelf = new shelf({
        name: 'sample shelf',
        rackId: doc._id,
        kind: 'tbd',
        mode: 0
    })
    await newShelf.save()

    doc.shelves.push(newShelf._id)
    await doc.save()

    return res.status(201).json(newShelf)
}

const updateName = async (req, res) => {
    if (!req.body._id) 
        return res.status(400).json({'error': 'missing shelf _id'})
    
    if (!req.body.name) 
        return res.status(400).json({'error': 'missing name'})
    
    const doc = await shelf.findById(req.body._id)
    
    if (!doc)
        return res.status(400).json({'error': 'corresponding _id does not exist'})

    doc.name = req.body.name
    await doc.save()

    return res.status(201).json(doc)
}

const clearAddr = async (doc) => {
    if (doc.pwmIdW) {
        const pwmDoc = await pwm.findById(doc.pwmIdW)
        pwmDoc.addrs[doc.wAddr] = null
        await pwmDoc.save()

        doc.pwmIdW = undefined
        doc.wAddr = undefined
        doc.wValue = undefined
    }

    if (doc.pwmIdRGB) {
        const pwmDoc = await pwm.findById(doc.pwmIdRGB)
        pwmDoc.addrs[doc.rAddr] = null
        pwmDoc.addrs[doc.gAddr] = null
        pwmDoc.addrs[doc.bAddr] = null
        await pwmDoc.save()

        doc.pwmIdRGB = undefined
        doc.rAddr = undefined
        doc.gAddr = undefined
        doc.bAddr = undefined
        doc.rValue = undefined
        doc.gValue = undefined
        doc.bValue = undefined
    }
}

const updateAddr = async (req, res) => {
    if (!req.body._id) 
        return res.status(400).json({'error': 'missing shelf _id'})
    if (!req.body.kind) 
        return res.status(400).json({'error': 'missing kind'})

    const kind = req.body.kind
    if ((kind == 'hybrid' || kind == 'white') && (!req.body.pwmIdW || !req.body.wAddr)) 
        return res.status(400).json({'error': 'missing white pwm/addr'})

    if ((kind == 'hybrid' || kind == 'rgb') && (!req.body.pwmIdRGB || !req.body.rAddr|| !req.body.gAddr|| !req.body.bAddr)) 
        return res.status(400).json({'error': 'missing rgb pwm/addr'})
    
    const doc = await shelf.findById(req.body._id)
    
    if (!doc)
        return res.status(400).json({'error': 'corresponding _id does not exist'})

    await clearAddr(doc)

    if (kind == 'hybrid' || kind == 'white') {
        doc.pwmIdW = new mongoose.mongo.ObjectId(req.body.pwmIdW)
        doc.wAddr = req.body.wAddr
        doc.wValue = 0

        const pwmDoc = await pwm.findById(doc.pwmIdW)
        pwmDoc.addrs[doc.wAddr] = doc._id
        await pwmDoc.save()
    }
    
    if (kind == 'hybrid' || kind == 'rgb') {
        doc.pwmIdRGB = new mongoose.mongo.ObjectId(req.body.pwmIdRGB)
        doc.rAddr = req.body.rAddr
        doc.gAddr = req.body.gAddr
        doc.bAddr = req.body.bAddr
        doc.rValue = 0
        doc.gValue = 0
        doc.bValue = 0

        const pwmDoc = await pwm.findById(doc.pwmIdRGB)
        pwmDoc.addrs[doc.rAddr] = doc._id
        pwmDoc.addrs[doc.gAddr] = doc._id
        pwmDoc.addrs[doc.bAddr] = doc._id

        await pwmDoc.save()
    }
    
    doc.kind = kind
    await doc.save()

    return res.status(201).json(doc)
}

const deleteShelf = async (req, res) => {
    const doc = await shelf.findById(req.params.shelfId)

    if (!doc)
        return res.status(400).json({'error': 'corresponding shelfId does not exist'})

    const rackDoc = await rack.findById(doc.rackId)
    rackDoc.shelves.splice(rackDoc.shelves.indexOf(doc._id), 1)
    await rackDoc.save()

    await clearAddr(doc)

    doc.remove()

    return res.status(201).json({doc})
}

module.exports = {
    newShelf,
    updateName,
    updateAddr,
    deleteShelf
}
