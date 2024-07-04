/*
 * @Author: OCEAN.GZY
 * @Date: 2024-03-09 22:12:51
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-10 15:44:51
 * @FilePath: /ocean_roguelike/assets/script/PlayerLevelConfig.ts
 * @Description: 注释信息
 */

export const enum LevelId {
    lv0, lv1, lv2, lv3, lv4, lv5, lv6, lv7, lv8, lv9
}

export default function getPlayerLevelState(id: LevelId): PlayerLevelConfig {
    return new PlayerLevelConfig(AllStates[id]);
}


export class PlayerLevelConfig {
    lv: number;
    life: number;
    damage: number;
    maxlife: number;
    nextLvexp: number;
    moveSpeed: number;
    constructor(data) {
        this.lv = data.lv;
        this.life = data.life;
        this.damage = data.damage;
        this.maxlife = data.maxlife;
        this.nextLvexp = data.nextLvexp;
        this.moveSpeed = data.moveSpeed;
    }
}


const AllStates = {
    [LevelId.lv0]: {
        lv: 0,
        life: 100,
        damage: 3,
        maxlife: 100,
        nextLvexp: 50,
        moveSpeed: 5,
    },
    [LevelId.lv1]: {
        lv: 1,
        life: 150,
        damage: 5,
        maxlife: 150,
        nextLvexp: 100,
        moveSpeed: 5,
    },
    [LevelId.lv2]: {
        lv: 2,
        life: 200,
        damage: 6,
        maxlife: 200,
        nextLvexp: 250,
        moveSpeed: 5,
    },
    [LevelId.lv3]: {
        lv: 3,
        life: 250,
        damage: 7,
        maxlife: 250,
        nextLvexp: 450,
        moveSpeed: 5,
    },
    [LevelId.lv4]: {
        lv: 4,
        life: 300,
        damage: 8,
        maxlife: 300,
        nextLvexp: 700,
        moveSpeed: 5,

    },
    [LevelId.lv5]: {
        lv: 5,
        life: 350,
        damage: 9,
        maxlife: 350,
        nextLvexp: 1000,
        moveSpeed: 5,
    },
    [LevelId.lv6]: {
        lv: 6,
        life: 400,
        damage: 12,
        maxlife: 400,
        nextLvexp: 1400,
        moveSpeed: 5,
    },
    [LevelId.lv7]: {
        lv: 7,
        life: 500,
        damage: 15,
        maxlife: 500,
        nextLvexp: 2000,
        moveSpeed: 5,
    },
    [LevelId.lv8]: {
        lv: 8,
        life: 800,
        damage: 20,
        maxlife: 800,
        nextLvexp: 3000,
        moveSpeed: 5,
    },
    [LevelId.lv9]: {
        lv: 9,
        life: 1000,
        damage: 25,
        maxlife: 1000,
        nextLvexp: 0,
        moveSpeed: 5,
    },
};