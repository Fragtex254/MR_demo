/*
 * @Author: OCEAN.GZY
 * @Date: 2024-03-08 21:23:16
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-08 22:38:09
 * @FilePath: /ocean_roguelike/assets/script/GameOver.ts
 * @Description: 注释信息
 */
import { _decorator, Button, Component, director, Node, PlaceMethod } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {
    @property(Button) restartBtn: Button;

    start() {
        this.restartBtn.node.on(Button.EventType.CLICK, this.restartGame, this);
    }

    update(deltaTime: number) {
    }

    restartGame() {
        director.loadScene("main");
        director.resume();
    }
}

