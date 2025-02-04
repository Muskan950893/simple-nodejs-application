const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, Jenkins CI/CD with Docker!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

root@ip-172-31-95-180:~# cat package.json
{
  "name": "node-app",
  "version": "1.0.0",
  "description": "A sample Node.js app for Jenkins CI/CD",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  }
}
