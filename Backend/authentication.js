const express = require("express");
const { getDB } = require(//database connection file);

const router = express.Router();


router.post("/register", async(req,res) => {
  const db = getDB();
  const users = db.collection("users");

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password){
    return res.status(400).json({message:"Username and password required"});
  }

  const existing = await users.findOne({username: username});
  if (existing) {
    return res.status(400).json({message:"Username already exists"});
  }

  await users.insertOne({
    username: username,
    password: password,
    role: 0
  });

  res.send("Registered);
           });

router.post("/login"), async (req, res) => {
  const db = getDB();
  const users = db.collection("users");

  const username = req.body.username;
  const password = req.body.password;

  const user = await users.findOne({ username: username });

  if (!user || user.password !== password) {
    return res.send("Invalid login");


    res.json({
      success: true,
      userId: user.id,
      role: user.role});
  }):

  module.exports = router;
        

  
