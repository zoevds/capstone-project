const express = require("express");
const router = express.Router();
const con = require("../db/dbConnection");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/auth");
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
    user_gender,
  } = req.body;
  try {
    con.query(
      `insert into users (user_fullname,user_email,user_billing_address,user_shipping_address,user_order_date,user_password,user_type,user_gender) values ('${user_fullname}','${user_email}', '${user_billing_address}','${user_shipping_address}','${user_order_date}', '${user_password}','${user_type}','${user_gender}')`,
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
    user_gender,
  } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user_password, salt);
  try {
    con.query(
      `UPDATE users SET user_fullname="${user_fullname}",user_email="${user_email}",user_billing_address="${user_billing_address}",user_shipping_address="${user_shipping_address}",user_order_date="${user_order_date}",user_password="${user_password}", user_type="${user_type}", user_gender="${user_gender}" WHERE user_id="${req.params.id}"`,
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
  try {
    let sql = "INSERT INTO users SET ?";
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

    let user = {
      user_fullname,
      user_email,
      user_billing_address,
      user_shipping_address,
      user_order_date,
      user_password: hash,
      user_type,
    };

    con.query(sql, user, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(
        `User ${(user.user_fullname, user.user_email)} created successfully`
      );
    });
  } catch (error) {
    console.log(error);
  }
});

// LOGIN
router.post("/login", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";

    let user = {
      user_email: req.body.user_email,
    };

    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.send("Email not found please register");
      } else {
        const isMatch = await bcrypt.compare(
          req.body.user_password,
          result[0].user_password
        );
        // console.log(req.body.password, result[0].password);
        // console.log(isMatch);
        if (!isMatch) {
          res.send("Password incorrect");
        } else {
          const payload = {
            user: {
              user_id: result[0].user_id,
              user_email: result[0].user_email,
              user_fullname: result[0].user_fullname,
              user_billing_address: result[0].user_billing_address,
              user_shipping_address: result[0].user_shipping_address,
              user_order_date: result[0].user_order_date,
              user_password: result[0].user_password,
              user_type: result[0].user_type,
            },
          };

          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});
// VERIFY
router.get("/users/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        msg: "Unauthorized Access!",
      });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
});

module.exports = router;
