import express from "express";

const router = express.Router()
import ProductManager from "../controller/products-manager.js";
import passport from "passport";
const manager = new ProductManager();

router.get("/",passport.authenticate("jwt", {session :false}), async (req, res) => {
    try {
        let page = req.query.page || 1 ;
        let limit = req.query.limit || 10 ;
        
        const {sort, query }= req.query;
        const productos = await manager.getProducts({
            limit : parseInt(limit),
            page: parseInt(page),
            sort,
            query
        });
        const productoFinal = productos.docs.map(producto=>{
            const {_id, ...rest} = producto.toObject();
            const idCarrito = "66538ca67cb76c114de5def8"
            const todo = {_id,rest,idCarrito}
            
            return todo;
         })
         
         res.render("home", { 
            productoFinal : productoFinal,
            hasPrevPage : productos.hasPrevPage,
            hasNextPage : productos.hasNextPage,
            prevPage : productos.prevPage,
            nextPage : productos.nextPage,
            currentPage : productos.page,
            totalPages : productos.totalPages,
            limit : limit,
            titulo: "supermecado" ,
            user : req.user
        });
       
    } catch (error) {

        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})


router.get("/:pid", async (req, res) => {

    const id = req.params.pid;

    try {

        const producto = await manager.getProductById(id);
        if (!producto) {
            return res.json({
                error: "Producto no encontrado"
            });
        }
        
        res.render("product", { 
            productoFinal : producto,
            idCarrito : "66538ca67cb76c114de5def8",
            titulo: "supermecado" 
        });
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

router.post("/", async(req, res) => {
    const nuevoProducto = req.body;
    try {

        const producto = await manager.addProduct(nuevoProducto);
      
        res.send({message:"producto agregado"})
    } catch (error) {
        console.error("Error al guardar el producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
    
    
})

router.put("/:pid", async(req, res) => {
    const id = req.params.pid;
    const productoActual = req.body;
    try {

        const producto = await manager.updateProduct(id,productoActual);
      
        res.send({message:"producto actualizado con exito"})
    } catch (error) {
        console.error("Error al guardar el producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
    
    
})

router.delete("/:pid", async(req, res) => {
    const id = req.params.pid;
    try {

        const producto = await manager.deletProduct(id);
      
        res.send({message:"producto eliminado con exito"})
    } catch (error) {
        console.error("Error al guardar el producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
    
    
})


export default router