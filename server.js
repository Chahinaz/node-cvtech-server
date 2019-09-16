import express from 'express';
import Profile from './src/usingJSObject/controllers/Profile';

const app = express();

/** MIDDLEWARES */
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send({'message': 'Server connected.'});
});

/** ENDPOINTS */
app.post('/api/profiles', Profile.create);
app.get('/api/profiles', Profile.getAll);
app.get('/api/profiles/:id', Profile.getOne);
app.put('/api/profiles/:id', Profile.update);
app.delete('/api/profiles/:id', Profile.delete);

/** STARTING THE SERVER... */
app.listen(3000);
console.log('app running on port ', 3000);
