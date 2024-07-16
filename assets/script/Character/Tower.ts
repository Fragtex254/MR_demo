import { log, Vec2 } from 'cc';
/*
 * @Author: OCEAN.GZY
 * @Date: 2024-02-28 00:02:08
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-11 23:35:25
 * @FilePath: /ocean_roguelike/assets/script/Tower.ts
 * @Description: 注释信息
 */
import { _decorator, Collider2D, instantiate, IPhysics2DContact, Node, Prefab, v2 } from 'cc';
import { AttackTag, CharacterBase } from './CharacterBase';
import { Monster } from './Monster';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends CharacterBase {


    @property(Prefab) bulletPre: Prefab;
    @property shootCD: number = 0.5;
    @property(Node) firePoint = null;
    @property(Node) towerSprite;

    curTarget: Node = null;
    m_fireDirction: Vec2 = null;


    start() {
        super.start();
        super.setLife(30);
        super.setAttackTag(AttackTag.ENEMY, AttackTag.TOWER);

        this.schedule(() => { this.shoot(); }, this.shootCD);     //会存在每次计时器回调执行时碰巧没有curTarget的bad case
    }


    update(deltaTime: number) {

        log(Tower.enemiesInArea);

        if (this.isDead()) {
            this.node.destroy();
            return;
        }
        super.update(deltaTime);

        if (!this.curTarget != null && Tower.enemiesInArea.length > 0)  //丢失了当前目标，需要重新选取目标
        {
            this.curTarget = Tower.enemiesInArea[Math.floor(Math.random() * Tower.enemiesInArea.length)];//随机获取一个敌人
            log("[CJH]:log tower cur target");
            log(this.curTarget);
            this.m_fireDirction = v2(this.curTarget.worldPosition.x - this.firePoint.worldPosition.x, this.curTarget.worldPosition.y - this.firePoint.worldPosition.y).normalize();
            //set node aim dir
            var radian: number;
            radian = Math.atan2(this.m_fireDirction.x, this.m_fireDirction.y);
            this.node.setRotationFromEuler(0, 0, radian - 90);
            this.shoot();
        }


        // const direction = v2();
        // const nx = direction.x * this.currentPlayerState.moveSpeed * deltaTime;
        // const ny = direction.y * this.currentPlayerState.moveSpeed * deltaTime;
        // var radian: number;
        // if (Tower.enemiesInArea.length > 0) {
        //     var tempEnemy = Tower.enemiesInArea[0];
        //     Tower.fireDirection = v2(tempEnemy.worldPosition.x - this.node.worldPosition.x, tempEnemy.worldPosition.y - this.node.worldPosition.y);
        //     radian = Math.atan2(tempEnemy.worldPosition.y - this.node.worldPosition.y, tempEnemy.worldPosition.x - this.node.worldPosition.x);
        //     // console.log(radian);

        // } else {
        //     radian = Math.atan2(ny, nx);
        //     Tower.fireDirection = v2(nx, ny);
        // }

    }


    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('palyer onBeginContact');
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体结束接触时被调用一次
        // console.log('palyer onEndContact');
    }

    onPreSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 每次将要处理碰撞体接触逻辑时被调用
        // console.log('palyer onPreSolve');
    }
    onPostSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 每次处理完碰撞体接触逻辑时被调用
        // console.log('palyer onPostSolve');
    }

    shoot() {
        if (this.curTarget) {
            var bullet = instantiate(this.bulletPre);
            this.node.addChild(bullet);
            bullet.worldPosition = this.firePoint.getWorldPosition();
            bullet.getComponent(Bullet).setFireDir(this.m_fireDirction);
        }
    }



}

