const express = require("express");

const router = express.Router();
const con = require("../db/dbConnection");
const jwt = require("jsonwebtoken");
// const middleware = require("../middleware/auth");
const bcrypt = require("bcryptjs");

// GET ALL USERS
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM users", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});
// GET ONE USER
router.get("/:id", (req, res) => {
  try {
    con.query(
      `SELECT * FROM users where user_id =${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// POST NEW USER
router.post("/", (req, res) => {
  const {
    user_fullname,
    user_email,
    user_billing_address,
    user_shipping_address,
    user_order_date,
    user_password,
    user_type,
  } = req.body;
  try {
    con.query(
      `insert into users (user_fullname,user_email,user_billing_address,user_shipping_address,user_order_date,user_password,user_type) values ('${user_fullname}','${user_email}', '${user_billing_address}','${user_shipping_address}','${user_order_date}', '${user_password}','${user_type}')`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// PUT - EDIT USER
router.put("/:id", (req, res) => {
  const {
    user_fullname,
    user_email,
    user_billing_address,
    user_shipping_address,
    user_order_date,
    user_password,
    user_type,
  } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user_password, salt);
  try {
    con.query(
      `UPDATE users SET user_fullname="${user_fullname}",user_email="${user_email}",user_billing_address="${user_billing_address}",user_shipping_address="${user_shipping_address}",user_order_date="${user_order_date}",user_password="${user_password}", user_type="${user_type}" WHERE user_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// DELETE USER
router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE from users WHERE user_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// REGISTER ROUTE
// The Route where Encryption starts
router.post("/register", (req, res) => {
  return authController.Register(req, res);
});

// LOGIN
router.post("/login", (req, res) => {
  return authController.Login(req, res);
});
// VERIFY
router.get("/users/verify", (req, res) => {
  return authController.Verify(req, res);
});

module.exports = router;
