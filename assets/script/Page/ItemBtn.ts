import { _decorator, Component, Node, Sprite, log, Button, error, find } from 'cc';
import { BuyState, ResType, TowerType } from '../Global';
import { PageView } from './PageView';
const { ccclass, property } = _decorator;

@ccclass('ItemBtn')
export class ItemBtn extends Component {

    oldBuyState: BuyState = BuyState.NO_AFFORD;
    curBuyState: BuyState = BuyState.NO_AFFORD;
    resType: ResType = ResType.BAG;
    curRes: number = 0;
    pageViewNode: Node = null;
    cost: number = -1;
    towerType: TowerType;

    mainNode:Node;

    static itemBtnBuyStateStrs: Array<string> = ["可购买", "已拥有", "未拥有"];


    protected onLoad(): void {
        this.node.on(Button.EventType.CLICK, this.build, this);
    }

    start() {
        this.mainNode= find("Canvas");
    }

    update(deltaTime: number) {
        // if (this.cost == -1 && this.curBuyState != BuyState.NO_OWN) {
        //     console.error("You have forgot to set itemBtn cost Please set it!");
        // }

        this.refreshCurRes();
        if (this.oldBuyState != this.curBuyState) {
            this.refreshBtn();
            this.oldBuyState = this.curBuyState;
        }
    }

    setCost(num: number) {
        //each btn should call this function only once
        this.cost = num;
    }

    setResType(type: ResType) {
        this.resType = type;
    }

    refreshCurRes() {
        this.curRes = this.pageViewNode.getComponent(PageView).getCurRes(this.resType);
        if (this.curRes >= this.cost) {
            this.curBuyState = BuyState.CAN_AFFORD;
        }
        else {
            this.curBuyState = BuyState.NO_AFFORD;
        }
    }


    refreshBtn() {
        let SpAl = this.node.getComponent(Sprite).spriteAtlas;
        this.node.getComponent(Sprite).spriteFrame = SpAl.getSpriteFrame(ItemBtn.itemBtnBuyStateStrs[this.curBuyState]);
    }

    build() {
        log("[CJH]:item btn is clicked")
        if (this.curBuyState != BuyState.NO_OWN) {
            if (this.curRes >= this.cost) {

                log(this.pageViewNode);
                this.pageViewNode.emit('Build', this.towerType);
                this.mainNode.emit('ResConsume', this.resType, this.cost);
            }
            else {
                error("资源不足，不能完成购买");
            }
        }
        else {
            error("暂未拥有当前物品");
        }
    }
}


