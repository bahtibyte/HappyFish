const { Schema, model } = require('mongoose')

const RackSchema = new Schema({
    name: String,
    shelves: [{ type: Schema.Types.ObjectId, ref: 'ObjectId' }]
})

const rack = model('rack', RackSchema)
module.exports = rack
