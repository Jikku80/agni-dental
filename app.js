const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('config');
const PatientSubRecordRouter = require('./Router/PatientSubRecordRouter');
const PatientRecordRouter = require('./Router/PatientRecordRouter');
const PatientRouter = require('./Router/PatientRouter');
const BlogRouter = require('./Router/BlogRouter');
const AppointmentRouter = require('./Router/AppointmentRouter');
const UserRouter = require('./Router/UserRouter');
require('./dbConnection');

app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http, { cors: { origin: 'https://agni.azurewebsites.net' } });

const corsOptions = {
    origin: 'https://agni.azurewebsites.net',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/patient/sub/record', cors(corsOptions), PatientSubRecordRouter);
app.use('/api/patient/record', cors(corsOptions), PatientRecordRouter);
app.use('/api/patient', cors(corsOptions), PatientRouter);
app.use('/api/blog', cors(corsOptions), BlogRouter);
app.use('/api/appointment', cors(corsOptions), AppointmentRouter);
app.use('/api/user', cors(corsOptions), UserRouter);

const root = path.resolve(__dirname, 'client/dist');
  app.use(express.static(root));
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root });
})

const server = http.listen(process.env.PORT||config.get("PORT"), (err) => {
    if (err) console.log(err.message)
    console.log('Server has started running...')
})

io.on('connection', (socket) => { 
    console.log('new client connected');
    socket.on("chat message", (message) => {
        io.emit('chat message', message)
    });
});

module.exports = server;