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


export const enum ResType {
    POWER,
    STEEL,
    BAG,
}

export const enum BuyState{
    CAN_AFFORD,
    NO_AFFORD,
    NO_OWN,
}


export class TowerConfigInfo {
    iconPath: string;
    buildCost: number;
    resType: ResType;
    buyState:BuyState;
    towerDisc: string;
    towerType:TowerType;
    constructor(data) {
        this.iconPath = data.iconPath;
        this.buildCost = data.buildCost;
        this.resType = data.resType;
        this.towerDisc = data.towerDisc;
        this.buyState = data.buyState;
        this.towerType = data.towerType;
    }
}

export const enum TowerType {
    MACHINE_GUN = 0,
    POWER_STATION = 1,
    STEEL_STATION = 2,
    SATELLITE = 3

}

export const AllTowerConfigInfo =
{
    [TowerType.MACHINE_GUN]: {
        iconPath: "mr/towerIcon/machine_gun",
        buildCost: 10,
        resType: ResType.POWER,
        towerDisc: "攻击力：4\n攻击距离：4",
        buyState: BuyState.NO_AFFORD,
        towerType: TowerType.MACHINE_GUN,
    },
    [TowerType.POWER_STATION]: {
        iconPath: "mr/towerIcon/技能图标",
        buildCost: 50,
        resType: ResType.POWER,
        towerDisc: "攻击力：5\n攻击距离：10",
        buyState: BuyState.NO_AFFORD,
        towerType: TowerType.POWER_STATION,

    },
    [TowerType.STEEL_STATION]: {
        iconPath: "mr/towerIcon/技能图标3",
        buildCost: 50,
        resType: ResType.POWER,
        towerDisc: "攻击力：8\n攻击距离：5",
        buyState: BuyState.NO_AFFORD,
        towerType: TowerType.STEEL_STATION,

    },
    [TowerType.SATELLITE]: {
        iconPath: "mr/towerIcon/power_station",
        buildCost: -1,
        resType: ResType.BAG,
        towerDisc: "每次产生电力:\n1 → 2",
        buyState: BuyState.NO_OWN,
        towerType: TowerType.SATELLITE,

    },
}

