import 'dotenv/config';
import express from 'express';
import expressLayout from 'express-ejs-layouts';
import cors from 'cors';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true, // allow cookie to be sent
  }),
);

app.use(
  express.json({
    limit: '16kb',
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(express.static('public'));

app.use(cookieParser());

// Serve static files (CSS)
app.use(express.static('public'));

// view engine setup
app.set(
  'views',
  path.join('D:/downDOCS/Documents/my_programms/web/React/vibeSongs/server', 'views'),
);
app.use(expressLayout);
app.set('layout', './layouts/admin');
app.set('view engine', 'ejs');

// Session middleware to manage user login sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY, // You should change this in production
    resave: false,
    saveUninitialized: false,
  }),
);

//routes
import adminRouter from './routes/admin.routes.js';
import songsRouter from './routes/songs.routes.js';
import userRouter from './routes/user.routes.js';
import videosRouter from './routes/videos.routes.js';
import playlistsRouter from './routes/playlists.routes.js';

//routes decleration
app.use('/sudo', adminRouter);
app.use('/api/v1/songs', songsRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videosRouter);
app.use('/api/v1/playlists', playlistsRouter);

// Handle 404
app.get('*', (req, res) => {
  res.status(404).render('404');
});

export { app };
