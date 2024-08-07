import { GameStatusType, Global } from './Global';
/*
 * @Author: OCEAN.GZY
 * @Date: 2024-02-28 22:05:38
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-13 08:14:44
 * @FilePath: /ocean_roguelike/assets/script/Main.ts
 * @Description: 注释信息
 */
import { _decorator, AudioSource, Component, log, director, instantiate, Label, Node, NodeSpace, PhysicsSystem2D, Prefab, ProgressBar, random, EPhysics2DDrawFlags, randomRangeInt, TiledMap, UITransform, v2, v3, } from 'cc';
import getPlayerLevelState, { LevelId } from './PlayerLevelConfig';
import { Player } from './Character/Player';
import { GameStatus } from './GameStatus';
import { ResType } from './Global';
const { ccclass, property } = _decorator;


@ccclass('Main')
export class Main extends Component {

    @property(Node) orCamera: Node;
    @property(Player) orPlayer: Player;
    @property(Node) orJoyStick: Node;
    @property(Node) orMain: Node;
    @property(Node) orStaffBox: Node = null;
    @property(Node) orEnemyBox: Node;
    @property(Node) orMap1: Node;
    @property(Prefab) orMonster: Prefab;
    @property(Prefab) orLevelUp: Prefab;
    @property(Prefab) orBullet: Prefab;
    @property(Prefab) orStaff: Prefab;
    @property(Node) gameOver: Node;
    @property(Node) pageView: Node;
    @property(Node) gameStatus: Node;

    labelElectricity: Label = null;
    labelTime: Label = null;
    labelBattleCount: Label = null;

    electricity: number = 0;              //电力
    steel: number = 0;                    //钢材
    time: number = 60;                //剩余时间
    curBattleCount: number = 1;      //当前波次
    totalBattleCount: number = 10;   //总波次

    bnode: Node = new Node;
    enemyNum: number = 0;
    gameState: GameStatusType = GameStatusType.Wait;

    // audioSource: AudioSource;

    elecd: number = 0.25;
    elerate: number = 5;
    nodePool = new Map();

    protected onLoad(): void {
        Global.player = this.orPlayer;
        this.node.addChild(this.bnode);
        Global.weaponBullets = this.bnode;
        this.gameOver.active = false;
        this.initMap();
        this.initPool();

        // this.audioSource = this.getComponent(AudioSource);

    }


    start() {

        // PhysicsSystem2D.instance.enable = true;
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        //     EPhysics2DDrawFlags.Pair |
        //     EPhysics2DDrawFlags.CenterOfMass |
        //     EPhysics2DDrawFlags.Joint |
        //     EPhysics2DDrawFlags.Shape;

        this.schedule(this.enemyCreator, 1);
        // this.levelNodeLabel.string = "等级:0";
        // this.levelNodeBarProgress.progress = 0;
        // this.curevel = 0;
        this.node.on('electricity', this.powerUp, this);

        this.node.on('ResConsume', function (res: ResType, count: number) {
            log("[CJH]:receive ResConsume message!");
            this.onUseConsumeRes(res, count);
        },this);

        // this.audioSource.play();

        this.initGameStatus();

        this.pageView.active = false;

    }

    initGameStatus() {
        //get the label
        this.labelElectricity = this.gameStatus.getComponent(GameStatus).labelElectricity;
        this.labelTime = this.gameStatus.getComponent(GameStatus).labelTime;
        this.labelBattleCount = this.gameStatus.getComponent(GameStatus).labelBattleCount;

        this.labelElectricity.string = this.electricity.toString();
        this.labelTime.string = this.time.toString();
        this.labelBattleCount.string = this.curBattleCount.toString() + "/" + this.totalBattleCount.toString();

    }


