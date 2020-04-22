const mongoose = require('mongoose');
var review = mongoose.Schema({
    message: {type: String},
    name: {type: String},
    stars:{type: Number, default: 0},
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now}
});
module.exports= mongoose.model('Review', review);