import { BoxCollider2D, Color, director, Label, ProgressBar, tween, v3, Vec2 } from 'cc';
/*
 * @Author: OCEAN.GZY
 * @Date: 2024-02-28 00:02:08
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-11 23:35:25
 * @FilePath: /ocean_roguelike/assets/script/Player.ts
 * @Description: 注释信息
 */
import { JoyStick } from './JoyStick';
import { _decorator, CircleCollider2D, Collider2D, Component, Contact2DType, instantiate, IPhysics2DContact, Node, PhysicsSystem2D, Prefab, RigidBody2D, v2 } from 'cc';
import { Global } from './Global';
import getPlayerLevelState, { LevelId, PlayerLevelConfig } from './PlayerLevelConfig';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    @property(JoyStick) joyStick: JoyStick;
    @property(Prefab) weapon: Prefab;

    currentPlayerState: PlayerLevelConfig;
    // moveSpeed: number = 5;
    body: RigidBody2D;
    weaponPoint: Node;
    curWeapon: Node;
    // life: number = 100;
    // maxLife: number = 100;
    lifeBar: ProgressBar;

    damageLabel: Label;


    static enemiesInArea: Node[] = [];
    static fireDirection: Vec2 = v2(0, 0);

    start() {
        this.currentPlayerState = getPlayerLevelState(LevelId.lv0);
        console.log("初始化", this.currentPlayerState);

        // 注册单个碰撞体的回调函数
        let collider = this.getComponent(BoxCollider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
            collider.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
            collider.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
        this.body = this.getComponent(RigidBody2D);

        this.lifeBar = this.node.getChildByName("LifeBar").getComponent(ProgressBar);
        this.damageLabel = this.node.getChildByName("DamageLabel").getComponent(Label);
        this.damageLabel.color = new Color(255, 255, 255, 0);

        this.node.on("hurt", this.onHurt, this);

        let attackArea = this.getComponent(CircleCollider2D);
        if (attackArea) {
            console.log("player具备attackArea节点，并且有attackAreaCollider组件", attackArea);
            attackArea.on(Contact2DType.BEGIN_CONTACT, this.onEnemyInAttackArea, this);
        }


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
        this.lifeBar.progress = this.currentPlayerState.life / this.currentPlayerState.maxlife;
        const direction = this.joyStick.getJoyDir();
        // if (direction.x >= 0) {
        //     this.node.setScale(1, 1, 1);
        // } else {
        //     this.node.setScale(-1, 1, 1);
        // }
        const nx = direction.x * this.currentPlayerState.moveSpeed * deltaTime;
        const ny = direction.y * this.currentPlayerState.moveSpeed * deltaTime;
        var radian: number;
        if (Player.enemiesInArea.length > 0) {
            // var tempEnemy =this.enemiesInArea[Math.floor(Math.random()*this.enemiesInArea.length)];
            var tempEnemy = Player.enemiesInArea[0];
            Player.fireDirection = v2(tempEnemy.worldPosition.x - this.node.worldPosition.x, tempEnemy.worldPosition.y - this.node.worldPosition.y);
            radian = Math.atan2(tempEnemy.worldPosition.y - this.node.worldPosition.y, tempEnemy.worldPosition.x - this.node.worldPosition.x);
            // console.log(radian);

        } else {
            radian = Math.atan2(ny, nx);
            Player.fireDirection = v2(nx, ny);
        }
        var angle = radian / Math.PI * 180;
        Global.weaponAngle = angle;
        this.curWeapon.angle = angle;
        this.body.linearVelocity = v2(nx, ny);

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

    onEnemyInAttackArea(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 每次处理完碰撞体接触逻辑时被调用
        // console.log('敌人在攻击范围内');
        if (Player.enemiesInArea.indexOf(otherCollider.node) === -1) {
            Player.enemiesInArea.push(otherCollider.node);
        }
    }


    getWorldPosition() {
        return this.node ? this.node.worldPosition : v3(0, 0, 0);
    }

    onHurt(damage: number) {
        this.currentPlayerState.life -= damage;
        this.damageLabel.string = `-${damage}`;
        tween(this.damageLabel)
            .to(0.5, { color: new Color(255, 255, 255, 255), fontSize: 30 })
            .delay(1)
            .call(() => {
                this.damageLabel.string = ''; // 清空标签文本
                this.damageLabel.fontSize = 20;
                this.damageLabel.color = new Color(255, 255, 255, 0);
            })
            .start();
    }

    isDead() {
        return this.currentPlayerState ? this.currentPlayerState.life < 0 : false;
    }
}

