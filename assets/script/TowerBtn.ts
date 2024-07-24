import { _decorator, Component, Prefab, Node, instantiate, log, Vec3, Sprite } from 'cc';

import { PageView } from './Page/PageView';
const { ccclass, property } = _decorator;

export enum TowerState {
    EMPTY,
    SELECTED,
    HERO_OCCUPIED,
    TOWER_OCCUPIED,
}


@ccclass('TowerBtn')
export class TowerBtn extends Component {

    m_towerState: TowerState = null;
    m_tower: Node = null;

    SecondPage: Node = null;

    @property(Node)
    spriteForShow: Node = null;


    //----will delete this code piece ----
    @property(Prefab)
    TowerPre: Prefab = null;
    //----will delete this code piece ----

    Settle: Node = null;

    start() {
        this.m_towerState = TowerState.EMPTY;
    }



    onClick() {
        if (this.m_towerState == TowerState.EMPTY) {
            this.m_towerState = TowerState.SELECTED;
            this.showTowerPage();
        }
        if (this.m_towerState == TowerState.HERO_OCCUPIED || this.m_towerState == TowerState.TOWER_OCCUPIED) {
            //todo:
            return;
        }
    }

    showTowerPage() {
        this.SecondPage.getComponent(PageView).callBtn = this.node;
        this.SecondPage.getComponent(PageView).showPage();
    }

    buildMachineGun() {
        this.m_towerState = TowerState.TOWER_OCCUPIED;
        this.spriteForShow.destroy();                   //暂时用于显示那些地方有按钮
        this.m_tower = instantiate(this.TowerPre);
        this.m_tower.setParent(this.node);
        this.m_tower.setPosition(Vec3.ZERO);
        this.SecondPage.getComponent(PageView).closePage();     //建造完毕后会关闭
        this.SecondPage = null;
    }

    buildPowerStation(){
        console.error("No for now");
        this.SecondPage.getComponent(PageView).closePage();     //建造完毕后会关闭
        this.SecondPage = null;
    }
    buildSteelStation(){
        console.error("No for now");
        this.SecondPage.getComponent(PageView).closePage();     //建造完毕后会关闭
        this.SecondPage = null;
    }
    buildSatelliteStation(){
        console.error("No for now");
        this.SecondPage.getComponent(PageView).closePage();     //建造完毕后会关闭
        this.SecondPage = null;
    }
}


