/*
 * @Author: OCEAN.GZY
 * @Date: 2024-02-28 23:44:55
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-07 11:22:37
 * @FilePath: /ocean_roguelike/assets/script/this.ts
 * @Description: 注释信息
 */
import { Node } from "cc";
import { Player } from "./Character/Player";
import { Tower } from "./Character/Tower";

export class Global {
    static player: Player;
    static weaponBullets: Node;
};

export enum PHY_GROUP {
    DEFAULT = 1 << 0,
    PLAYER = 1 << 1,
    MONSTER = 1 << 2,
    PLAYER_WEAPON = 1 << 3,
    MONSTER_WEAPON = 1 << 4,
    PLAER_ATTACK_AREA = 1 << 5,
    TOOL = 1 << 6,
    HERO = 1 << 7,
    TOWER = 1 << 8,
    MAIN = 1 << 9
};

export enum GameStatusType {
    /** 等待 */
    Wait,
    /** 开始 */
    Start,
    /** 暂停 */
    Pasue,
    /** 结束 */
    End,
}

export const enum PlayerState {
    IDLE,
    RUN,
    FIX,
}


export const enum ResType{
    POWER,
    STEEL
}


export class TowerConfigInfo{
    iconPath:string;
    buildCost:number;
    resType:ResType;
    towerDisc:string;
    constructor(data)
    {
        this.iconPath = data.iconPath;
        this.buildCost = data.buildCost;
        this.resType = data.resType;
        this.towerDisc = data.towerDisc;
    }
}

export const enum TowerIndex {
    MACHINE_GUN = 0,
    POWER_STATION = 1,
    STEEL_STATION = 2,
    SATELLITE =3

}

const AllTowerConfigInfo = 
{
    [TowerIndex.MACHINE_GUN] : {
        iconPath : "url",
        buildCost : 4,
        resType : ResType.POWER,
        towerDisc : ""
    },
    [TowerIndex.POWER_STATION] : {
        iconPath : "url",
        buildCost : 4,
        resType : ResType.POWER,
        towerDisc : ""
    },
    [TowerIndex.STEEL_STATION] : {
        iconPath : "url",
        buildCost : 4,
        resType : ResType.POWER,
        towerDisc : ""
    },
    [TowerIndex.SATELLITE] : {
        iconPath : "url",
        buildCost : 4,
        resType : ResType.POWER,
        towerDisc : ""
    },
}