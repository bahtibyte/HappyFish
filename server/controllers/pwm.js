const pwm = require('../models/pwmModel')

sampleAddr = {}
for (var i = 0; i < 16; i++) {
    sampleAddr['a'+i] = null
}

const newModule = async (req, res) => {
    const all = await pwm.find()
    
    if (all.length > 10) 
        return res.status(400).json({'error': 'do not support more than 10 pwms'})

    if (all.length == 0) {
        const newPwm = new pwm({
            name: 'sample name',
            next: null,
            prev: null,
            addrs: sampleAddr
        })
        await newPwm.save();
        return res.status(201).json(newPwm)
    }

    const last = all[all.length-1]

    const newPwm = new pwm({
        name: 'sample name',
        next: null,
        prev: last._id,
        addrs: sampleAddr
    })
    await newPwm.save()
    last.next = newPwm._id
    await last.save()
    
    return res.status(201).json(newPwm)
};

const updateName = async (req, res) => {
    if (!req.body._id) 
        return res.status(400).json({'error': 'missing pwm _id'})
    
    if (!req.body.name) 
        return res.status(400).json({'error': 'missing name'})
    
    const doc = await pwm.findById(req.body._id)
    
    if (!doc)
        return res.status(400).json({'error': 'corresponding _id does not exist'})

    doc.name = req.body.name
    await doc.save()

    return res.status(201).json(doc)
}


const deleteModule = async (req, res) => {
    const doc = await pwm.findById(req.params.pwmId)

    if (!doc)
        return res.status(400).json({'error': 'corresponding pwmId does not exist'})

    if (doc.prev && doc.next) {
        const prevDoc = await pwm.findById(doc.prev)
        const nextDoc = await pwm.findById(doc.next)
        prevDoc.next = nextDoc._id
        nextDoc.prev = prevDoc._id
        await prevDoc.save()
        await nextDoc.save()
    } else if (!doc.prev && doc.next) {
        const nextDoc = await pwm.findById(doc.next)
        nextDoc.prev = null
        await nextDoc.save()
    } else if (!doc.next && doc.prev) {
        const prevDoc = await pwm.findById(doc.prev)
        prevDoc.next = null
        await prevDoc.save()
    } 

    doc.remove()

    return res.status(201).json({doc})
}

module.exports = {
    newModule,
    updateName,
    deleteModule
}
