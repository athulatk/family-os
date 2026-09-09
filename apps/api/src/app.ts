import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes";
import groupRoutes from "./modules/group/group.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(helmet());

app.use(cors({
    origin: 'https://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_, res) => {
    res.json({
        status: "ok",
        service: "family-os-api"
    })
})

app.use("/auth", authRoutes);
app.use("/groups", groupRoutes)

app.use(errorMiddleware);

export default app;