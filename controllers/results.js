module.exports = function(async, Product, Users) {
    return {
        SetRouting: function(router){
            router.get('/results',this.getResults);
            router.post('/results',this.postResults);
        },

        getResults: function(req, res) {
            res.redirect('/home');
        },

        postResults: function(req, res){
            async.parallel([
                function(callback){
                    const regex = new RegExp((req.body.country), 'gi');
                    Product.find({'$or': [{'category':regex}, {'name': regex}]}, (err, result) => {
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                const dataChunk  = [];
                const chunkSize = 3;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                res.render('results', {title: 'Sonic - Results', user: req.user, chunks: dataChunk});
            })
        }
    }
}