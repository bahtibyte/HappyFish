const { Schema, model} = require('mongoose')

const pwmSchema = new Schema({
    name: String,
    next: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
    prev: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
    addrs: {
        a0: { type: Schema.Types.ObjectId, ref: 'ObjectId' }, 
        a1: { type: Schema.Types.ObjectId, ref: 'ObjectId' }, 
        a2: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
        a3: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
        a4: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
        a5: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
        a6: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
        a7: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
        a8: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
        a9: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
        a10: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
        a11: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
        a12: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
        a13: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
        a14: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
        a15: { type: Schema.Types.ObjectId, ref: 'ObjectId' }
    }
})

const pwm = model('pwm', pwmSchema)
module.exports = pwm
