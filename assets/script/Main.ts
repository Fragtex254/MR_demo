import { Global } from './Global';
/*
 * @Author: OCEAN.GZY
 * @Date: 2024-02-28 22:05:38
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-13 08:14:44
 * @FilePath: /ocean_roguelike/assets/script/Main.ts
 * @Description: 注释信息
 */
import { _decorator, AudioSource, Component, log, director, EPhysics2DDrawFlags, instantiate, Label, Node, NodeSpace, PhysicsSystem2D, Prefab, PrefabLink, ProgressBar, random, randomRangeInt, TiledMap, UITransform, v2, v3, } from 'cc';
import getPlayerLevelState, { LevelId } from './PlayerLevelConfig';
import { Player } from './Character/Player';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property(Node) orCamera: Node;
    @property(Player) orPlayer: Player;
    @property(Node) orJoyStick: Node;
    @property(Node) orMain: Node;
    @property(Node) orStaffBox: Node;
    @property(Node) orEnemyBox: Node;
    @property(TiledMap) orMap0: TiledMap;
    @property(Prefab) orMonster: Prefab;
    @property(Prefab) orLevelUp: Prefab;
    @property(Prefab) orBullet: Prefab;
    @property(Prefab) orStaff: Prefab;
    @property(Node) gameOver: Node;
    @property(Node) towerPage: Node;
    @property(Node) gameStatus: Node;

    labelElectricity: Label = null;
    labelTime: Label = null;
    labelBattleCount: Label = null;

    electricity: number = 0;              //电力
    time: number = 60;                //剩余时间
    curBattleCount: number = 1;      //当前波次
    totalBattleCount: number = 10;   //总波次

    bnode: Node = new Node;
    enemyNum: number = 0;
    isGameStart: boolean = false;

    // levelNode: Node;
    // levelNodeLabel: Label;
    // levelNodeBar: Node;
    // levelNodeBarProgress: ProgressBar;

    audioSource: AudioSource;

    elecd: number = 1;
    elerate: number = 1;
    nodePool = new Map();

    protected onLoad(): void {
        Global.player = this.orPlayer;
        this.node.addChild(this.bnode);
        Global.weaponBullets = this.bnode;
        console.log(this.orMap0.getMapSize());
        this.gameOver.active = false;
        this.initMap();
        this.initPool();

        // this.levelNode = this.node.getChildByName("Status").getChildByName("Level")
        // this.levelNodeLabel = this.levelNode.getComponent(Label);
        // this.levelNodeBar = this.levelNode.getChildByName("LevelBar");
        // this.levelNodeBarProgress = this.levelNodeBar.getComponent(ProgressBar);
        this.audioSource = this.getComponent(AudioSource);


    }


    start() {

        this.schedule(this.enemyCreator, 1);
        // this.levelNodeLabel.string = "等级:0";
        // this.levelNodeBarProgress.progress = 0;
        // this.curevel = 0;
        this.node.on('electricity', this.powerUp, this);
        this.audioSource.play();

        this.initGameStatus();

        // this.towerPage.active = false;

    }

    initGameStatus() {
        //get the label
        this.labelElectricity = this.gameStatus.getChildByName("Electricity").getChildByName("ElectricityIcon").getChildByName("ElectricityLabel").getComponent(Label);
        this.labelTime = this.gameStatus.getChildByName("Time").getChildByName("TimeIcon").getChildByName("TimeLabel").getComponent(Label);
        this.labelBattleCount = this.gameStatus.getChildByName("Battle").getChildByName("BattleIcon").getChildByName("BattleLabel").getComponent(Label);

        this.labelElectricity.string = this.electricity.toString();
        this.labelTime.string = this.time.toString();
        this.labelBattleCount.string = this.curBattleCount.toString() + "/" + this.totalBattleCount.toString();

    }


    update(deltaTime: number) {
        if (this.elecd > 0) {
            this.elecd -= deltaTime;
        }
        // this.orCamera.worldPosition = this.orPlayer.getWorldPosition();
        if (this.orPlayer.isDead()) {
            this.audioSource.stop();
            Player.enemiesInArea = [];
            this.gameOver.active = true;
            director.pause();
        }
    }


    initMap() {
        this.orMap0.getLayer("Door").node.active = false;

        const row = 4;
        const col = 7;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                // const node = instantiate(this.orStaff);
                // this.orStaffBox.addChild(node);
            }
        }

        // const wall = this.orMap0.getLayer("Wall");
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
        if (!this.isGameStart) {
            this.isGameStart = true;
            this.orJoyStick.active = false;
            const pos = this.orPlayer.node.parent.getComponent(UITransform).convertToNodeSpaceAR(this.orMain.worldPosition);
            this.orPlayer.node.setPosition(pos.x, pos.y);
            this.orMap0.getLayer("Door").node.active = true;



            this.towerPage.active = true;
            log(this.towerPage);

            this.gameStatus.active = true;


        }
        if (this.isGameStart && this.elecd <= 0) {
            this.powerUp();
        }
    }

    enemyCreator() {
        if (!this.isGameStart) return;
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
        if (!this.isGameStart || this.elecd > 0) return;
        this.electricity += this.elerate;
        this.elecd = 1;
        this.labelElectricity.string = this.electricity.toString();
    }
    // 下一波
    battleCountUp() {
        if (++this.curBattleCount > this.totalBattleCount)     //当全部波次通关
        {
            this.gameOver.active = true;
            director.pause();
        }
        else {
            this.labelBattleCount.string = this.curBattleCount.toString() + "/" + this.totalBattleCount.toString();

            //todo: refresh next battle time
            this.timeRefresh();

        }
    }

    timeRefresh() {

    }

    // addScore() {
    //     this.score += 10;
    //     this.exp += 10;

    //     let svalue = this.node.getChildByName("Status").getChildByName("Score").getChildByName("Value");
    //     let svalueLabel = svalue.getComponent(Label);
    //     svalueLabel.string = this.score.toString();

    //     if (this.exp < 50) {
    //         if (this.curevel != 0) {
    //             this.curevel = 0;
    //             this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv0);
    //         }
    //         this.levelNodeBarProgress.progress = this.exp / this.orPlayer.currentPlayerState.nextLvexp;
    //     }
    //     else if (this.exp < 50 + 100) {
    //         if (this.curevel != 1) {
    //             this.curevel = 1;
    //             this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv1);
    //             this.showSelectSkill();
    //         }
    //         this.levelNodeBarProgress.progress = (this.exp - 50) / this.orPlayer.currentPlayerState.nextLvexp;
    //     }
    //     else if (this.exp < 50 + 100 + 250) {
    //         if (this.curevel != 2) {
    //             this.curevel = 2;
    //             this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv2);
    //             this.showSelectSkill();
    //         }
    //         this.levelNodeBarProgress.progress = (this.exp - 50 - 100) / this.orPlayer.currentPlayerState.nextLvexp;
    //     }
    //     else if (this.exp < 50 + 100 + 250 + 450) {
    //         if (this.curevel != 3) {
    //             this.curevel = 3;
    //             this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv3);
    //             this.showSelectSkill();
    //         }
    //         this.levelNodeBarProgress.progress = (this.exp - 50 - 100 - 250) / this.orPlayer.currentPlayerState.nextLvexp;
    //     }
    //     else if (this.exp < 50 + 100 + 250 + 450 + 700) {
    //         if (this.curevel != 4) {
    //             this.curevel = 4;
    //             this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv4);
    //             this.showSelectSkill();
    //         }
    //         this.levelNodeBarProgress.progress = (this.exp - 50 - 100 - 250 - 450) / this.orPlayer.currentPlayerState.nextLvexp;
    //     }
    //     else if (this.exp < 50 + 100 + 250 + 450 + 700 + 1000) {
    //         if (this.curevel != 5) {
    //             this.curevel = 5;
    //             this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv5);
    //             this.showSelectSkill();
    //         }
    //         this.levelNodeBarProgress.progress = (this.exp - 50 - 100 - 250 - 450 - 700) / this.orPlayer.currentPlayerState.nextLvexp;
    //     }
    //     else if (this.exp < 50 + 100 + 250 + 450 + 700 + 1000 + 1400) {
    //         if (this.curevel != 6) {
    //             this.curevel = 6;
    //             this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv6);
    //             this.showSelectSkill();
    //         }
    //         this.levelNodeBarProgress.progress = (this.exp - 50 - 100 - 250 - 450 - 700 - 1000) / this.orPlayer.currentPlayerState.nextLvexp;
    //     }
    //     else if (this.exp < 50 + 100 + 250 + 450 + 700 + 1000 + 1400 + 2000) {
    //         if (this.curevel != 7) {
    //             this.curevel = 7;
    //             this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv7);
    //             this.showSelectSkill();
    //         }
    //         this.levelNodeBarProgress.progress = (this.exp - 50 - 100 - 250 - 450 - 700 - 1000 - 1400) / this.orPlayer.currentPlayerState.nextLvexp;
    //     }
    //     else if (this.exp < 50 + 100 + 250 + 450 + 700 + 1000 + 1400 + 2000 + 3000) {
    //         if (this.curevel != 8) {
    //             this.curevel = 8;
    //             this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv8);
    //             this.showSelectSkill();
    //         }
    //         this.levelNodeBarProgress.progress = (this.exp - 50 - 100 - 250 - 450 - 700 - 1000 - 1400 - 2000) % this.orPlayer.currentPlayerState.nextLvexp;
    //     }
    //     else {
    //         this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv9);
    //     }
    //     this.levelNodeLabel.string = this.orPlayer.currentPlayerState.lv == 9 ? "满级" : "等级:" + this.orPlayer.currentPlayerState.lv.toString();

    // }

    // showSelectSkill() {
    //     console.log("升级啦，可以开始选择技能了");
    //     let lvNode = instantiate(this.orLevelUp);
    //     director.pause();
    //     this.node.addChild(lvNode);

    //     let skillBtn01 = lvNode.getChildByName("Layout").getChildByName("Skill01");
    //     let skillBtn02 = lvNode.getChildByName("Layout").getChildByName("Skill02");
    //     let skillBtn03 = lvNode.getChildByName("Layout").getChildByName("Skill03");

    //     skillBtn01.on("click", () => {
    //         console.log("技能1被选取");
    //         // 实现给player state的 damge, speed,进行状态加成
    //         // todo...
    //         lvNode.destroy();
    //         director.resume();
    //     }, this);

    //     skillBtn02.on("click", () => {
    //         console.log("技能2被选取")
    //         // 实现给player state的 damge, speed,进行状态加成
    //         // todo...

    //         lvNode.destroy();
    //         director.resume();
    //     }, this);

    //     skillBtn03.on("click", () => {
    //         console.log("技能3被选取", this.node);
    //         // 可自行实现给player state的 damge, speed,进行状态加成
    //         // todo...
    //         lvNode.destroy();
    //         director.resume();
    //     }, this);
    // }
}


