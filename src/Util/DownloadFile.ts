import axios from "axios";
import { readFileSync, unlinkSync, writeFileSync } from "fs";

import path from "path"
import https from "https"

export const tempDir = path.join(process.cwd(), "temp") + "/"
// cuz axios is stupid now
const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

export async function DownloadFile(url: string, fileOutDir: string) {
    const response = await instance.get(url, { responseType: "arraybuffer" })
    await writeFileSync(fileOutDir, response.data)


}