import { BoxCollider2D, Color, director, Label, ProgressBar, tween, v3, Vec2 ,log,error} from 'cc';
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

@ccclass('CharacterBase')
export class CharacterBase extends Component {



    //Basic state for Hero ,will be implemented in the hero class
    currentPlayerState: PlayerLevelConfig;


    private characterLife: number = 0;
    private curCharacterLife:number = 0;
    private forgetInitLife:boolean = true;

    body: RigidBody2D;
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

        this.lifeBar = this.node.getComponentInChildren(ProgressBar);
        this.damageLabel = this.node.getComponentInChildren(Label);
        this.damageLabel.color = new Color(255, 255, 255, 0);

        this.node.on("hurt", this.onHurt, this);

        let attackArea = this.getComponent(CircleCollider2D);
        if (attackArea) {
            // console.log("player具备attackArea节点，并且有attackAreaCollider组件", attackArea);
            attackArea.on(Contact2DType.BEGIN_CONTACT, this.onInAttackArea, this);
        }

    }



    protected update(dt: number): void {
        if(this.forgetInitLife)
        {
            error("You have forgot to initiate character life, please config it in the derived class by using super.setLife()");
        }
    }


    setLife(life:number)
    {
        if(life>0)
        {    
            this.characterLife = life;
            this.curCharacterLife = life;
            this.forgetInitLife = false;
        }
        else{
            error("You cant set negative number to initiate Life!");
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
        if (CharacterBase.enemiesInArea.indexOf(otherCollider.node) === -1) {
            CharacterBase.enemiesInArea.push(otherCollider.node);
        }
    }


    getWorldPosition() {
        return this.node ? this.node.worldPosition : v3(0, 0, 0);
    }

    onHurt(damage: number) {
        // this.currentPlayerState.life -= damage;


        this.curCharacterLife -= damage;
        this.damageLabel.string = `-${damage}`;
        // this.lifeBar.progress = this.currentPlayerState.life / this.currentPlayerState.maxlife;
        this.lifeBar.progress = this.curCharacterLife/this.characterLife;

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
        return this.characterLife < 0;
        // return this.currentPlayerState ? this.currentPlayerState.life < 0 : false;
    }
}

