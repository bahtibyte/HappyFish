const { Schema, model } = require('mongoose')

const ShelfSchema = new Schema({
    name: String,
    rackId: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
    pwmIdW: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
    pwmIdRGB: { type: Schema.Types.ObjectId, ref: 'ObjectId' },
    kind: String,
    mode: Number,
    wAddr: String,
    rAddr: String,
    gAddr: String,
    bAddr: String,
    wValue: Number,
    rValue: Number,
    gValue: Number,
    bValue: Number
})

const shelf = model('shelf', ShelfSchema)
module.exports = shelf
