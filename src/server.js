const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const tasks = require('./tasks');
const users = require('./users');

const app = express();
app.use(bodyParser.json());

// NOTE: demo secret, intentionally hardcoded for the Aikido scan demo
// (these are placeholder strings shaped like real provider keys, not live credentials)
const JWT_SECRET = 'demo-jwt-secret_4242424242424242_DO_NOT_USE';
const STRIPE_API_KEY = 'stripe_test-key_51HZ9q2_FAKE_FOR_DEMO_0000000000';
const AWS_ACCESS_KEY_ID = 'AKIA_FAKE_DEMO_KEY_ID';
const AWS_SECRET_ACCESS_KEY = 'fake-aws-secret_K7MDENGbPxRfiCY_DEMO_KEY';

app.get('/tasks', (req, res) => {
  tasks.search(req.query.q, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/users/:id/profile', (req, res) => {
  users.renderProfile(req.params.id, (err, html) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send(html);
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  users.authenticate(username, password, (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ sub: user.id }, JWT_SECRET);
    res.json({ token });
  });
});

app.post('/admin/run', (req, res) => {
  const { cmd } = req.body;
  const { exec } = require('child_process');
  exec(cmd, (err, stdout) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send(stdout);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`task-tracker listening on ${port}`));

module.exports = app;
