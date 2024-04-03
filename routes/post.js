const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    likes: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    } ],
    caption: {
        type: String
    },
    media: {     type: String    }
})
module.exports = mongoose.model('post', postSchema)