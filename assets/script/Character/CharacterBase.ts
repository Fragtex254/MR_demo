import { BoxCollider2D, Color, director, Label, ProgressBar, tween, v3, Vec2, log, error, Animation } from 'cc';
/*
 * @Author: OCEAN.GZY
 * @Date: 2024-02-28 00:02:08
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-11 23:35:25
 * @FilePath: /ocean_roguelike/assets/script/Player.ts
 * @Description: 注释信息
 */
import { _decorator, CircleCollider2D, Collider2D, Component, Contact2DType, instantiate, IPhysics2DContact, Node, PhysicsSystem2D, Prefab, RigidBody2D, v2 } from 'cc';
import getPlayerLevelState, { LevelId, PlayerLevelConfig } from '../PlayerLevelConfig';
const { ccclass, property } = _decorator;


export enum AttackTag {
    ENEMY = 1 << 0,             //0000 0001
    PLAYER = 1 << 1,            //0000 0010
    HERO = 1 << 2,              //0000 0100
    TOWER = 1 << 3,             //0000 1000
    DOOR = 1 << 4,              //0001 0000
    BULLET = 1 << 5,            //0010 0000
    NO_ENEMY = 31 << 1,         //0011 1110
}

// export enum AttackTag {
//     ENEMY = 1,
//     PLAYER = 2,
//     HERO = 3,
//     TOWER = 4,
//     DOOR = 5,
//     NO_ENEMY = 6,
// }





@ccclass('CharacterBase')
export class CharacterBase extends Component {


    //Basic state for Hero ,will be implemented in the hero class
    currentPlayerState: PlayerLevelConfig;


    private characterLife: number = 0;
    private curCharacterLife: number = 0;
    private forgetInitLife: boolean = true;

    targetTag: AttackTag;       //找到攻击范围内的目标敌人（圆形碰撞体的触发条件）
    selfTag: AttackTag;         //用于注明自身碰撞体
    private forgetSetTag: boolean = true;



    body: RigidBody2D;
    lifeBar: ProgressBar;
    damageLabel: Label;

    static enemiesInArea: Node[] = [];          //全局变量用于记录所有在攻击范围内的怪物
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

        this.lifeBar = this.node.getComponentInChildren(ProgressBar);
        this.damageLabel = this.node.getComponentInChildren(Label);
        this.damageLabel.color = new Color(255, 255, 255, 0);

        this.node.on('change', this.changeState, this);

    }



    protected update(dt: number): void {
        if (this.forgetInitLife) {
            error("You have forgot to initiate character life, please config it in the derived class by using super.setLife()");
        }

        if (this.forgetSetTag) {
            error("You have forgot to initiate attack tag, please config it in the derived class by using super.setAttackTag()");
        }
        if (this.curCharacterLife < 0) {
            this.node.destroy();
        }
    }


    setLife(life: number) {
        if (life > 0) {
            this.characterLife = life;
            this.curCharacterLife = life;
            this.forgetInitLife = false;
        }
        else {
            error("You cant set negative number to initiate Life!");
        }
    }


    setAttackTag(_targetTag: AttackTag, _selfTag: AttackTag) {
        this.targetTag = _targetTag;
        this.selfTag = _selfTag;

        let collider = this.getComponent(BoxCollider2D);
        collider.tag = this.selfTag;

        this.forgetSetTag = false;
    }

    fixLabelScale() {
        //in order to fix left-right reversed of label cause by enemy update navigate
        var damagelabelnode = this.node.getChildByName("DamageLabel");

        if (this.node.scale.x < 0) {
            damagelabelnode.setScale(-1, 1, 1);
        }
    }

    changeState(state: string) {
        const anim = this.node?.getComponent(Animation);
        if (!anim || anim?.getState(state)?.isPlaying) return;
        anim.play(state);
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




    getWorldPosition() {
        return this.node ? this.node.worldPosition : v3(0, 0, 0);
    }

    onHurt(damage: number) {

        log("[CJH]:hurt" + damage.toString());
        this.curCharacterLife -= damage;
        this.damageLabel.string = `-${damage}`;
        this.lifeBar.progress = this.curCharacterLife / this.characterLife;

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
        return this.curCharacterLife <= 0;
    }

    isTargetTag(otherCollider: Collider2D) {
        if (this.targetTag != AttackTag.NO_ENEMY) {
            return this.targetTag == otherCollider.tag;
        }
        else {      // XXXX0 & 00000 != 00000 
            return (otherCollider.tag | 0) != 0;
        }
    }
}

