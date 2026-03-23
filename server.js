import express from 'express';

const app = express();
const PORT = 8080;

app.get('/', (req,res) => {
    res.send("Running")
})

app.listen(PORT, () => console.log(`server running in http://localhost:${PORT}`));