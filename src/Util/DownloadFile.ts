import axios from "axios";
import { writeFileSync } from "fs";

import https from "https";
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

export async function DownloadFile(url: string, fileOutDir: string) {
  const response = await instance.get(url, { responseType: "arraybuffer" });
  await writeFileSync(fileOutDir, response.data);
}
