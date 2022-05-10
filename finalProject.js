let http = require("http");
let path = require("path");
let express = require("express");
let bodyParser = require("body-parser");

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

process.stdin.setEncoding("utf8");

let app = express();

console.log(`Web server is running at http://localhost:5000`);

require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') })

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;

/* Our database and collection */
const databaseAndCollection = { db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION };
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${userName}:${password}@cluster0.ksiny.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");


process.stdout.write(`Stop to shutdown the server: `)
process.stdin.on("readable", function () {
    let start = process.stdin.read();
    start = start.trim();
    if (start === "stop") {
        process.stdout.write(`Shutting down the server`);
        process.exit(0);
    } else {
        process.stdout.write("Invalid command: " + start + "\n");
        process.stdout.write(`Stop to shutdown the server: `)
        process.stdin.resume();
    }
});

app.get("/", (request, response) => {
    response.render("index");
});

app.post("/", (request, response) => {
    async function main() {
        try {
            await client.connect();

            //let info = { name: request.body.name, number: request.body.activity };
            //await insert(client, databaseAndCollection, info);
            await getActivity();
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    async function insert(client, databaseAndCollection, info) {
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(info);
    }

    async function getActivity() {

        let a = '';

        for (let i = 0; i < request.body.activity; i++) {
            const response = await fetch('https://www.boredapi.com/api/activity');
            const json = await response.json();
            const { activity, type } = json;
            a += `<p>${activity}</p>`;
        }

        let student = { name: request.body.name, activities: a };

        let info = { name: request.body.name, number: request.body.activity, activities: a };
        await insert(client, databaseAndCollection, info);

        response.render("activities", student);
    }

    main().catch(console.error);
})

app.post("/find", (request, response) => {

    let r;

    async function main() {
        try {
            await client.connect();
            await lookUp(client, databaseAndCollection, request.body.name);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    async function lookUp(client, databaseAndCollection, n) {
        let filter = { name: n };
        const result = await client.db(databaseAndCollection.db)
            .collection(databaseAndCollection.collection)
            .findOne(filter);
        r = result;
        if (result) {
            let v = {
                name: r.name,
                activities: r.activities
            }; // variable for template
            response.render("activities", v); // render variables in template
        } else {
            let v = {
                name: n,
                activities: 'NONE',
            }; // variable for template
            response.render("activities", v); // render variables in template
        }
    }

    main().catch(console.error);
});

http.createServer(app).listen(5000);

