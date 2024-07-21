/*
 * @Author: OCEAN.GZY
 * @Date: 2024-03-05 10:09:22
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-10 23:22:06
 * @FilePath: /ocean_roguelike/assets/script/Bullet.ts
 * @Description: 注释信息
 */
import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, RigidBody2D, v2, Vec2, log, Canvas, View, view, director } from 'cc';
import { Player } from './Player';
import { Monster } from './Monster';
import { PHY_GROUP } from '../Global';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    speed: number = 800;
    fireDirection: Vec2 = v2(1, 1);

    bulletCollider: BoxCollider2D;
    damage: number = 5;

    start() {
        // log("[Bullet]:Create a bullet and his parent is " + this.node.parent.name);
        if (this.node && this.getComponent(BoxCollider2D)) {
            this.bulletCollider = this.getComponent(BoxCollider2D);
            this.bulletCollider.on(Contact2DType.BEGIN_CONTACT, this.onHitEnemy, this);
        }
    }

    update(deltaTime: number) {
        // log("Bullet Update!");
        // if (this.node && this.node.position.length() > 200) {
        //     log(this.node);
        //     this.node.destroy();
        // }

        const nx = this.fireDirection.x * this.speed * deltaTime;
        const ny = this.fireDirection.y * this.speed * deltaTime;

        this.getComponent(RigidBody2D).linearVelocity = v2(nx, ny);
        if (this.isOverScreen()) {
            this.node.destroy();
        }
    }

    setFireDir(dir: Vec2) {
        this.fireDirection = dir;
        let radian: number = Math.atan2(dir.y, dir.x);
        this.node.angle = - (90 - radian * 360 / 2 / Math.PI);
    }

    onHitEnemy(selfCollider: Collider2D, otherCollider: Collider2D, concat: IPhysics2DContact | null) {
        console.log("子弹碰到的group是", otherCollider.group);
        if (otherCollider.group == PHY_GROUP.MONSTER) {

            var hitenemy = otherCollider.node;
            hitenemy.getComponent(Monster).onHurt(5);
            // hitenemy.emit(hitenemy.uuid + "is hurted", this.damage);
            this.scheduleOnce(function () {
                this.node.destroy();
            })
        }
    }

    isOverScreen() {

        let worldBounds = this.node.getComponent(Collider2D).worldAABB;
        let visibleSize = view.getVisibleSize();
        if (worldBounds.xMax < 0 //出来屏幕最左边

            || worldBounds.xMin > visibleSize.width //超出屏幕最右边

            || worldBounds.yMin < 0  //超出屏幕底部

            || worldBounds.yMax > visibleSize.height //超出屏幕顶部

        ) {
            // 节点超出屏幕
            console.log("[Bullet] over screen!");
            return true;

        }
        else {
            return false;
        }
    }
}

