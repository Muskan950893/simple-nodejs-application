const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello Muskan i have done my task");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
