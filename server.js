import mongoose from "mongoose";
import app from "./app.js";
import "dotenv/config";

const port = process.env.PORT;

const mongoDbUrl = process.env.MONGODB_URL;

mongoose.connect(mongoDbUrl)
    .then(connection => {
        app.listen(port);
        console.log(`Server running at Port: ${port}`);
    })
    .catch(err => {
        console.log(err);
    })
