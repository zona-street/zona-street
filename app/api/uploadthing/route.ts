import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export routes for Next App Router
// UploadThing SDK reads UPLOADTHING_SECRET and UPLOADTHING_APP_ID from env automatically
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
