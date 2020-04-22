module.exports = function(async, Product, _, Users, Cart, Like ){
    return {
        SetRouting: function(router){
            router.get('/info', this.infoPage);
            router.get('/logout', this.logout);
        },
        
        infoPage: function(req, res){
            res.render('info', {title: 'Sonic - Info', user:req.user});
        },

       logout: function(req, res){
            req.logout();
            req.session.destroy((err) => {
               res.redirect('/');
            });
        }
    }
}