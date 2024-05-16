

const PROXY_ADDRESS= process.env.WEBHOOK_PROXY||"https://pool.openagents.com:3000";
const PROXY_SECRET = process.env.WEBHOOK_PROXY_SECRET || "";
const WEBHOOK_ADDRESS = process.env.WEBHOOK || "http://localhost:8000/webhook/nostr";

let LAST_EVENT=0;

async function loop(){
    try{
        const eventsToPost = [];
        const response = await fetch(`${PROXY_ADDRESS}/get?secret=${PROXY_SECRET}`);
        const events = await response.json();
        for(const event of events){
            if(event.timestamp > LAST_EVENT){
                eventsToPost.push(event.event);
                LAST_EVENT=event.timestamp;
            }
        };
        await Promise.allSettled(eventsToPost.map(async (event) => {
            console.log("Propagating event", JSON.stringify(event, null, 2));
            return fetch(WEBHOOK_ADDRESS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(event)
            });
        }));
    }catch(e){
        console.error(e);
    }
    setTimeout(loop, 1000);
}
loop();