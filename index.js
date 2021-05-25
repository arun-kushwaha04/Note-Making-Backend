const env = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
const client = require('./configs/db.js')
const authRoute = require('./routes/auth');
const notesRoute = require('./routes/notes');
const userRoute = require('./routes/profile');
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     next();
// });

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
app.use('/notes', notesRoute);
app.use('/user', userRoute);


app.listen(port, () => {
    console.log(`Server up and running at ${port}`);
});