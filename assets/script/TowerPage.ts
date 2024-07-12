import { _decorator, Component, instantiate, Node, NodeSpace, Prefab, Vec3 } from 'cc';
import { TowerBtn } from './TowerBtn';
const { ccclass, property } = _decorator;

@ccclass('TowerPage')
export class TowerPage extends Component {

    TowerBtns: Node = null;
    PageView: Node = null;

    @property(Prefab)
    towerBtnPre: Prefab = null;


    protected onLoad(): void {
        this.TowerBtns = this.node.getChildByName("TowerBtns");
        this.PageView = this.node.getChildByName("PageView");
    }

    start() {
        this.initTowerBtns();
        this.node.active = false;       //wait for game start
        this.PageView.active = false;   //avoid error setting


    }

    update(deltaTime: number) {

    }

    initTowerBtns() {
        var len = this.TowerBtns.children.length;
        for (var i = 0; i < len; i++) {

            let tempNode = this.TowerBtns.children[i];
            let tempBtn = instantiate(this.towerBtnPre);
            tempBtn.setParent(tempNode);
            tempBtn.position = Vec3.ZERO;
            tempBtn.getComponent(TowerBtn).SecondPage = this.PageView;
        }
    }

}


