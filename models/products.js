const mongoose = require('mongoose');
const productNames = mongoose.Schema({
    name: {type: String, default: ''},
    category: {type: String, default: ''},
    cost:{type: String, default:''},
    image: {type: String, default: 'default.png'},
    likes:[{
        username: {type: String, default: ''},
        email: {type: String, default: ''}
    }]
});
module.exports = mongoose.model('Product', productNames);