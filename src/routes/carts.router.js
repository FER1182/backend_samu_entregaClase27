import express from "express";

const router = express.Router()

import CartManager from "../controller/carts-manager.js";
const manager = new CartManager();

router.get("/:cid", async (req, res) => {

    const id = req.params.cid;

    try {

        const carrito = await manager.getCartById(id);
        if (!carrito) {
            return res.json({
                error: "Carrito no encontrado"
            });
        }
        const carritoFinal = carrito.products.map(carrito=>{
            const {_id, ...rest} = carrito.toObject();
            return rest;
         })
         
         res.render("cart", { 
            carritoFinal : carritoFinal,
            titulo: "supermecado" 
        });

        
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

router.post("/", async (req, res) => {
    
    try {

        const producto = await manager.addCart();
        console.log(producto._id)
        res.send({ message: "carrito agregado" })
    } catch (error) {
        console.error("Error al guardar el producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }


})

//agrega productos al carrito

router.post("/:cid/product/:pid", async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const cantProdAgregado = req.body.quantity;
    try {

        const actualizarCarrito = await manager.updateCartYagrega(idCart, idProduct, cantProdAgregado);
        if (!actualizarCarrito) {
            return res.json({
                error: "Carrito no encontrado"
            });
        }
        res.json(actualizarCarrito.products)
        

    } catch (error) {
        console.error("Error al guardar el producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }


})
//eliminamos un producto del carrito
router.delete("/:cid/product/:pid", async(req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    try {

        const producto = await manager.deleteProductCart(idCart,idProduct);
      
        res.send({message:"producto eliminado con exito del carrito"})
    } catch (error) {
        console.error("Error al eliminar producto del carrito", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
    
    
})

//actualizamos el carrito
router.put("/:cid", async(req, res) => {
    const idCart = req.params.cid;
    const products = req.body
    console.log(products)
    // if (!Array.isArray( products )) {
    //     return res.status(400).json({message: "no se recibio ningun array de productos"});
    //   }
    try {
        const producto = await manager.actualizarCarrito(idCart,{products});
      
        res.send({message:"carrito actualizado con exito"})
    } catch (error) {
        console.error("Error al actualizar el carrito", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
    
    
})

//actualizamos cantidad de un producto del carrito
router.put("/:cid/products/:pid", async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const cantProdAgregado = req.body.quantity;
    try {

        const actualizarCarrito = await manager.updateCart(idCart, idProduct, cantProdAgregado);
        if (!actualizarCarrito) {
            return res.json({
                error: "Carrito no encontrado"
            });
        }
        res.json(actualizarCarrito.products)
        

    } catch (error) {
        console.error("Error al guardar el producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }


})

//vaciamso el carrito el carrito
router.delete("/:cid", async(req, res) => {
    const idCart = req.params.cid;
    const products = []
  
    try {
        const producto = await manager.actualizarCarrito(idCart,{products});
      
        res.send({message:"se vacio el carrito"})
    } catch (error) {
        console.error("Error al actualizar el carrito", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
    
    
})

export default router