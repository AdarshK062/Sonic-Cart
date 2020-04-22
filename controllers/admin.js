const path = require('path');
const fs= require('fs');

module.exports = function(formidable, Product){
    return {
        SetRouting: function(router){
            router.get('/dashboard', this.adminPage);
            router.post('/uploadFile', this.uploadFile);
            router.post('/dashboard', this.adminPostPage);
        },
        
        adminPage: function(req, res){
            res.render('admin/dashboard');
        },
        
        adminPostPage: function(req, res){
            const newProduct = new Product();
            newProduct.name = req.body.product;
            newProduct.category = req.body.category;
            newProduct.image = req.body.upload;
            newProduct.cost=req.body.cost;
            newProduct.save((err) => {
                res.render('/home');
            })
        },
        
        uploadFile: function(req, res) 
        {
            const form = new formidable.IncomingForm();
            form.uploadDir = path.join(__dirname, '../public/uploads');
            form.on('file', (field, file) => {
                fs.rename(file.path, path.join(form.uploadDir, file.name), (err)=>{
                    if(err) throw err;
                     //console.log('File renamed successfully');
                });
            });
            
            form.on('error', (err) => {
                 //console.log(err);
            });
            
            form.on('end', () => {
                 //console.log('File uploaded successful');
            });
            
            form.parse(req);
        }
    }
}