import "dotenv/config";

import app from "./app";
import { PORT } from "./config/env";

app.listen(PORT, () => {
    console.log(`API running on localhost:${PORT}`)
})

