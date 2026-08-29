import express from "express";
import cors from "cors";
import helmet from "helmet";


const app = express();

app.use(helmet());

app.use(cors({
    origin: 'https://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "family-os-api"
    })
})

export default app;