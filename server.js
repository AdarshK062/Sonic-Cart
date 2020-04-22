const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const container = require('./container');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const socketIO = require('socket.io');
const {Users} = require('./helpers/UsersClass');
const {Global} = require('./helpers/Global');
const compression = require('compression');
const helmet = require('helmet');

container.resolve(function(users, _, admin, home, product, cart, like, results, profile, issues,info){
    mongoose.Promise = global.Promise;
    //mongoose.connect('mongodb://localhost/wb');
    mongoose.connect("mongodb+srv://test:adarsh123abc@whiteboard-btzns.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
    const app= SetupExpress();

    function SetupExpress(){
        const app = express();
        const server = http.createServer(app);
        const io = socketIO(server);
        server.listen(process.env.PORT || 7090, function(){
             //console.log('Listening on port 7090');
        });
        ConfigureExpress(app);

        require('./socket/groupchat')(io, Users);
        require('./socket/issues')(io);
        
        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        cart.SetRouting(router);
        like.SetRouting(router);
        home.SetRouting(router);
        product.SetRouting(router);
        results.SetRouting(router);
        profile.SetRouting(router);
        issues.SetRouting(router);
        info.SetRouting(router);
        app.use(router);
        app.use(function(req, res){
            res.render('404');
        });
    }
    
    function ConfigureExpress(app){
        app.use(compression());
        app.use(helmet());
        require('./passport/passport-local');
        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine','ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(validator());
        app.use(session({
            secret:'thisissecret',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.locals._ =_;
    }
});