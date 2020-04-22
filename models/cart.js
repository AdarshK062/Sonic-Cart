const mongoose = require('mongoose');
const cart = mongoose.Schema({
    Cid: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},  
    Pid: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}
});
module.exports = mongoose.model('Cart', cart);