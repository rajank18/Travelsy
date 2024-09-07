const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const session = require('express-session');

const app = express();


const uri = "mongodb://localhost:27017/login";
const client = new MongoClient(uri);
const collectionName = "users";

async function connectToDb() {
    try {
        await client.connect();
        console.log("Connected to MongoDB database");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

connectToDb();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, "public")));


app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Routes
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async(req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if username already exists
        const existingUser = await client.db().collection(collectionName).findOne({ name });
        if (existingUser) {
            return res.status(400).send("Username already exists.");
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const data = { name, email, password: hashedPassword };


        await client.db().collection(collectionName).insertOne(data);

        res.send("User created successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating user.");
    }
});

app.post("/login", async(req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by username
        const user = await client.db().collection(collectionName).findOne({ email });

        if (!user) {
            return res.status(401).send("Invalid email or password.");
        }

        // Compare hashed passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send("Invalid email or password.");
        }

        // Set session variable to mark user as authenticated
        req.session.isAuthenticated = true;
        req.session.userId = user._id; // Store user ID for later use

        res.redirect("/asd");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in.");
    }
});

app.get("/asd", (req, res) => {
    if (req.session.isAuthenticated) {
        res.render("asd", { message: "Welcome!" }); // Simple welcome message
    } else {
        res.redirect("/login");
    }
});

const port = process.env.PORT || 5001; // Use environment variable for port
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});