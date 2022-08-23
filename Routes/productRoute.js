const express = require("express");
const { route } = require("../DB/dbconnection");
const router = express.Router();
const con = require("../DB/dbconnection");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM products", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});
// Gets one products
router.get("/:id", (req, res) => {
  try {
    res.send({ id: req.params.id });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// get all products
router.post("/", (req, res) => {
  const {
    product_name,
    product_desc,
    product_category,
    product_price,
    product_imgURL,
    product_weight,
    stock,
    flavour,
  } = req.body;
  try {
    con.query(
      `INSERT into products (product_name,product_desc,product_category,product_price,product_imgURL, product_weight,stock,flavour ) values ('${product_name}', '${product_desc}','${product_category}','${product_price}', '${product_imgURL}','${product_weight}','${stock}','${flavour}')`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
// PUT - EDIT PRODUCTS
router.put("/:id", (req, res) => {
  const {
    product_name,
    product_desc,
    product_category,
    product_price,
    product_imgURL,
    product_weight,
    stock,
  } = req.body;
  try {
    con.query(
      `UPDATE products SET product_name="${product_name}",product_desc="${product_desc}",product_category="${product_category}",product_price="${product_price}",product_imgURL="${product_imgURL}",product_weight="${product_weight}" ,stock="${stock}"WHERE product_id=${req.params.id}`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// DELETE PRODUCTS
router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE from products WHERE product_id="${req.params.id}"`,
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
