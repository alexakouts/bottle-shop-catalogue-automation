import { config } from "./config/config.js";
import { createCompositionRoot } from "./composition-root.js";

const { app } = createCompositionRoot({
  dropboxAccessToken: config.dropbox.accessToken,
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
