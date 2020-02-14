import express from 'express';
import dotenv from 'dotenv';
import 'babel-polyfill';
import ProfileJS from './src/usingJSObject/controllers/Profile';
import ProfileDB from './src/usingDB/controllers/Profile';
import Offer from './src/usingDB/controllers/Offer';
import Auth from './src/usingDB/middleware/Auth';

dotenv.config();
const Profile = process.env.TYPE === 'db'? ProfileDB : ProfileJS;
const app = express();

const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');

app.use(bodyParser.json());

app.use(cookieSession({
  name: process.env.NAME,
  keys: [process.env.SECRET],
  maxAge: process.env.AGE //3 days
}));

/** MIDDLEWARE */
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send({'message': 'Server connected.'});
});

/** Enable CORS for client-side (cvtech-client) */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ORIGIN);
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

/** Profile's ENDPOINTS */
app.post('/api/signin', Profile.signIn);
app.post('/api/signup', Profile.signUp);
app.post('/api/logout', Profile.logOut);
app.get('/api/profiles', Profile.getAll);  /* Only HRs can do that */
app.get('/api/profiles/:id', Auth.verifyToken, Profile.getOne);
app.put('/api/profiles/:id', Auth.verifyToken, Profile.update);
app.delete('/api/profiles/:id', Auth.verifyToken, Profile.delete);

/** Offer's ENDPOINTS */
app.post('/api/offers', /** Auth.verifyToken, */ Offer.create);
app.get('/api/offers', Offer.getAll);
app.get('/api/offers/:id', Offer.getOne);
app.put('/api/offers/:id', Auth.verifyToken, Offer.update);
app.delete('/api/offers/:id', Auth.verifyToken, Offer.delete);


/** STARTING THE SERVER... */
app.listen(process.env.PORT);
console.log('CV-Tech API running on port:', process.env.PORT);
