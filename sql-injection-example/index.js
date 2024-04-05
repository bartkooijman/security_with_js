const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database(':memory:');

// Create a users table and add some sample data
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("INSERT INTO users (username, password) VALUES ('user1', 'password1')");
  db.run("INSERT INTO users (username, password) VALUES ('user2', 'password2')");
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  console.log(query);
  db.get(query, (error, row) => {
    if (error) throw error;

    if (row) {
      console.log(`user ${username} logged in with password ${password}`)
      res.send('Login successful');
    } else {
      res.send('Invalid username or password');
    }
  });
});

app.post('/login2', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = `SELECT * FROM users WHERE username=? AND password=?`;

  db.get(query, [username, password], (error, row) => {
    if (error) throw error;

    if (row) {
      res.send('Login successful');
    } else {
      res.send('Invalid username or password');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});