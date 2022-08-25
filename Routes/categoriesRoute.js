const express = require("express");
const router = express.Router();
const con = require("../db/dbConnection");

// get all
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM categories", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});
// Gets one category
router.get("/:id", (req, res) => {
  try {
    res.send({ id: req.params.id });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// post categories
router.post("/", (req, res) => {
  const { category_type, category_desc } = req.body;
  try {
    con.query(
      `INSERT into categories (category_type,category_desc) values ('${category_type}', '${category_desc}')`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
// PUT - EDIT CATEGORIES
router.put("/:id", (req, res) => {
  const { category_type, category_desc } = req.body;
  try {
    con.query(
      `UPDATE categories SET category_type="${category_type}",category_desc="${category_desc}"WHERE category_id=${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// DELETE CATEGORIES
router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE from categories WHERE category_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
