const env = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const client = require('./configs/db.js')
const authRoute = require('./routes/auth');
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());


//connecting to database
client.connect(err => {
    if (err) {
        console.log('Error connecting to database\n');
        console.log(err);
    } else { console.log('Connected to database'); }
})

app.get('/', (req, res) => {
    res.status(200).json({
        message: `Server up and running at ${port}`,
    });
})
app.use('/auth', authRoute);


app.listen(port, () => {
    console.log(`Server up and running at ${port}`);
});