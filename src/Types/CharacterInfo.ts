import { ColorResolvable } from "discord.js"

export type Skill = {
    id: number,
    name: string,
    tagHash: string,
    descHash: string,
    typeDeschHash: string,
    levelReq: number,
    iconPath: string,
}

export type CostData = {
    id: number,
    count: number,
}

export type LevelData = {
    promotion: number,
    maxLevel: number,
    cost: CostData[],
    attackBase: number,
    attackAdd: number,
    hpBase: number,
    hpAdd: number,
    defenseBase: number,
    defenseAdd: number,
    cdmg: number,
    speedBase: number,
    speedAdd: number,
}

export type CalculatedLevelStats = {
    Attack: number,
    Defense: number,
    HP: number,
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
        color: ColorResolvable | any,
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
    levelData: Array<LevelData>
    skills: [Skill],
    pageId: string,
}