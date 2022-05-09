let http = require("http");
let path = require("path");
let express = require("express");
let bodyParser = require("body-parser");
// let fetch = require("node-fetch");

process.stdin.setEncoding("utf8");

let app = express(); 
let portNumber = Number(process.argv.slice(2)[0]);

console.log(`Web server is running at http://localhost:${portNumber}`);

require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') }) 

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;

/* Our database and collection */
const databaseAndCollection = {db: "CMSC335_FP", collection:"activities"};
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(bodyParser.urlencoded({extended:false}));
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");


process.stdout.write(`Stop to shutdown the server:`)
process.stdin.on("readable", function () {
    let start = process.stdin.read();
    start = start.trim();
    if (start === "stop") {
        process.stdout.write(`Shutting down the server`);
        process.exit(0);
    } else {
        process.stdout.write("Invalid command: " + start + "\n");
        process.stdout.write(`Stop to shutdown the server:`)
        process.stdin.resume();
    }
});

app.get("/", (request, response) => {
    response.render("index");
});

app.post("/", (request, response) => {
        async function main() {
        const uri = `mongodb+srv://${userName}:${password}@cluster0.ksiny.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    
        try {
            await client.connect();
           
            let student = {name: request.body.name, number: request.body.activity};
            await insertMovie(client, databaseAndCollection, student);
    
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    
    async function insertMovie(client, databaseAndCollection, newStudent) {
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(newStudent);
    }

    const Api = `https://www.boredapi.com/api/activity`;
    // const button = document.querySelector('.button');
    // const form = document.querySelector('#form');
    // const activityWrapper = document.querySelector('.activity');
    // const typeWrapper = document.querySelector('.type');
  
    const getActivity = async () => {
    //   const isFree = event.target.children.namedItem('free').checked;
    //   console.log(isFree);
    //   let Api = isFree ? `${endpoint}?price=0` : endpoint;

    let a;
  
      for (let i = 0; i < request.body.activity; i++) {
        const response = await fetch(Api);
        const json = await response.json();
        const { activity, type } = json;
        a += `<p>${activity}</p>`;
      }
  
      let student = {name: request.body.name, activities: a};
      response.render("activities", student);
    }

    getActivity();

    main().catch(console.error);
})

http.createServer(app).listen(portNumber);

