import express from "express";
const router = express.Router();
import CartManager from "../controller/carts-manager.js";
const manager = new CartManager();
import UsuarioModel from "../models/usuario.model.js";
import { createHash } from "../utils/hashbcrypt.js";
import jwt from "jsonwebtoken";
import passport from "passport";

//ruta Post para generar un usuario y almacenarlo en mongodb

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;
  console.log("estoy aca");
  try {
    //verificar si el correo esta registrado
    const existeUsuario = await UsuarioModel.findOne({ email: email });
    if (existeUsuario) {
      return res.status(400).send("el correo ya esta registrado");
    }


    //definimos el rol del usuario
    const creaCarrito = await manager.addCart();
    
    const role = email === "admincoder@coder.com" ? "admin" : "usuario";
    //creacion de nuevo usuario
    const nuevoUsuario = await UsuarioModel.create({
      first_name,
      last_name,
      email,
      password: createHash(password),
      age,
      carts:creaCarrito._id,
      role,
    });

    const token = jwt.sign(
      {
        usuario: nuevoUsuario.email,
        first_name: nuevoUsuario.first_name,
        last_name: nuevoUsuario.last_name,
        role: nuevoUsuario.role,
      },
      "coderhouse",
      { expiresIn: "1h" }
    );

    res.cookie("coderCookieToken", token, {
      maxAge: 3600000,
      httpOnly: true,
    });

    //*********CON SESSIONS *******/
    //*****************************/
    //una vez creado el usuario , creo la sesion
    //  req.session.user = {
    //      email : nuevoUsuario.email,
    //      first_name : nuevoUsuario.first_name,
    //      last_name: nuevoUsuario.last_name
    //  };
    //  req.session.login = true;

    res.redirect("/api/products");
  } catch (error) {
    res.status(500).send("error al crear un usuario");
  }
});

router.get("/admin",passport.authenticate("jwt", { session: false }),async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).send("Acceso Denegado");
    }
    res.render("admin");
  }
);  

export default router;
