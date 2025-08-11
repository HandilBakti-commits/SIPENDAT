const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

// New credentials for RT (1-32)
const rtCredentials = Array.from({ length: 32 }, (_, i) => ({
    username: `ketua_RT${i + 1}`, // Contoh: ketua_RT1, ketua_RT2, dst.
    password: `pass${i + 1}2025` // Tetap: pass12025, pass22025, dst.
}));

// New credentials for Kelurahan
const kelurahanCredentials = { username: 'Handil_Bakti', password: 'mucil123' };

// Store reports
let reports = [];

// RT Login
app.post('/rt-login', (req, res) => {
    const { username, password, rtNumber } = req.body;
    const user = rtCredentials.find(cred => cred.username === username && cred.password === password);
    if (user) {
        res.status(200).json({ message: 'Login berhasil', rtNumber });
    } else {
        res.status(401).send('Login gagal');
    }
});

// Submit Report
app.post('/submit-report', (req, res) => {
    const report = req.body;
    reports.push(report);
    fs.writeFileSync(path.join(__dirname, 'reports', 'reports.json'), JSON.stringify(reports));
    res.status(200).send('Laporan tersimpan');
});

// Kelurahan Login
app.post('/kelurahan-login', (req, res) => {
    const { username, password } = req.body;
    if (username === kelurahanCredentials.username && password === kelurahanCredentials.password) {
        res.status(200).send('Login berhasil');
    } else {
        res.status(401).send('Login gagal');
    }
});

// Get Reports
app.get('/get-reports', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'reports', 'reports.json'));
        reports = JSON.parse(data);
    } catch (e) {
        reports = [];
    }
    res.json(reports);
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});