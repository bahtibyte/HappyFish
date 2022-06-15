const pwm = require('../models/pwmModel')
const sync = require('../models/syncModel')

sampleAddr = {}
for (var i = 0; i < 16; i++) {
    sampleAddr['a'+i] = null
}

const resync = async(req, res) => {
    const docs = await sync.find()

    if (docs.length == 0) {
        const newSync = new sync({sync: true})
        await newSync.save();
        return res.status(201).json(newSync)
    }

    const doc = docs[0]
    doc.sync = true
    await doc.save()
    return res.status(201).json(doc)
}

const newModule = async (req, res) => {
    try {
        console.log('Creating new pwm module')

        const all = await pwm.find()
    
        if (all.length > 10) 
            return res.status(400).json({'error': 'do not support more than 10 pwms'})
    
        const newPwm = new pwm({
            name: 'sample name',
            addrs: sampleAddr
        })
    
        await newPwm.save()
        
        return res.status(201).json(newPwm)
    } catch (error) {
        console.log(error)
        return res.status(400).json({'error': 'exception thrown'})
    }
};

const updateName = async (req, res) => {
    try {
        console.log('Updating pwm name. body=' + JSON.stringify(req.body))

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
    } catch (error) {
        console.log(error)
        return res.status(400).json({'error': 'exception thrown'})
    }
}


const deleteModule = async (req, res) => {
    try {
        console.log('Deleting pwm module. params=' + JSON.stringify(req.params))

        const doc = await pwm.findById(req.params.pwmId)

        if (!doc)
            return res.status(400).json({'error': 'corresponding pwmId does not exist'})

        const addrs = doc.addrs
        for (var i = 0; i < 16; i++) {
            if (addrs['a' + i] != null) {
                return res.status(400).json({'error': 'pwm module has shelf connected. disconnect all shelves before deleting'})
            }
        }

        await doc.remove()

        return res.status(201).json(doc)
    } catch (error) {
        console.log(error)
        return res.status(400).json({'error': 'exception thrown'})
    }
}

module.exports = {
    newModule,
    updateName,
    deleteModule,
    resync
}
