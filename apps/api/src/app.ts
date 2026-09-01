import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(helmet());

app.use(cors({
    origin: 'https://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "family-os-api"
    })
})

app.use("/auth", authRoutes);

export default app;