import { _decorator, Component, Prefab, Node, instantiate, log, Vec3 } from 'cc';

import { PageView } from './PageView';
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



    @property
    SecondPage: Node = null;

    //----will delete this code piece ----
    @property(Prefab)
    TowerPre: Prefab = null;
    //----will delete this code piece ----

    Settle: Node = null;

    start() {
        this.m_towerState = TowerState.EMPTY;
    }

    update(deltaTime: number) {

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
}


