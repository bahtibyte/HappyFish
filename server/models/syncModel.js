const { Schema, model } = require('mongoose')

const SyncSchema = new Schema({
    sync: Boolean,
})

const sync = model('sync', SyncSchema)
module.exports = sync
