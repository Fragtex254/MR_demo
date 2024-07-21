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

