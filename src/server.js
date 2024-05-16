import Express from 'express';
import https from 'https';
import fs from 'fs';

const SERVER_CRT = process.env.SERVER_CRT;
const SERVER_KEY = process.env.SERVER_KEY;

const app = Express();
app.use(Express.json());

let EVENTS = [];

app.post("/post", (req, res) => {
    const event = req.body;
    const secret = req.query.secret;
    EVENTS.push({
        event: event,
        timestamp: Date.now(),
        secret: secret
    });
    res.json({ status: "ok" });
});

app.get("/get", (req, res) => {
    const secret = req.query.secret;
    EVENTS = EVENTS.filter((event) => {
        return  Date.now()  - event.timestamp < 1000 * 60 * 60;
    });
    res.json(EVENTS.filter((event) => {
        return event.secret === secret;
    }).map((event) => {
        return {
            event: event.event,
            timestamp: event.timestamp
        }
    }));
});

if (SERVER_CRT && SERVER_KEY) {
    const options = {
        key: fs.readFileSync(SERVER_KEY),
        cert: fs.readFileSync(SERVER_CRT)
    };
    https.createServer(options, app).listen(3000, () => {
        console.log("HTTPS Server is running on port 3000");
    });
} else {
    app.listen(3000, () => {
        console.log("HTTP Server is running on port 3000");
    });
}