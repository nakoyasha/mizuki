export type Skill = {
    id: number,
    name: string,
    tagHash: string,
    descHash: string,
    typeDeschHash: string,
    levelReq: number,
    iconPath: string,

}

export type CharacterInfo = {
    name: string,
    spRequirement: number,
    rarity: number,
    descHash: string,
    iconPath: string,
    bgPath: string,
    figPath: string,
    fgPath: string,
    artPath: string,
    miniIconPath: string,
    splashIconPath: string,
    damageType: {
        id: number,
        iconPath: string,
        color: string,
        name: string,
        rarity: number,
    },
    baseType: {
        id: number,
        iconPath: string,
        altIconPath: string,
        color: string,
        name: string,
        rarity: number,
    },
    damageTypeId: number,
    baseTypeId: number,
    skills: Skill[]
}