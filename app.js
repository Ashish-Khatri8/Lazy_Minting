import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import multer from "multer";

import path from 'path';
const __dirname = path.resolve();

// Importing required routes.
import authRoutes from "./routes/authRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Creating express app.
const app = express();

// Multer configs for taking image uploads.
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().toISOString()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
    
};

// Setting "EJS" as preferred HTML templating engine.
app.set("view engine", "ejs");

// Setting "views" folder as default location for render() functions.
app.set("views", "views");

// Adding req body parser to all requests.
app.use(bodyParser.urlencoded({extended: false}));

// Using multer ro handle image uploads.
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("image"))

// Serving static CSS and JS files from "public" folder.
app.use(express.static(path.join(__dirname, "public")));

// Serving nft images from "images" folder.
app.use("/images", express.static(path.join(__dirname, "images")));

// Using node sessions to keep track of connected metamask users with database entries.
app.use(session({
    secret: "hell no",
    resave: false,
    saveUninitialized: false,
}));


// Setting headers to avoid CORS error.
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Using all the required routes to redirect users on specific actions.
app.use(authRoutes);
app.use(marketRoutes);
app.use(userRoutes);

// Middleware handling Page Not Found error.
app.use((req, res, next) => {
    res.status(404).render('404', {
         pageTitle: 'Page Not Found',
         isAuthenticated: req.session.isAuthenticated,
         address: req.session.userAddress,
         path: "/404"
    });
});

// Middleware handling any other errors.
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).json({
        "status": "failure",
        "message": "Some error occured!",
        "error": error,
    });
});

// Exporting the app for server.js
export default app;
