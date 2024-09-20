import 'dotenv/config';
// import dotenv from 'dotenv';
import connectMongooseDB from './db/mongoose.connect.js';
import { app } from './app.js';
// dotenv.config({
//   path: '../env',
// });

const PORT = process.env.PORT;

connectMongooseDB()
  .then(() => {
    app.listen(3000, () => {
      console.log(`server is runngin at port : ${PORT}`);
    });
  })
  .catch(err => {
    console.log(`mongoDB connection failed : `, err);
  });

app.get('/', (req, res) => {
  res.send('Hello MF');
});
