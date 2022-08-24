const express = require("express");

const router = express.Router();
const con = require("../db/dbConnection");

// get all
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM flavours", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});
// Gets one flavour
router.get("/:id", (req, res) => {
  try {
    res.send({ id: req.params.id });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// post flavours
router.post("/", (req, res) => {
  const { flavour_name, flavour_desc } = req.body;
  try {
    con.query(
      `INSERT into flavours (flavour_name,flavour_desc) values ('${flavour_name}', '${flavour_desc}')`,
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
  const { flavour_name, flavour_desc } = req.body;
  try {
    con.query(
      `UPDATE flavours SET flavour_name="${flavour_name}",flavour_desc="${flavour_desc}"WHERE flavour_id=${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// DELETE FLAVOURS
router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE from flavours WHERE flavour_id="${req.params.id}"`,
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
