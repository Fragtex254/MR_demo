import { Vec2, v2, Vec3, RigidBody2D, PlaceMethod, BoxCollider2D, Contact2DType, IPhysics2DContact } from 'cc';
/*
 * @Author: OCEAN.GZY
 * @Date: 2024-02-28 23:07:39
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-08 22:51:18
 * @FilePath: /ocean_roguelike/assets/script/Monster.ts
 * @Description: 注释信息
 */
import { _decorator, Component, Node } from 'cc';
import { Global } from './Global';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends Component {

    moveSpeed: number = 50;
    aimDirection: Vec2 = v2(0, 0);
    body: RigidBody2D;
    life: number = 5;
    bodyCollider: BoxCollider2D;
    damage: number = 1;

    start() {
        this.body = this.getComponent(RigidBody2D);
        this.node.on("hurt", this.onHurt, this);
        this.bodyCollider = this.getComponent(BoxCollider2D);
        this.bodyCollider.on(Contact2DType.BEGIN_CONTACT, this.onHitPlayer, this);
    }

    update(deltaTime: number) {
        if (this.life < 0) {
            var temp = Player.enemiesInArea.indexOf(this.node);
            if (temp != -1) {
                Player.enemiesInArea.splice(temp, 1);
            }
            this.node.emit("dead");
            this.node.destroy();
            return;
        }
        // console.log("this.node.worldPosition",this.node.worldPosition);
        // console.log("Global.player.worldPosition",Global.player.worldPosition);
        this.aimDirection = v2(Global.player.getWorldPosition().x - this.node.worldPosition.x, Global.player.getWorldPosition().y - this.node.worldPosition.y).normalize();

        // console.log("this.aimDirection", this.aimDirection);

        // const x = this.node.position.x;
        // const y = this.node.position.y;

        if (this.aimDirection.x >= 0) {
            this.node.setScale(1, 1, 1);
        } else {
            this.node.setScale(-1, 1, 1);
        }

        const nx = this.aimDirection.x * this.moveSpeed * deltaTime;
        const ny = this.aimDirection.y * this.moveSpeed * deltaTime;

        // console.log("new nx",nx);
        // console.log("new ny",ny);

        this.body.linearVelocity = v2(nx, ny);
    }

    onHurt(damage: number) {
        // console.log("收到伤害是：", damage)
        this.life -= damage;
        // console.log("现在的敌人生命值:", this.life);
    }

    onHitPlayer(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        // console.log("敌人撞到什么东西了");
        // console.log(otherCollider.group,otherCollider.tag,otherCollider.name);
        if (otherCollider.tag == 0.1) {
            // console.log(otherCollider);
            otherCollider.node.emit("hurt", this.damage);
        }
    }

}


