const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config()

const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');
const userRouter = require('./routes/user');
const htmlRouer = require('./routes/html');

// express.application.prefix = express.Router.prefix = function (path, configure) {
//     const router = express.Router();
//     this.use(path, router);
//     configure(router);
//     return router;
// };

const app = express();
app.use(cors());
app.use(fileUpload({
  createParentPath: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use('/api', function(req, res, next){
  var token = req.headers[process.env.TOKEN_NAME];
  if(!token){
        res.status(401).send({
            result: 'error',
            message: 'No token provided.'
        });
    } else {
        next();
    }
});

// app.get('/', (req, res) => {
//   res.send('Pong')
// })

// app.prefix('/api', function () {
    app.use('/auth', authRouter);
    app.use('/api/drive', apiRouter);
    app.use('/api/user', userRouter);
    app.use('/api/html', htmlRouer);
// } )
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.all('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
