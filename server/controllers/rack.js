const rack = require('../models/rackModel')

const newRack = async (req, res) => {
    try {
        console.log('Creating new rack')

        const newRack = new rack({
            name: 'sample rack',
            shelves: []
        })
        await newRack.save();

        return res.status(201).json(newRack)
    } catch (error) {
        console.log(error)
        return res.status(400).json({'error': 'exception thrown'})
    }
}

const updateName = async (req, res) => {
    try {
        console.log('Updating rack name. body=' + req.body)
        if (!req.body._id) 
            return res.status(400).json({'error': 'missing pwm _id'})
        
        if (!req.body.name) 
            return res.status(400).json({'error': 'missing name'})
        
        
        const doc = await rack.findById(req.body._id)

        if (!doc)
            return res.status(400).json({'error': 'corresponding _id does not exist'})
        
        doc.name = req.body.name
        doc.save()
        
        return res.status(201).json(doc)
    } catch (error) {
        console.log(error)
        return res.status(400).json({'error': 'exception thrown'})
    }
}

const deleteRack = async (req, res) => {
    try {
        console.log('Deleting rack. params=' + req.params)
        const doc = await rack.findById(req.params.rackId)

        if (!doc)
            return res.status(400).json({'error': 'corresponding rackId does not exist'})

        if (doc.shelves.length != 0)
            return res.status(400).json({'error': 'rack contains shelves'})

        doc.remove()

        return res.status(201).json(doc)
    } catch (error) {
        console.log(error)
        return res.status(400).json({'error': 'exception thrown'})
    }
}

module.exports = {
    newRack,
    updateName,
    deleteRack
}


