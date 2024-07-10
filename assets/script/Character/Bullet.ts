/*
 * @Author: OCEAN.GZY
 * @Date: 2024-03-05 10:09:22
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-10 23:22:06
 * @FilePath: /ocean_roguelike/assets/script/Bullet.ts
 * @Description: 注释信息
 */
import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, RigidBody2D, v2, Vec2, } from 'cc';
import { Player } from './Player';
import { Monster } from './Monster';
import { Global } from '../Global';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    speed: number = 20;
    fireDirection: Vec2 = v2(20, 0);

    bulletCollider: BoxCollider2D;
    damage: number = 5;


    start() {
        // console.log(Player.fireDirection);
        if (Player.fireDirection.length() > 0) {
            this.fireDirection = Player.fireDirection.normalize();
        }

        if (this.node && this.getComponent(RigidBody2D)) {
            this.getComponent(RigidBody2D).linearVelocity = this.fireDirection.multiplyScalar(this.speed);
            this.node.angle = Global.weaponAngle;
        }

        if (this.node && this.getComponent(BoxCollider2D)) {
            this.bulletCollider = this.getComponent(BoxCollider2D);
            this.bulletCollider.on(Contact2DType.BEGIN_CONTACT, this.onHitEnemy, this);
        }
    }

    update(deltaTime: number) {
        if (this.node && this.node.position.length() > 200) {
            this.node.destroy();
        }
    }

    onHitEnemy(selfCollider: Collider2D, otherCollider: Collider2D, concat: IPhysics2DContact | null) {
        // console.log("子弹碰到的东group是",otherCollider.group);
        if (otherCollider.group == 4) {
            
            var hitenemy = otherCollider.node;
            // console.log(hitenemy);
            hitenemy.emit("hurt",this.damage);
            this.scheduleOnce(function(){
                this.node.destroy();
            },0.1)
        }
    }
}

