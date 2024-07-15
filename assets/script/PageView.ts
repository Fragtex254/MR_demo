import { _decorator, Component, Node } from 'cc';
import { TowerBtn, TowerState } from './TowerBtn';
const { ccclass, property } = _decorator;



export enum TowerType {
    MACHINE_GUN_TYPE,
    OTHER_TYPE,
    WRONG_TYPE
}

@ccclass('PageView')
export class PageView extends Component {

    @property
    callBtn: Node = null;

    isShowing: boolean = false;


    start() {

    }

    update(deltaTime: number) {
        if (this.isShowing) {
            //todo:stop the game
        }
    }

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
        this.callBtn.getComponent(TowerBtn).m_towerState = TowerState.EMPTY;
        this.callBtn = null;
        this.node.active = false;
    }

    onBtnClick(towerKey: TowerType | any) {
        //todo:add more towerS
        // switch (towerKey) {
        //     case TowerType.MACHINE_GUN_TYPE:
        //         {
        //             this.callBtn.getComponent(TowerBtn).buildMachineGun();
        //             console.log("BUild Machine Gun tower success!");
        //             break;
        //         }
        //     case TowerType.OTHER_TYPE:
        //         {
        //             console.log("This type of tower will be supported in the future!");
        //             break;
        //         }
        //     case TowerType.WRONG_TYPE:
        //         {
        //             console.error("Wrong tower typ!e");
        //             break;
        //         }
        //     default:
        //         console.log("Unknowen Tower Type!");
        //         break;
        // }

        this.callBtn.getComponent(TowerBtn).buildMachineGun();
        console.log("BUild Machine Gun tower success!");
        this.closePage();
    }
}


