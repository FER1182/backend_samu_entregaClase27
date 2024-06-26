import express from "express";
const router = express.Router();

import ProductManager from "../controller/products-manager.js";
const manager = new ProductManager("./src/models/productos.json");



router.get("/", (req, res) => {
  if (req.session.login) {
    return res.redirect("/api/products");
  }
  res.redirect("/login");
});
router.get("/chat", (req, res) => {
  res.render("chat", { titulo: "CHAT" });
});
router.get("/contacto", (req, res) => {
  res.render("contacto");
});

router.get("/login", (req, res) => {
  if (req.session.login) {
    return res.redirect("/api/products");
  }
  res.render("login");
});

router.get("/register", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("register");
});

router.get("/profile", (req, res) => {
  if (!req.session.login) {
    return res.redirect("/login");
  }

  res.render("profile");
});

export default router;
