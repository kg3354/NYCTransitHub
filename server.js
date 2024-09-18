const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const { spawn } = require('child_process');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const app = express();
const client = new MongoClient(process.env.MONGO_URI);
let db;

// Initialize MongoDB Connection
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db("Cluster0");
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
    }
}
connectDB();

// Session Configuration
app.use(session({
    secret: 'aVerySecuredKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client: client }),
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// User Login
app.post('/login', async (req, res) => {
    const { id, password } = req.body;
    const users = db.collection("ACL");
    try {
        const user = await users.findOne({ id: id });
        if (!user) {
            return res.status(401).json({ loginSuccess: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ loginSuccess: false, message: 'Invalid credentials' });
        }

        req.session.userId = user._id;  // Store user's session
        res.json({ loginSuccess: true, message: 'Logged in successfully' });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ loginSuccess: false, message: 'Server error' });
    }
});

// User Logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Failed to destroy session', err);
            res.json({ logoutSuccess: false, message: 'Logout failed' });
        } else {
            res.clearCookie('connect.sid');
            res.json({ logoutSuccess: true, message: 'Logged out successfully' });
        }
    });
});



app.get('/weather', (req, res) => {
    const pythonProcess = spawn('python', ['locationAndWeather.py']);

    let outputData = '';
    pythonProcess.stdout.on('data', (data) => {
        const dataString = data.toString();
        console.log(`stdout: ${dataString}`); 
        outputData += dataString;
    });

    pythonProcess.stderr.on('data', (data) => {
        const errorString = data.toString();
        console.error(`stderr: ${errorString}`); 
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.log(`Python script exited with code ${code}`); 
            res.status(500).send('Failed to retrieve data');
        } else {
            console.log('Sending data to client');
            console.log(`Complete output data: ${outputData}`);
            res.send(outputData);
        }
    });
});

// Registration endpoint
app.post('/register', async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        return res.status(400).json({ registerSuccess: false, message: 'Both ID and password are required' });
    }

   
    const users = db.collection("ACL"); 

    try {
        const existingUser = await users.findOne({ id: id });
        if (existingUser) {
            return res.status(409).json({ registerSuccess: false, message: 'Username already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await users.insertOne({ id: id, password: hashedPassword });
        res.json({ registerSuccess: true, message: 'Registered successfully' });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ registerSuccess: false, message: 'Server error' });
    }
});


app.get('/get-routes', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    try {
        const routes = await db.collection("Train").find({ username: req.session.userId }).toArray();
        res.json({ success: true, routes: routes });
    } catch (error) {
        console.error("Error retrieving routes:", error);
        res.status(500).json({ success: false, message: 'Failed to retrieve routes' });
    }
});





app.get('/routes', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send("User not authenticated");
    }
    try {
        const routes = await db.collection("routes").find({ userId: req.session.userId }).toArray();
        res.json(routes.map(route => ({ name: route.name })));
    } catch (error) {
        console.error("Error retrieving routes:", error);
        res.status(500).send("Failed to retrieve routes");
    }
});



app.post('/routes', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send("User not authenticated");
    }

    const { routeName } = req.body;
    if (!routeName) {
        return res.status(400).send("Route name is required");
    }

    try {
        const exists = await db.collection("routes").findOne({ userId: req.session.userId, name: routeName });
        if (exists) {
            return res.status(409).send("Route already exists for this user.");
        }

        await db.collection("routes").insertOne({ userId: req.session.userId, name: routeName });
        res.status(201).send("Route added successfully");
    } catch (error) {
        console.error("Error adding route:", error);
        res.status(500).send("Failed to add route");
    }
});




app.delete('/routes', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send("User not authenticated");
    }

    const { routeName } = req.body;
    if (!routeName) {
        return res.status(400).send("Route name is required");
    }

    try {
        const result = await db.collection("routes").deleteOne({ userId: req.session.userId, name: routeName });
        if (result.deletedCount === 0) {
            return res.status(404).send("Route not found or already deleted");
        }
        res.send("Route deleted successfully");
    } catch (error) {
        console.error("Error deleting route:", error);
        res.status(500).send("Failed to delete route");
    }
});

app.post('/getRecommendation', (req, res) => {
    const { line, direction } = req.body;
    const pythonProcess = spawn('python', ['get_recommendation.py', line, direction]);

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.log(`Process exited with code ${code}`);
            res.status(500).send({ message: "Failed to retrieve data" });
        } else {
            res.send(JSON.parse(dataString));
        }
    });
});


// Set the port for the application
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
