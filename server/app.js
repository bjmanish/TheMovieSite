const express = require ("express");
const axios = require("axios");
const cors  = require("cors");
const searchRoutes = require('./routes/search');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/search', searchRoutes); // <-- important!

app.get("/api/search", async(req, res) =>{
    const {query} = req.query;
    try{
        const response = await axios.get(`https://archive.org/advancedsearch.php?q=${query}+AND+mediatype:movies$output=json`);
        res.json(response.data.response.docs);
    }catch(error){
        res.status(500).send("Error fetching data!");
    }    
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));