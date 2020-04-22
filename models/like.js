const mongoose = require('mongoose');
const like = mongoose.Schema({
    Cid: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},  
    Pid: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}
});
module.exports = mongoose.model('Like', like);