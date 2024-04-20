const express = require('express');
const path = require('path');
const app = express();
const { spawn } = require('child_process');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const client = new MongoClient("mongodb+srv://testuser:testuser123@cluster0.irugazx.mongodb.net/");

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
    }
}
connectDB();

app.use(express.json());

// Serve static files from the directory where `index.html` is located
app.use(express.static(path.join(__dirname)));

// Route to ensure your site defaults to `index.html`
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});



app.get('/weather', (req, res) => {
    const pythonProcess = spawn('python', ['locationAndWeather.py']);

    let outputData = '';
    pythonProcess.stdout.on('data', (data) => {
        const dataString = data.toString();
        console.log(`stdout: ${dataString}`); // Log each chunk of data received from stdout
        outputData += dataString;
    });

    pythonProcess.stderr.on('data', (data) => {
        const errorString = data.toString();
        console.error(`stderr: ${errorString}`); // Log any errors received from stderr
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.log(`Python script exited with code ${code}`); // Log the exit code
            res.status(500).send('Failed to retrieve data');
        } else {
            console.log('Sending data to client');
            console.log(`Complete output data: ${outputData}`); // Log the complete output data before sending it
            res.send(outputData);
        }
    });
});

// Set up other routes for API or form submissions if needed
// Login endpoint
app.post('/login', async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        return res.status(400).json({ loginSuccess: false, message: 'Both ID and password are required' });
    }

    const db = client.db("Cluster0");
    const users = db.collection("ACL");

    try {
        const user = await users.findOne({ id: id });
        if (!user) {
            return res.status(404).json({ loginSuccess: false, message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.json({ loginSuccess: true, message: 'Logged in successfully', userId: id });
        } else {
            res.status(401).json({ loginSuccess: false, message: 'Incorrect password' });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ loginSuccess: false, message: 'Server error' });
    }
});


// Registration endpoint
app.post('/register', async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        return res.status(400).json({ registerSuccess: false, message: 'Both ID and password are required' });
    }

    const db = client.db("Cluster0"); // Make sure this matches your MongoDB database
    const users = db.collection("ACL"); // Make sure this matches your MongoDB collection

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

// Fetching favorite trains
app.get('/favorites/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const favorites = await db.collection("trains").find({ id: userId }).toArray();
        res.json(favorites.map(fav => fav.Train));
    } catch (error) {
        console.error("Error retrieving favorites:", error);
        res.status(500).json({ error: "Failed to retrieve favorites" });
    }
});

// Adding a favorite train
app.post('/favorites/add', async (req, res) => {
    const { id, Train } = req.body;
    try {
        await db.collection("trains").insertOne({ id, Train });
        res.json({ success: true });
    } catch (error) {
        console.error("Error adding favorite train:", error);
        res.status(500).json({ success: false, message: 'Failed to add favorite train' });
    }
});

// Removing a favorite train
app.post('/favorites/remove', async (req, res) => {
    const { id, Train } = req.body;
    try {
        const result = await db.collection("trains").deleteOne({ id, Train });
        res.json({ success: result.deletedCount > 0 });
    } catch (error) {
        console.error("Error removing favorite train:", error);
        res.status(500).json({ success: false, message: 'Failed to remove favorite train' });
    }
});



// Set the port for the application
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
