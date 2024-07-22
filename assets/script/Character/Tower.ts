import { director, log, Vec2 } from 'cc';
/*
 * @Author: OCEAN.GZY
 * @Date: 2024-02-28 00:02:08
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-11 23:35:25
 * @FilePath: /ocean_roguelike/assets/script/Tower.ts
 * @Description: 注释信息
 */
import { _decorator, Collider2D, CircleCollider2D, instantiate, IPhysics2DContact, Node, Prefab, v2, Contact2DType } from 'cc';
import { AttackTag, CharacterBase } from './CharacterBase';
import { Monster } from './Monster';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends CharacterBase {


    @property(Prefab) bulletPre: Prefab;
    @property shootCD: number = 1;
    @property(Node) firePoint = null;
    @property(Node) towerSprite;

    curTarget: Node = null;
    m_fireDirction: Vec2 = null;
    m_radian: number = 0;
    m_angle: number = 0;
    m_shoot:boolean = false;


    start() {
        super.start();
        super.setLife(30);
        super.setAttackTag(AttackTag.ENEMY, AttackTag.TOWER);

        this.schedule(() => { this.shoot(); }, this.shootCD);     //会存在每次计时器回调执行时碰巧没有curTarget的bad case

        let attackArea = this.getComponent(CircleCollider2D);
        if (attackArea) {
            attackArea.on(Contact2DType.BEGIN_CONTACT, this.onInAttackArea, this);
        }
    }


    update(deltaTime: number) {

        log(Tower.enemiesInArea);

        if (this.isDead()) {
            this.node.destroy();
            return;
        }
        super.update(deltaTime);

        if (Tower.enemiesInArea.length > 0)  //丢失了当前目标，需要重新选取目标
        {
            this.m_shoot = true;
            this.curTarget = Tower.enemiesInArea[Math.floor(Math.random() * Tower.enemiesInArea.length)];//随机获取一个敌人
            this.m_fireDirction = v2(this.curTarget.worldPosition.x - this.node.worldPosition.x, this.curTarget.worldPosition.y - this.node.worldPosition.y).normalize();
            this.m_radian = Math.atan2(this.m_fireDirction.y, this.m_fireDirction.x);
        }
        else{
            this.m_shoot = false;
        }

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

    onInAttackArea(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 每次处理完碰撞体接触逻辑时被调用
        // console.log('敌人在攻击范围内');
        // 当碰到的物体是要攻击的物体就加入攻击范围
        if (this.isTargetTag(otherCollider) && CharacterBase.enemiesInArea.indexOf(otherCollider.node) === -1) {
            Tower.enemiesInArea.push(otherCollider.node);
        }
    }

    shoot() {
        if (this.m_shoot) {
            this.m_angle = - (90 - this.m_radian * 360 / 2 / Math.PI);
            this.node.angle = this.m_angle;

            this.node.getChildByName("LifeBar").angle = -this.m_angle;
            this.node.getChildByName("DamageLabel").angle = -this.m_angle;

            var bullet = instantiate(this.bulletPre);
            director.getScene().getChildByName("Canvas").addChild(bullet);
            bullet.worldPosition = this.firePoint.getWorldPosition();
            bullet.getComponent(Bullet).setFireDir(this.m_fireDirction);
        }
        else {
            console.log("No curTarget");
        }
    }



}

