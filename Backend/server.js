import app from "./src/app.js";
import { initsocket } from "./src/sockets/server.socket.js"
import http from "http"


const httpserver = http.createServer(app)

initsocket(httpserver)

 




httpserver.listen(8000 , () => {
    console.log("server is running on the port of 8000")
})