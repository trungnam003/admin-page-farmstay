const express = require('express');
const {sequelize} = require('./models');
const morgan = require('morgan');
require('dotenv').config();
const {engine} = require('express-handlebars');
const cookieParser = require('cookie-parser');
const path = require('path');
const methodOverride = require('method-override');
const { createServer } = require('http');
const passport = require('passport')
const flash = require('connect-flash');
const session = require('express-session');
const Redis = require("ioredis")
const RedisStore = require("connect-redis")(session)

const redisClient = new Redis()
const app = express();
const PORT = process.env.PORT || 3000;

const ErrorMiddlewares = require('./middlewares/errors')
const router = require('./routers')
const {HttpError, HttpError404} = require('./utils/errors')
require('./config/passport.config')(passport);

const main = async()=>{
    // Use middleware library
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended: true,}));
    app.use(express.json());
    app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
    app.use(methodOverride('_method'));
    app.use(express.static(path.join(__dirname, 'public')));
    
    app.use(
        session({
            store: new RedisStore({ client: redisClient }),
            secret: 'secret',
            resave: false,
            saveUninitialized: true,
            cookie: {maxAge: 15000, secure: false}
        })
    );


    app.use(flash())
    // app.use(passport.initialize());
    // app.use(passport.session());
    // Setup handlebars
    app.engine(
    '.hbs',
    engine({
        extname: '.hbs',
        encoding: 'utf-8',
        partialsDir: {
            dir: path.join(__dirname, 'resources', 'views', 'partials'),
        },
        layoutsDir: path.join(__dirname, 'resources', 'views', 'layouts'),
    }),
    ); // cấu hình handlebars
    app.set('view engine', '.hbs');
    app.set('views', path.join(__dirname, 'resources', 'views'));

    
    // use router
    app.use(router);

    app.all('*', function(req, res, next){
        next(new HttpError404())
    });

    // use list error handle
    app.use(ErrorMiddlewares)

    try {
        await sequelize.authenticate();
        console.log("Connect MySql OK ^^");
        require('./utils/createSuperAdmin')
    } catch (error) {
        console.log("Connect MySql FAIL :(");
    }

    const httpServer = createServer(app)

    await new Promise(resolve =>httpServer.listen(PORT, '0.0.0.0', undefined, ()=>{
        console.log(`App listening on http://localhost:${PORT}`);
    }))
    
}

main().catch(error => console.log('ERROR STARTING SERVER: ', error))