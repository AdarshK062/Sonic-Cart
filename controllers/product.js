module.exports = function(Users, async,  Review, Issue){
    return {
        SetRouting: function(router){
            router.get('/product/:name', this.productPage);
            router.post('/product/:name', this.productPostPage);
            router.get('/logout', this.logout);
        },
        
        productPage: function(req, res){
            const name = req.params.name;
            async.parallel([

                function(callback){
                    Users.findOne({'username': req.user.username})
                    .exec((err, result) => {
                        callback(err, result);
                    })
                },
                
                function(callback){
                    Review.find({})
                        .populate('sender')
                        .exec((err, result) => {
                            callback(err, result);
                        });   
                },
                function(callback){
                    Issue.find({})
                        .sort({"createdAt":1})
                        .exec((err, result) => {
                            callback(err, result);
                        });
                }

            ], (err, results) => {
                const result1 = results[0];
                const result3 = results[1];
                const result4 = results[2];
                res.render('productchat/product', {title: 'Sonic - Review', user:req.user, productName: name, data: result1, productReview: result3, productIssue: result4});
            });
        },
        
        productPostPage: function(req, res){
            async.parallel([

                function(callback){
                    if(req.body.message){
                        const review = new Review();
                        review.sender = req.user._id;
                        review.message = req.body.message;
                        review.name = req.body.productName;
                        review.createdAt = new Date();
                        review.save((err, msg) => {
                            callback(err, msg);
                        })
                    }
                },

                function(callback){
                    if(req.body.issue){
                        const issue = new Issue();
                        issue.victim = req.user._id;
                        issue.victimName=req.user.username;
                        issue.issue = req.body.issue;
                        issue.product = req.body.productName;
                        issue.victimImage = req.user.userImage;
                        issue.createdAt = new Date();
                        issue.save((err, msg) => {
                            callback(err, msg);
                        })
                    }
                }
                
            ], (err, results) => {
                res.redirect('/product/'+req.params.name);
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