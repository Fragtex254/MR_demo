/*
 * @Author: OCEAN.GZY
 * @Date: 2024-02-27 23:41:02
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-02-29 00:03:06
 * @FilePath: /ocean_roguelike/assets/script/JoyStick.ts
 * @Description: 注释信息
 */
/*
 * @Author: OCEAN.GZY
 * @Date: 2024-02-27 23:41:02
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-02-28 00:01:21
 * @FilePath: /ocean_roguelike/assets/script/JoyStick.ts
 * @Description: 注释信息
 */
import { _decorator, Component, EventTouch, Node, UITransform, v2, v3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoyStick')
export class JoyStick extends Component {

    @property(Node) innerJoy: Node

    private _out_dir: Vec2 = v2(0, 0);
    private _ui_trans: UITransform;
    private _max_radius: number = 45;

    start() {
        this._ui_trans = this.node.getComponent(UITransform);
        this.handleTouchEvent();
    }

    update(deltaTime: number) {

    }

    handleTouchEvent() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: EventTouch) {
        const uipos = event.getUILocation();
        const cpos = this._ui_trans.convertToNodeSpaceAR(v3(uipos.x, uipos.y, 0));
        this.innerJoy.setPosition(cpos.x, cpos.y);
    }

    onTouchMove(event: EventTouch) {
        const uipos = event.getUILocation();
        const cpos = this._ui_trans.convertToNodeSpaceAR(v3(uipos.x, uipos.y, 0));

        const tempvec2 = v2(cpos.x, cpos.y);
        const scale = tempvec2.length() > this._max_radius ? this._max_radius : tempvec2.length();

        const outvec2 = tempvec2.normalize().multiplyScalar(scale);
        this._out_dir = outvec2;
        this.innerJoy.setPosition(outvec2.x, outvec2.y);
    }

    onTouchEnd(event: EventTouch) {
        this.innerJoy.setPosition(0, 0);
        this._out_dir = v2(0, 0);
    }

    onTouchCancel(event: EventTouch) {
        this.innerJoy.setPosition(0, 0);
        this._out_dir = v2(0, 0);
    }

    getJoyDir(){
        return this._out_dir;
    }
}

