import { config } from "./config/config.js";
import { createCompositionRoot } from "./composition-root.js";

const { app } = createCompositionRoot({
  dropbox: config.dropbox,
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
