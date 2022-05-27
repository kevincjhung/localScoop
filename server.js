const { app, sessionMiddleware } = require("./app")
const http = require('http');

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


const mysqlDB = require('./database/databaseAccessLayer')
const makeSocketChat = require('./socketChat')
makeSocketChat(io)

// app.set('socketio', io)

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)


io.use(wrap(sessionMiddleware))

io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.authenticated) {
        next();
    } else {
        next(new Error("unauthorized"));
    }
});

const PORT = process.env.PORT || 8000; // let express set PORT, else make it 8000

server.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))


