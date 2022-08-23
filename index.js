const express = require("express");
const cors = require("cors");
const router = express();
router.set("port", process.env.PORT || 8787);
router.use(express.json());
router.use(cors());

const productRoute = require("./Routes/productRoute");
const userRoute = require("./Routes/userRoute");
router.get("/", (req, res) => {
  res.json({ msg: "hello there" });
});

router.get("/", (req, res) => {
  res.sendFile(__dirname + "./" + "index.html");
});
router.use("/products", productRoute);
router.use("/users", userRoute);

router.listen(router.get("port"), () => {
  console.log("server running");
});
// static
router.use(express.static("public"));
