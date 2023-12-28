export class RegexRule {
    name: string = "";
    rule: string = "";
    response: string = "";

    constructor(name: string, rule: string, response: string) {
        this.name = name;
        this.rule = rule
        this.response = response
    }
}