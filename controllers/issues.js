module.exports = function(Users, async,  Solution, Issue){
    return {
        SetRouting: function(router){
            router.get('/product/issues/:name', this.productIssuePage);
            router.post('/product/issues/:name', this.productIssuePostPage);
        },
        
        productIssuePage: function(req, res){
            const name = req.params.name;
            var resu = name.split("*");
            const product=resu[0].replace(/`7`/g," ");
            const issue=resu[1].replace(/`7`/g," ");
            async.parallel([

                function(callback){
                    Users.findOne({'username': req.user.username})
                        .exec((err, result) => {
                            callback(err, result);
                        })
                },
                
                function(callback){
                    Solution.find({'issue': issue,'product':product})
                        .sort({"createdAt":1})
                        .exec((err, result) => {
                            callback(err, result);
                        })
                },

                function(callback){
                    Issue.findOne({'issue': issue,'product':product})
                        .exec((err, result) => {
                            callback(err,result);
                        })
                },

                function(callback){
                    Issue.find({'product':product, 'issue': {$ne: issue}})
                        .exec((err, result) => {
                            callback(err,result);
                        })
                }

            ], (err, results) => {
                const result1 = results[0];
                const result3 = results[1];
                const result4 = results[2];
                const result5 = results[3];
                res.render('productchat/issues', {title: 'Sonic - Issues',user:req.user, productName:product, data: result1, issue: issue ,issueData:result4, otherIssues:result5, solution: result3,issuename:name});
            });
        },
        
        productIssuePostPage: function(req, res){
            const name = req.params.name;
            var resu = name.split("*");
            const product=resu[0].replace(/`7`/g," ");
            const issue=resu[1].replace(/`7`/g," ");
            async.parallel([

                function(callback){
                    if(req.body.solution){
                        const sol = new Solution();
                        sol.solverId = req.user._id;
                        sol.issue=issue;
                        sol.product=product;
                        sol.solverName = req.user.username;
                        sol.solution = req.body.solution;
                        sol.solverImage = req.user.userImage;
                        sol.createdAt = new Date();
                        sol.save((err, msg) => {
                             callback(err, msg);
                         })
                    }
                }
            ], (err, results) => {
                res.redirect('/product/'+product);
            });
        }
    }
}