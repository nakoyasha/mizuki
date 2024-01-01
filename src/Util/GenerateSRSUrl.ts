import { spawn } from "child_process";

// doing this because the original code was in python
// and i cannot be arsed to convert python code to typescript

// enjoy ig
export async function generateSRSUrl(characterName: string) {
  const python = spawn("python", [
    "src/Python/GenerateSRSUrl.py",
    characterName,
  ]);
  let result = Buffer.from("");

  python.stdout.on("data", (msg) => {
    result = msg;
  });

  await new Promise((resolve) => {
    python.on("close", resolve);
  });

  return result.toString();
}

function generateBase63Entropy(input: string) {
  let t = 0;

  for (let n = 0; n < input.length; n++) {
    t = (t << 5) - t + input.charCodeAt(n);
    t = t & t;
  }

  t = t % Math.pow(2, 32);
  return t;
}

function divmod(dividend: number, divisor: number): [number, number] {
  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  return [quotient, remainder];
}

function base36Encode(input: number) {
  const isNegative = input < 0,
    alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZ";

  let absNumber = Math.abs(input),
    base36 = "";

  while (absNumber) {
    const modResult = divmod(absNumber, 36);
    (absNumber = modResult[0]), (base36 = alphabet[modResult[1]] + base36);
  }
  if (isNegative) base36 = `-${base36}`;

  return base36.toLowerCase() || alphabet[0].toLowerCase();
}

export async function generateSRSUrlV2(characterName: string) {
  return base36Encode(
    generateBase63Entropy(`en/characters/${characterName}.json`),
  );
}
