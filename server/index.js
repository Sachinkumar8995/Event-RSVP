const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const MONGO_URI = 'mongodb://localhost:27017/eventhub';

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], 
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: 'session_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, 
        httpOnly: true,
    }
}));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/rsvp', require('./routes/rsvpRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