    update(deltaTime: number) {
        if (this.elecd > 0) {
            this.elecd -= deltaTime;
        }
        // this.orCamera.worldPosition = this.orPlayer.getWorldPosition();
        /**
         * 流程的管理上尽可能以事件（GameStart、GameEnd）的收发为准，而不是以某个节点的状态，这样前后有序也方便控制游戏整体流程状态
         * update一直刷新 如果期间主角那边有什么死亡动画或者结算画面 还没执行完就会在并行这里直接被暂停卡住
         * 或者状态没变但途中节点销毁也会导致这边的对象为空报错
         *  */
        if (this.orPlayer.isDead()) {
            // this.audioSource.stop();
            Player.enemiesInArea = [];
            this.gameOver.active = true;
            director.pause();
        }
    }

    getCurRes(type: ResType) {
        switch (type) {
            case ResType.POWER: {
                return this.electricity;
            }
            case ResType.STEEL: {
                return this.steel;
            }
        }
    }

    initMap() {

        this.orMap1.getChildByName("Door").active = false;

        const row = 4;
        const col = 7;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                // const node = instantiate(this.orStaff);
                // this.orStaffBox.addChild(node);
            }
        }
    }

    initPool() {
        const num = 10;//创建n名敌人
        for (let i = 0; i < num; i++) {
            const enemyNode = instantiate(this.orMonster);//创建节点
            this.nodePool.set(`Enemy${i}`, enemyNode);//通过put接口放入对象池
        }
        // const bnum = 20;
        // for (let i = 0; i < bnum; i++) {
        //     const bullet1Node = instantiate(this.orBullet);//创建节点
        //     // let bullet2Node = instantiate(this.bullet2Prefab);//创建节点
        //     this.nodePool.set(`Bullet${i}`, bullet1Node);//通过put接口放入对象池
        //     // cc.objPool.put("Bullet2", bullet2Node);//通过put接口放入对象池
        // }
    }

    /** 手动发电 游戏未开始时承担开启 */
    private onClickElectricity() {
        if (this.gameState !== GameStatusType.Start) {
            this.gameState = GameStatusType.Start;
            this.orJoyStick.active = false;
            const pos = this.orPlayer.node.parent.getComponent(UITransform).convertToNodeSpaceAR(this.orMain.worldPosition);
            this.orPlayer.node.setPosition(pos.x, pos.y);
            this.orMap1.getChildByName("Door").active = true;
            this.pageView.active = true;
            this.gameStatus.active = true;
        }
        if (this.gameState === GameStatusType.Start && this.elecd <= 0) {
            this.powerUp();
        }
    }

    enemyCreator() {
        if (!this.gameState) return;
        if (this.enemyNum > 10) {
            this.unschedule(this.enemyCreator);
        }
        var tempEnemy = instantiate(this.orMonster);
        // tempEnemy.on("dead", this.addScore, this);
        tempEnemy.position = v3(randomRangeInt(-300, 300), randomRangeInt(100, 500), 0);
        this.orEnemyBox.addChild(tempEnemy);
        this.enemyNum++;

    }

    /** 电力提升 */
    powerUp() {
        if (this.gameState !== GameStatusType.Start || this.elecd > 0) return;
        this.electricity += this.elerate;
        this.elecd = 1;
        this.labelElectricity.string = this.electricity.toString();
        this.orPlayer.node.emit('change', 'xiuli');
    }

    /** 基地提升（用playlevelconfig改改参数） */
    levelUp() {
        // if (this.gameState !== GameStatusType.Start || this.elecd > 0) return;
        // this.electricity += this.elerate;
        // this.elecd = 1;
        // this.labelElectricity.string = this.electricity.toString();
    }


    // 下一波
    battleCountUp() {
        if (++this.curBattleCount > this.totalBattleCount)     //当全部波次通关
        {
            this.gameOver.active = true;
            director.pause();
        }
        else {
            this.labelBattleCount.string = `${this.curBattleCount} / ${this.totalBattleCount}`;
            //todo: refresh next battle time
            this.timeRefresh();

        }
    }

    timeRefresh() {

    }


    onUseConsumeRes(type: ResType, count: number) {
        log("onUseConsumeRes")
        switch (type) {
            case ResType.POWER:
                {
                    this.electricity -= count;
                }
            case ResType.STEEL:
                {
                    this.steel -= count;
                }
        }
    }
}


