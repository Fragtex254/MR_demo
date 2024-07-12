import { _decorator, Component, Node } from 'cc';
import { TowerBtn ,TowerState} from './TowerBtn';
const { ccclass, property } = _decorator;
    
@ccclass('PageView')
export class PageView extends Component {

    @property
    callBtn :Node = null;

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
}


