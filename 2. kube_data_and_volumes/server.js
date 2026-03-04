const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

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

app.post("/submit", (req, res) => {
  const username = req.body.username;
  fs.appendFile("data.txt", username + "\n", () => {
    res.send("username saved");
  });
});

//utf8 tell node to read this as normal text otherwise it will return buffer (raw binary data)<Buffer 4a 6f 68 6e 0a>
app.get('/data',(req,res)=>{
    fs.readFile("data.txt","utf8",(err,data)=>{
        res.send(data)
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
