// src/composition-root.js
import { createApp } from "./app.js";
import { createHealthRouter } from "./api/routes/health.js";

export function createCompositionRoot() {
    const routes = [
        {
            path: "/health",
            router: createHealthRouter(),
        },
    ];

    const app = createApp({ routes });

    return { app };
}