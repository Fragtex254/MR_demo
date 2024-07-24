import { _decorator, Component, Node, Prefab, instantiate, Vec3, Button, resources, SpriteFrame, Sprite, log, Label, ConfigurableConstraint } from 'cc';
import { TowerBtn, TowerState } from '../TowerBtn';
import { TowerIndex, AllTowerConfigInfo, TowerConfigInfo, ResType, BuyState } from '../Global';
import { Main } from '../Main';
import { ItemBtn } from './ItemBtn';
const { ccclass, property } = _decorator;



export enum TowerType {
    MACHINE_GUN_TYPE,
    OTHER_TYPE,
    WRONG_TYPE
}

@ccclass('PageView')
export class PageView extends Component {

    @property(Prefab) itemPre: Prefab;
    @property(Node) towerBtns: Node = null;
    @property(Prefab) towerBtnPre: Prefab = null;
    @property(Node) itemLayout: Node;
    @property(Node) tabs: Node;
    @property(Node) main: Node;
    callBtn: Node = null;

    isShowing: boolean = false;
    m_electricity: number = 0;
    m_steel:number = 0;

    itemBtnBuyStateStrs: Array<string> = ["可购买", "已拥有","未拥有"];


    //hard code here, should be changed to use a global array.
    items: Array<Node> = new Array<Node>()

    onload()
    {
        
    }


    start() {
        this.initTowerBtns();
        this.node.active = false;       //wait for game start
        for (var i = 0; i < 4; i++) {

            let tempItem = instantiate(this.itemPre);
            this.itemLayout.addChild(tempItem);

            let tempTowerConfigInfo: TowerConfigInfo = AllTowerConfigInfo[i];
            // let tempItemBtn = tempItem.getChildByName("Button").getComponent(Button);
            let tempItemBtn = tempItem.getComponentInChildren(Button);

            tempItem.getComponentInChildren(ItemBtn).PageView = this.node;
            tempItem.getComponentInChildren(ItemBtn).setCost(tempTowerConfigInfo.buildCost);
            tempItem.getComponentInChildren(ItemBtn).setResType(tempTowerConfigInfo.resType);

            tempItemBtn.node.on(Button.EventType.CLICK, this.onBtnClick, this);

            //set item icon
            resources.load(tempTowerConfigInfo.iconPath + "/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                tempItem.getChildByName("TowerIcon").getComponent(Sprite).spriteFrame = spriteFrame;
            });
            tempItem.getChildByName("towerDisc").getComponent(Label).string = tempTowerConfigInfo.towerDisc;
            
            if(tempTowerConfigInfo.buyState != BuyState.NO_OWN)
            {
                tempItemBtn.node.getComponentInChildren(Label).string = tempTowerConfigInfo.buildCost.toString();
            }
            else{
                tempItemBtn.node.getComponentInChildren(Label).string = this.itemBtnBuyStateStrs[tempTowerConfigInfo.buyState];
                tempItemBtn.node.getChildByName("res").active = false;
                tempItemBtn.node.getChildByName("cost").active = false;
                tempItemBtn.node.getChildByName("un_own").active = true;

            }

            //change buy btn bg sprite with buyState
            let tempSprite = tempItemBtn.node.getComponent(Sprite);
            let tempAtlas = tempSprite.spriteAtlas;
            tempSprite.spriteFrame = tempAtlas.getSpriteFrame(this.itemBtnBuyStateStrs[tempTowerConfigInfo.buyState]);

            this.items.push(tempItem);
        }


        log(this.items)
    }

    update(deltaTime: number) {
        if (this.isShowing) {
            //todo:stop the game
        }

        this.refreshCurRes();

    }

    getCurRes(type:ResType) {
        switch(type)
        {
            case ResType.POWER:{
                return this.m_electricity;
            }
            case ResType.STEEL:{
                return this.m_steel;
            }
        }


    }
    
    refreshCurRes()
    {
        this.m_electricity = this.main.getComponent(Main).getCurRes(ResType.POWER);
        this.m_steel = this.main.getComponent(Main).getCurRes(ResType.STEEL);
    }

    // refreshItemBtnBg(index: number) {
    //     if (this.m_electricity >= AllTowerConfigInfo[index].buildCost) {
    //         let itemSp =  this.items[index].getChildByName("Button").getComponent(Sprite);
    //         let itemSpAtlas = itemSp.spriteAtlas;
            
    //     }
    //     else {
    //         return;
    //     }
    // }


    showPage() {
        if (this.isShowing != true) {
            this.node.active = true;
            this.isShowing = true;
        }
        else {
            return;
        }
    }

    closePage() {
        this.isShowing = false;
        var tempBtnState = this.callBtn.getComponent(TowerBtn).m_towerState;
        if (tempBtnState == TowerState.SELECTED) {
            this.callBtn.getComponent(TowerBtn).m_towerState = TowerState.EMPTY;
        }
        this.callBtn = null;
        this.node.active = false;
    }

    onBtnClick(towerKey: TowerType | any) {
        this.callBtn.getComponent(TowerBtn).buildMachineGun();
        console.log("BUild Machine Gun tower success!");
    }

    initTowerBtns() {
        //将所有按钮的点位布置上按钮
        var len = this.towerBtns.children.length;
        for (var i = 0; i < len; i++) {
            let tempNode = this.towerBtns.children[i];
            let tempBtn = instantiate(this.towerBtnPre);
            tempBtn.setParent(tempNode);
            tempBtn.position = Vec3.ZERO;
            tempBtn.getComponent(TowerBtn).SecondPage = this.node;
        }
    }



}


