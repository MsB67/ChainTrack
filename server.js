const express = require('express');
const path = require('path');
const Blockchain = require('./blockchain');

const app = express();
const port = 3000;

const supplyChain = new Blockchain();

app.use(express.static('public'));
app.use(express.json());

// new stage
app.post('/add-stage', (req, res) => {
    const { stage, location, handler } = req.body;
    const data = { stage, location, handler };
    const newBlock = supplyChain.addBlock(data);
    res.json(newBlock);
});

// Get blockchain data
app.get('/chain', (req, res) => {
    res.json(supplyChain.getChain());
});

app.listen(port, () => {
    console.log(`Supply Chain Tracker running at http://localhost:${port}`);
});

console.log("📦 Current Supply Chain Blockchain:");
console.log(JSON.stringify(supplyChain.getChain(), null, 2));

