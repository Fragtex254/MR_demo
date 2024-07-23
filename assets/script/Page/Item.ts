import { _decorator, Button, ButtonComponent, Component, Label, Node, Sprite,EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {

    @property(Sprite) towerIcon:Sprite;
    @property(Label) towerLabel:Label;
    @property(Sprite) btnSp:Sprite;
    @property(Label) btnLabel:Label;
    @property(Button) btn:Button;

    start() {

    }

    protected onLoad(): void {
        
    }

    update(deltaTime: number) {
        
    }


}

