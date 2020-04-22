const path = require('path');
const fs= require('fs');
module.exports = function(async, Users,  formidable){
    return {
        SetRouting: function(router){
            router.get('/settings/profile', this.getProfilePage);
            router.post('/userupload', this.userUpload);
            router.post('/settings/profile', this.postProfilePage);
            router.get('/profile/:name', this.overviewPage);
            router.post('/profile/:name', this.overviewPostPage);
        },

        getProfilePage: function(req, res){
            async.parallel([

                function(callback){
                    Users.findOne({'username': req.user.username})
                        .exec((err, result) => {
                            callback(err, result);
                        })
                },
                
            ], (err, results) => {
                const result1 = results[0];
                res.render('user/profile', {title: 'Sonic - Profile', user:req.user, data: result1});
                });
        },

        postProfilePage: function(req, res){

            async.waterfall([

                function(callback){
                    Users.findOne({'_id':req.user._id}, (err, result) => {
                        callback(err, result);
                    })
                },

                function(result, callback){
                    if(req.body.upload === null || req.body.upload === ''){
                        Users.update({
                            '_id':req.user._id
                            },
                            {
                            username: req.body.username,
                            fullname: req.body.fullname,
                            bio: req.body.bio,
                            gender: req.body.gender,
                            userImage: result.userImage,
                            section: req.body.section
                            },
                            {
                            upsert: true
                            }, 
                            (err, result) => {
                                res.redirect('/settings/profile');
                            })
                    }
                    else if(req.body.upload !== null || req.body.upload !== ''){
                        Users.update({
                            '_id':req.user._id
                            },
                            {
                            username: req.body.username,
                            fullname: req.body.fullname,
                            bio: req.body.bio,
                            gender: req.body.gender,
                            userImage: req.body.upload,
                            section: req.body.section
                            },
                            {
                            upsert: true
                            }, 
                            (err, result) => {
                                res.redirect('/settings/profile');
                            })
                        }
                }
            ]);
        },

        userUpload: function(req, res) {
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname, '../public/uploads');
            form.on('file', (field, file) => {
                fs.rename(file.path, path.join(form.uploadDir, file.name), (err)=>{
                    if(err) throw err;
                });
            });
            form.on('error', (err) => {});
            form.on('end', () => {});
            form.parse(req);
        },

        overviewPage: function(req, res){
            
            async.parallel([

                function(callback){
                    Users.findOne({'username': req.params.name})
                        .exec((err, result) => {
                            callback(err, result);
                        })
                },
                
                
            ], (err, results) => {
                const result1 = results[0];
                res.render('user/overview', {title: 'Sonic - Overview', user:req.user, data: result1});
            });
        },
        
        overviewPostPage: function(req, res) {
        }
    }
}