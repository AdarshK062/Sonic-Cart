module.exports = function(async, Product, _, Users, Cart, Like ){
    return {
        SetRouting: function(router){
            router.get('/home', this.homePage);
            router.post('/home', this.postHomePage);
            router.get('/logout', this.logout);
        },
        
        homePage: function(req, res){
            async.parallel([
                function(callback){
                    Product.find({}, (err, result) => {
                        callback(err, result);
                    });
                },
                
                function(callback){
                    Product.aggregate([{
                        $group: {
                            _id: "$category"
                        }
                    }], (err, newResult) => {
                       callback(err, newResult) ;
                    });
                },
                
                function(callback){
                    Users.findOne({'username': req.user.username})
                        .exec((err, result) => {
                            callback(err, result);
                        })
                },
                
                
            ], (err, results) => {
                    const res1 = results[0];
                    const res2 = results[1];
                    const res3 = results[2];
                    const dataChunk  = [];
                    const chunkSize = 3;
                    for (let i = 0; i < res1.length; i += chunkSize){
                        dataChunk.push(res1.slice(i, i+chunkSize));
                    }
                    const classSort = _.sortBy(res2, '_id');
                    res.render('home', {title: 'Sonic - Home', user:req.user, chunks: dataChunk, country: classSort, data:res3});// chunks: dataChunk, country: countrySort, data:res3, chat:res4});
                });
        },

        postHomePage: function(req, res){
            var likes;
            var carts;
            Like.find({
                '$or':[
                    {'Pid': req.body.id},
                    {'Cid': req.user._id}
                ]
            }, function(err, result) {
                if (err) throw err;
                likes=result;
                //console.log(result);
              });
            // async.parallel([
            //     function(callback){
            //         Like.find({
            //             '$or':[
            //                 {'Pid': req.body.id},
            //                 {'Cid': req.user._id}
            //             ]
            //         })
            //         .exec( (err, result) => {
            //             callback(err, result);
            //         });
            //     }
            // ], (err, results) => {
            //         likes = results[0];
            //     });
            console.log('hi',likes);
            async.parallel([
                function(callback){
                    if(req.body.like){
                        Users.update({
                            '_id':req.user._id,
                            'liked.productName': {$ne: req.body.productName}
                        },
                        {
                            $push: {liked: {
                                productName: req.body.productName
                            }}    
                        }, (err, result1) => {
                            callback(err, result1);
                        })
                    }
                },
                function(callback){
                    if(req.body.like)
                    Product.update({
                        '_id':req.body.id,
                        'likes.username': {$ne: req.user.username}
                        },
                        {
                            $push: {likes: {
                                username: req.user.username,
                                email: req.user.email
                            }}
                        }, 
                        (err, count) => {
                            callback(err, count);
                        });
                },
                function(callback){
                    if(req.body.cart){
                        Users.update({
                            '_id':req.user._id,
                            'cart.productName': {$ne: req.body.productName}
                        },
                        {
                            $push: {cart: {
                                productName: req.body.productName
                            }}    
                        }, (err, result1) => {
                            callback(err, result1);
                        })
                    }
                },
                function(callback){
                    if(req.body.cart){
                        Cart.find({
                            '$and':[
                                {'Pid': req.body.id},
                                {'Cid': req.user._id}
                            ]
                        }, function(err, result) {
                            if (err) throw err;
                            if(result.length==0){
                                const cart=new Cart();
                                cart.Cid=req.user._id;
                                cart.Pid=req.body.id;
                                cart.save((err, msg) => {
                                    callback(err, msg);
                                })
                            }
                        });
                    }
                },
                function(callback){
                    if(req.body.like){
                        Like.find({
                            '$and':[
                                {'Pid': req.body.id},
                                {'Cid': req.user._id}
                            ]
                        }, function(err, result) {
                            if (err) throw err;
                                if(result.length==0){
                                const like=new Like();
                                like.Cid=req.user._id;
                                like.Pid=req.body.id;
                                like.save((err, msg) => {
                                    callback(err, msg);
                                })
                            }
                        });
                    }
                    
                }
               
            ], 
            (err, results) => {
                res.redirect('/home');
            });
        },
        
        logout: function(req, res){
            req.logout();
            req.session.destroy((err) => {
               res.redirect('/');
            });
        }
    }
}