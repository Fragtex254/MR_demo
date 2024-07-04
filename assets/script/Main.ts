import { Global } from './Global';
import { Monster } from './Monster';
/*
 * @Author: OCEAN.GZY
 * @Date: 2024-02-28 22:05:38
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-13 08:14:44
 * @FilePath: /ocean_roguelike/assets/script/Main.ts
 * @Description: 注释信息
 */
import { _decorator, AudioSource, Component, director, EPhysics2DDrawFlags, instantiate, Label, Node, PhysicsSystem2D, Prefab, ProgressBar, random, randomRangeInt, TiledMap, v3 } from 'cc';
import { Player } from './Player';
import getPlayerLevelState, { LevelId } from './PlayerLevelConfig';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property(Node) orCamera: Node;
    @property(Player) orPlayer: Player;
    @property(Node) orJoyStick: Node;
    @property(TiledMap) orMap0: TiledMap;
    @property(Prefab) orMonster: Prefab;
    @property(Prefab) orLevelUp: Prefab;
    @property(Node) gameover: Node;

    score: number = 0;
    exp: number = 0;

    bnode: Node = new Node;
    enemyNum: number = 0;

    levelNode: Node;
    levelNodeLabel: Label;
    levelNodeBar: Node;
    levelNodeBarProgress: ProgressBar;

    audioSource: AudioSource;

    curevel: number = 0

    protected onLoad(): void {
        Global.player = this.orPlayer;
        this.node.addChild(this.bnode);
        Global.weaponBullets = this.bnode;
        console.log(this.orMap0.getMapSize());
        this.gameover.active = false;


        this.levelNode = this.node.getChildByName("Status").getChildByName("Level")
        this.levelNodeLabel = this.levelNode.getComponent(Label);
        this.levelNodeBar = this.levelNode.getChildByName("LevelBar");
        this.levelNodeBarProgress = this.levelNodeBar.getComponent(ProgressBar);
        this.audioSource = this.getComponent(AudioSource);

    }


    start() {
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        //     EPhysics2DDrawFlags.Pair |
        //     EPhysics2DDrawFlags.CenterOfMass |
        //     EPhysics2DDrawFlags.Joint |
        //     EPhysics2DDrawFlags.Shape;


        var cb = function () {
            if (this.enemyNum > 500) {
                this.unschedule(cb);
            }
            var tempEnemy = instantiate(this.orMonster);
            tempEnemy.on("dead", this.addScore, this);
            tempEnemy.position = v3(randomRangeInt(20, 300), randomRangeInt(100, 500), 0);
            this.node.addChild(tempEnemy);
            this.enemyNum++;
        };
        this.schedule(cb, 1);

        this.levelNodeLabel.string = "等级:0";
        this.levelNodeBarProgress.progress = 0;
        this.curevel = 0;
        this.audioSource.play();
    }

    update(deltaTime: number) {
        this.orCamera.worldPosition = this.orPlayer.getWorldPosition();
        if (this.orPlayer.isDead()) {
            this.audioSource.stop();
            Player.enemiesInArea = [];
            this.gameover.active = true;
            director.pause();
        }
    }

    addScore() {
        this.score += 10;
        this.exp += 10;

        let svalue = this.node.getChildByName("Status").getChildByName("Score").getChildByName("Value");
        let svalueLabel = svalue.getComponent(Label);
        svalueLabel.string = this.score.toString();

        if (this.exp < 50) {
            if (this.curevel != 0) {
                this.curevel = 0;
                this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv0);
            }
            this.levelNodeBarProgress.progress = this.exp / this.orPlayer.currentPlayerState.nextLvexp;
        }
        else if (this.exp < 50 + 100) {
            if (this.curevel != 1) {
                this.curevel = 1;
                this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv1);
                this.showSelectSkill();
            }
            this.levelNodeBarProgress.progress = (this.exp - 50) / this.orPlayer.currentPlayerState.nextLvexp;
        }
        else if (this.exp < 50 + 100 + 250) {
            if (this.curevel != 2) {
                this.curevel = 2;
                this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv2);
                this.showSelectSkill();
            }
            this.levelNodeBarProgress.progress = (this.exp - 50 - 100) / this.orPlayer.currentPlayerState.nextLvexp;
        }
        else if (this.exp < 50 + 100 + 250 + 450) {
            if (this.curevel != 3) {
                this.curevel = 3;
                this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv3);
                this.showSelectSkill();
            }
            this.levelNodeBarProgress.progress = (this.exp - 50 - 100 - 250) / this.orPlayer.currentPlayerState.nextLvexp;
        }
        else if (this.exp < 50 + 100 + 250 + 450 + 700) {
            if (this.curevel != 4) {
                this.curevel = 4;
                this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv4);
                this.showSelectSkill();
            }
            this.levelNodeBarProgress.progress = (this.exp - 50 - 100 - 250 - 450) / this.orPlayer.currentPlayerState.nextLvexp;
        }
        else if (this.exp < 50 + 100 + 250 + 450 + 700 + 1000) {
            if (this.curevel != 5) {
                this.curevel = 5;
                this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv5);
                this.showSelectSkill();
            }
            this.levelNodeBarProgress.progress = (this.exp - 50 - 100 - 250 - 450 - 700) / this.orPlayer.currentPlayerState.nextLvexp;
        }
        else if (this.exp < 50 + 100 + 250 + 450 + 700 + 1000 + 1400) {
            if (this.curevel != 6) {
                this.curevel = 6;
                this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv6);
                this.showSelectSkill();
            }
            this.levelNodeBarProgress.progress = (this.exp - 50 - 100 - 250 - 450 - 700 - 1000) / this.orPlayer.currentPlayerState.nextLvexp;
        }
        else if (this.exp < 50 + 100 + 250 + 450 + 700 + 1000 + 1400 + 2000) {
            if (this.curevel != 7) {
                this.curevel = 7;
                this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv7);
                this.showSelectSkill();
            }
            this.levelNodeBarProgress.progress = (this.exp - 50 - 100 - 250 - 450 - 700 - 1000 - 1400) / this.orPlayer.currentPlayerState.nextLvexp;
        }
        else if (this.exp < 50 + 100 + 250 + 450 + 700 + 1000 + 1400 + 2000 + 3000) {
            if (this.curevel != 8) {
                this.curevel = 8;
                this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv8);
                this.showSelectSkill();
            }
            this.levelNodeBarProgress.progress = (this.exp - 50 - 100 - 250 - 450 - 700 - 1000 - 1400 - 2000) % this.orPlayer.currentPlayerState.nextLvexp;
        }
        else {
            this.orPlayer.currentPlayerState = getPlayerLevelState(LevelId.lv9);
        }
        this.levelNodeLabel.string = this.orPlayer.currentPlayerState.lv == 9 ? "满级" : "等级:" + this.orPlayer.currentPlayerState.lv.toString();

    }

    showSelectSkill() {
        console.log("升级啦，可以开始选择技能了");
        let lvNode = instantiate(this.orLevelUp);
        director.pause();
        this.node.addChild(lvNode);

        let skillBtn01 = lvNode.getChildByName("Layout").getChildByName("Skill01");
        let skillBtn02 = lvNode.getChildByName("Layout").getChildByName("Skill02");
        let skillBtn03 = lvNode.getChildByName("Layout").getChildByName("Skill03");

        skillBtn01.on("click", () => {
            console.log("技能1被选取");
            // 实现给player state的 damge, speed,进行状态加成
            // todo...
            lvNode.destroy();
            director.resume();
        }, this);

        skillBtn02.on("click", () => {
            console.log("技能2被选取")
            // 实现给player state的 damge, speed,进行状态加成
            // todo...

            lvNode.destroy();
            director.resume();
        }, this);

        skillBtn03.on("click", () => {
            console.log("技能3被选取", this.node);
            // 可自行实现给player state的 damge, speed,进行状态加成
            // todo...
            lvNode.destroy();
            director.resume();
        }, this);
    }
}


