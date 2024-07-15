import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameStatus')
export class GameStatus extends Component {
    //use to store labels

    @property(Label) labelElectricity;
    @property(Label) labelTime;
    @property(Label) labelBattleCount;
}


