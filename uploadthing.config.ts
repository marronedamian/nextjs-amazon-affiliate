import type { FileRouter } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const uploadThingConfig = {
  uploadthing: {
    fileRouter: ourFileRouter,
  },
} satisfies { uploadthing: { fileRouter: FileRouter } };

export default uploadThingConfig;
