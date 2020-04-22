module.exports = function(async, Product, _, Users, Like ){
    return {
        SetRouting: function(router){
            router.get('/like', this.likePage);
        },
        
        likePage: function(req, res){
            async.parallel([
                function(callback){
                    Like.find({Cid:req.user._id})
                        .populate('Pid')
                        .exec((err, result) => {
                            callback(err, result);
                        })
                },
                
                function(callback){
                    Users.findOne({'username': req.user.username})
                        .exec((err, result) => {
                            callback(err, result);
                        })
                },
                
                
            ], (err, results) => {
                    const res1 = results[0];
                    const res3 = results[1];
                    const dat=res1;
                    const dataChunk  = [];
                    const chunkSize = 3;
                    for (let i = 0; i < dat.length; i += chunkSize){
                        dataChunk.push(dat.slice(i, i+chunkSize));
                    }
                    res.render('productchat/like', {title: 'Sonic - like', user:req.user, chunks: dataChunk, data:res3});
                });
        }
    }
}