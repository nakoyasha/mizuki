export default class Logger {
    name: string = "mizuki";
    constructor(name: string) {
        this.name = name;
    }

    log(message: string) {
        console.log(`[+] [${this.name}]: ${message}`)
    }
    warn(message: string) {
        console.warn(`[!] [${this.name}]: ${message}`)
    }

    error(message: string) {
        console.warn(`[❌] [${this.name}]: ${message}`)
    }
}