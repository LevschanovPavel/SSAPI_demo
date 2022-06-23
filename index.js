const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error-handler')
const cookieParser = require('cookie-parser')
// const { checkUser } = require('./middleware/auth');

// Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();


//Router files
// const todayMatches = require('./routes/todayMatches');
// const schedule = require('./routes/schedule');
// const fixtures = require('./routes/fixtures');
// const results = require('./routes/results');
// const standings = require('./routes/standings');
// const matchStats = require('./routes/matchStats');
// const matchBets = require('./routes/matchBets');
// const auth = require('./routes/auth');
// const users = require('./routes/users');
// const doc = require('./routes/doc');
const stats = require('./routes/stats');
// const referees = require('./routes/referees');

const app = express();

// view engine
app.use(express.static('public'));
app.set('view engine', 'ejs');

//Body parser
app.use(express.json())
  
//Cookie parser
app.use(cookieParser())


// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan('dev'));
}
  
//Mount routers
// app.get('*', checkUser);
// app.use('/api/v1/todayMatches',todayMatches)
// app.use('/api/v1/schedule',schedule)
// app.use('/api/v1/matchStats', matchStats)
// app.use('/api/v1/matchBets', matchBets)
// app.use('/api/v1/fixtures',fixtures)
// app.use('/api/v1/results',results)
// app.use('/api/v1/standings',standings)
// app.use('/api/v1/referees',referees)
 
 
// app.use('/api/v1/doc',doc)
// app.get('/', (req, res) => res.render('home'));
// app.use('/admin', users);
app.use('/', stats);
 
 
// app.use(auth)
app.use(errorHandler)

const PORT = process.env.PORT || 3001;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
  