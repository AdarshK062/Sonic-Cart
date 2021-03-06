const dependable = require('dependable');
const path = require('path');
const container = dependable.container();
const simpleDependencies = [
    ['_', 'lodash'],
    ['mongoose', 'mongoose'],
    ['passport','passport'],
    ['formidable', 'formidable'],
    ['async', 'async'], 
    ['Issue', './models/issue'],
    ['Product', './models/products'],
    ['Users', './models/user'],
    ['Review', './models/reviews'],
    ['Solution', './models/solutions'],
    ['Cart', './models/cart'],
    ['Like', './models/like'],
];

simpleDependencies.forEach(function(val){
    container.register(val[0], function(){
        return require(val[1]);
    })
});

container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register('container', function(){
    return container;
});

module.exports = container;