const express = require("express");
const fs = require("fs");
const RateLimit = require("express-rate-limit");
const app = express();
const port = 3000;

const submitLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 submit requests per windowMs
});

const dataLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 data requests per windowMs
});

//when you submit html form it will be url encoded.
//this tell express to read form data, parse it and put it in req.body
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
    <form method="POST" action="/submit">
      <input type="text" name="username" placeholder="Enter name" required />
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post("/submit", submitLimiter, (req, res) => {
  const username = req.body.username;
  fs.appendFile("data.txt", username + "\n", () => {
    res.send("username saved");
  });
});

//utf8 tell node to read this as normal text otherwise it will return buffer (raw binary data)<Buffer 4a 6f 68 6e 0a>
app.get('/data', dataLimiter, (req, res) => {
    fs.readFile("data.txt","utf8",(err,data)=>{
        res.send(data)
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
