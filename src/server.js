import Express from 'express';

const app = Express();
app.use(Express.json());

let EVENTS=[];

app.post("/post", (req, res) => {   
    const event = req.body;
    const secret=req.query.secret;
    EVENTS.push({
        event: event,
        timestamp: new Date(),
        secret: secret
    });
    res.json({status: "ok"});
});

app.get("/get", (req, res) => {
    const secret=req.query.secret;
    EVENTS=EVENTS.filter((event) => {
        return new Date() - event.timestamp < 1000*60*60;
    });
    res.json(EVENTS.filter((event) => {
        return event.secret === secret;
    }).map((event) => event.event));
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
