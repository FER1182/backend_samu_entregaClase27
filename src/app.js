import express from "express";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
 
//Rutas 
import viewsRouter from "./routes/views.router.js"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import MessageModel from "./models/message.model.js";
import usersRouter from "./routes/user.router.js";
import sessionsRouter from "./routes/sessions.router.js"
import "./database.js"



const app = express();
const PUERTO = 8080;


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();   


 app.use(session({
     secret : "secretCoder",
     resave : true ,
     saveUninitialized : true,
     store : MongoStore.create({
         mongoUrl : "mongodb+srv://fernandorudnevichinedita:231182@cluster0.xe7glky.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Cluster0" , ttl :100
     })
 }))

//configuracion handlebars
app.engine("handlebars",exphbs.engine());
app.set("view engine","handlebars");
app.set("views", "./src/views");

app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter)
app.use("/api/users",usersRouter)
app.use("/api/sessions",sessionsRouter)

app.use("/",viewsRouter);

const httpServer = app.listen(PUERTO,()=>{
    console.log(`escuchando en el puerto ${PUERTO}`);
})


const io = new Server(httpServer);


io.on("connection", (socket)=>{
    console.log("nuevo usuario conectado")
    
    socket.on("message",async data=>{
        await MessageModel.create(data)
    
     //obtengo los mensajes de mongo y los paso
     const messages = await MessageModel.find();
      
     io.sockets.emit("messagesLogs",messages)

    })

    
})