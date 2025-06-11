require("dotenv").config()
const express = require("express")
const app = express()
const aiRoutes = require('./routes/ai.routes')
const authRoutes = require('./routes/auth.routes')
const githubRoute = require("./routes/github.routes")
const cors = require('cors')
const ConnectDB = require("./lib/db")

app.use(cors())
app.use(express.json())
app.use("/auth", authRoutes)
app.use("/ai", aiRoutes)
app.use("/github",githubRoute)

const path = require("path");
console.log(path.join(__dirname,"/dist"))
app.use(express.static(path.join(__dirname,"/dist")))

app.get(/.*/,(req,res)=>{
  res.sendFile(path.join(__dirname,"/dist/index.html"))
})

// Start server
const PORT = process.env.PORT || 10000;

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Backend Started");
      // ConnectDB()
    });
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;
