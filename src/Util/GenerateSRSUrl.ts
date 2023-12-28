
import { spawn } from 'child_process';

// doing this because the original code was in python
// and i cannot be arsed to convert python code to typescript 

// enjoy ig
export async function generateSRSUrl(characterName: string) {
    const python = spawn("python", ["src/Python/GenerateSRSUrl.py", characterName])
    var result = Buffer.from("");

    python.stdout.on("data", (msg) => {
        result = msg;
    })

    await new Promise((resolve) => {
        python.on('close', resolve)
    })

    return result.toString();
}