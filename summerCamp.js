let http = require("http");
let path = require("path");
let express = require("express");
let bodyParser = require("body-parser");
let fetch = require("node-fetch");

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

// app.get("/apply", (request, response)=> {
//     response.render("application");
// });

// app.post("/apply", (request, response) => {
//     async function main() {
//         const uri = `mongodb+srv://${userName}:${password}@cluster0.ksiny.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//         const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    
//         try {
//             await client.connect();
           
//             let student = {name: request.body.name, email: request.body.email, 
//                 gpa: request.body.gpa, backgroundInformation: request.body.backgroundInformation};
//             await insertMovie(client, databaseAndCollection, student);
    
//         } catch (e) {
//             console.error(e);
//         } finally {
//             await client.close();
//         }
//     }
    
//     async function insertMovie(client, databaseAndCollection, newStudent) {
//         await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(newStudent);
//     }

//     main().catch(console.error);

//     let variables = { name: request.body.name, email: request.body.email, 
//         gpa: request.body.gpa, backgroundInformation: request.body.backgroundInformation
//     };
//     response.render("appConfirmation", variables);
// });

// app.get("/reviewApplication", (request, response)=> {
//     response.render("review");
// });

// app.post("/reviewApplication", (request, response) => {
//     async function main() {
//         const uri = `mongodb+srv://${userName}:${password}@cluster0.ksiny.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//         const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    
//         try {
//             await client.connect();
//                 let studentName = request.body.email.trim();
//                 await lookUpOneEntry(client, databaseAndCollection, studentName);

//         } catch (e) {
//             console.error(e);
//         } finally {
//             await client.close();
//         }
//     }
    
//     async function lookUpOneEntry(client, databaseAndCollection, studentName) {
//         let filter = {email: studentName};
//         const result = await client.db(databaseAndCollection.db)
//                             .collection(databaseAndCollection.collection)
//                             .findOne(filter);
//         if (result) {
//             let variables = { name: result.name, email: result.email, 
//                 gpa: result.gpa, backgroundInformation: result.backgroundInformation
//             };
//             response.render("appConfirmation", variables);
//         } else {
//             let variables = { name: "NOT FOUND", email: "NOT FOUND", 
//                 gpa: "NOT FOUND", backgroundInformation: "NOT FOUND"
//             };
//             response.render("appConfirmation", variables);
//         }
//     }

//     main().catch(console.error);

// });

// app.get("/adminGPA", (request, response)=> {
//     response.render("gpa");
// });

// app.post("/adminGPA", (request, response) => {
//     async function main() {
//         const uri = `mongodb+srv://${userName}:${password}@cluster0.ksiny.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//         const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    
//         try {
//             await client.connect();
//                 let studentName = request.body.gpa.trim();
//                 await lookUpOneEntry(client, databaseAndCollection, studentName);

//         } catch (e) {
//             console.error(e);
//         } finally {
//             await client.close();
//         }
//     }
    
//     async function lookUpOneEntry(client, databaseAndCollection, studentName) {
//         let filter = {gpa: { $gte: studentName}};
//         const cursor = client.db(databaseAndCollection.db)
//             .collection(databaseAndCollection.collection)
//             .find(filter);
//         const result = await cursor.toArray();

//         if (result) {
//             let table = "<table border='1'><tr><th>Name</th><th>GPA</th></tr>";
//             result.forEach(function(x) {
//                 table += `<tr><td>${x.name}</td><td>${x.gpa}</td></tr>`;
//             });
//             table += "</table>";
//             let variables = { gpaTable: table};
//             response.render("result", variables);
//         } else {
//             let table = "<h1>NOT FOUND</h1>";
//             let variables = { gpaTable: table};
//             response.render("result", variables);
//         }
//     }

//     main().catch(console.error);

// });

// app.get("/processAdminRemove", (request, response)=> {
//     let variable = {remove: `<form action="/processAdminRemove" method="post" onsubmit=validate(this)>
//     <input type="submit" value="Remove All Applicants"/></form><hr>`}
//     response.render("remove", variable);
// });

// app.post("/processAdminRemove", (request, response) => {
 
//     async function main() {
//         const uri = `mongodb+srv://${userName}:${password}@cluster0.ksiny.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//         const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    
//         try {
//             await client.connect();
//             const result = await client.db(databaseAndCollection.db)
//             .collection(databaseAndCollection.collection)
//             .deleteMany({});
//             let variable = {remove: `<div>All applications have been removed from the database. Number of applications removed: ${result.deletedCount}</div><hr>`};
//             response.render("remove", variable);
//         } catch (e) {
//             console.error(e);
//         } finally {
//             await client.close();
//         }
//     }

//     main().catch(console.error);
// });

http.createServer(app).listen(portNumber);

