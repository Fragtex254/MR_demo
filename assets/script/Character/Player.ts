import { Button, Vec2 } from 'cc';
/*
 * @Author: OCEAN.GZY
 * @Date: 2024-02-28 00:02:08
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-11 23:35:25
 * @FilePath: /ocean_roguelike/assets/script/Player.ts
 * @Description: 注释信息
 */
import { JoyStick } from '../JoyStick';
import { _decorator, Collider2D, instantiate, IPhysics2DContact, Node, Prefab, v2 } from 'cc';
import { Global } from '../Global';
import { CharacterBase } from './CharacterBase';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends CharacterBase {

    @property(JoyStick) joyStick: JoyStick;
    @property(Prefab) weapon: Prefab;
    weaponPoint: Node;
    curWeapon: Node;

    start() {
        super.start();
        this.weaponPoint = this.node.getChildByName("WeaponPoint");
        this.curWeapon = instantiate(this.weapon);
        this.curWeapon.setPosition(this.weaponPoint.position);
        this.node.addChild(this.curWeapon);
    }

    update(deltaTime: number) {
        if (this.currentPlayerState.life < 0) {
            this.node.destroy();
            return;
        }
        const direction = this.joyStick.getJoyDir();
        // if (direction.x >= 0) {
        //     this.node.setScale(1, 1, 1);
        // } else {
        //     this.node.setScale(-1, 1, 1);
        // }
        const nx = direction.x * this.currentPlayerState.moveSpeed * deltaTime;
        const ny = direction.y * this.currentPlayerState.moveSpeed * deltaTime;
        var radian: number;
        // if (Player.enemiesInArea.length > 0) {
        // var tempEnemy =this.enemiesInArea[Math.floor(Math.random()*this.enemiesInArea.length)];
        // var tempEnemy = Player.enemiesInArea[0];
        // Player.fireDirection = v2(tempEnemy.worldPosition.x - this.node.worldPosition.x, tempEnemy.worldPosition.y - this.node.worldPosition.y);
        // radian = Math.atan2(tempEnemy.worldPosition.y - this.node.worldPosition.y, tempEnemy.worldPosition.x - this.node.worldPosition.x);
        // console.log(radian);

        // } else {
        // radian = Math.atan2(ny, nx);
        // Player.fireDirection = v2(nx, ny);
        // }
        var angle = radian / Math.PI * 180;
        Global.weaponAngle = angle;
        this.curWeapon.angle = angle;
        this.body.linearVelocity = v2(nx, ny);

    }

    override onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('palyer onBeginContact');
        if (otherCollider.group === 512) {
            const btn = otherCollider.node.getComponentInChildren(Button);
            if (btn) {
                btn.node.active = true;
            }
        }
    }

    override onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): void {
        if (otherCollider.group === 512) {
            const btn = otherCollider.node.getComponentInChildren(Button);
            if (btn) {
                btn.node.active = false;
            }
        }
    }

}

