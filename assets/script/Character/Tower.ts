import { Vec2 } from 'cc';
/*
 * @Author: OCEAN.GZY
 * @Date: 2024-02-28 00:02:08
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-11 23:35:25
 * @FilePath: /ocean_roguelike/assets/script/Tower.ts
 * @Description: 注释信息
 */
import { _decorator, Collider2D, instantiate, IPhysics2DContact, Node, Prefab, v2 } from 'cc';
import { CharacterBase } from './CharacterBase';
const { ccclass, property } = _decorator;

@ccclass('Tower')
export class Tower extends CharacterBase {


    @property(Prefab) towerBullet:Prefab;
    @property shootCD:number = 0.5;


    start() {
        super.start();
    }

    update(deltaTime: number) {
        if (this.currentPlayerState.life < 0) {
            this.node.destroy();
            return;
        }
        const direction = v2();
        // if (direction.x >= 0) {
        //     this.node.setScale(1, 1, 1);
        // } else {
        //     this.node.setScale(-1, 1, 1);
        // }
        const nx = direction.x * this.currentPlayerState.moveSpeed * deltaTime;
        const ny = direction.y * this.currentPlayerState.moveSpeed * deltaTime;
        var radian: number;
        if (Tower.enemiesInArea.length > 0) {
            // var tempEnemy =this.enemiesInArea[Math.floor(Math.random()*this.enemiesInArea.length)];
            var tempEnemy = Tower.enemiesInArea[0];
            Tower.fireDirection = v2(tempEnemy.worldPosition.x - this.node.worldPosition.x, tempEnemy.worldPosition.y - this.node.worldPosition.y);
            radian = Math.atan2(tempEnemy.worldPosition.y - this.node.worldPosition.y, tempEnemy.worldPosition.x - this.node.worldPosition.x);
            // console.log(radian);

        } else {
            radian = Math.atan2(ny, nx);
            Tower.fireDirection = v2(nx, ny);
        }

    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('palyer onBeginContact');
    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体结束接触时被调用一次
        // console.log('palyer onEndContact');
    }

    onPreSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 每次将要处理碰撞体接触逻辑时被调用
        // console.log('palyer onPreSolve');
    }
    onPostSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 每次处理完碰撞体接触逻辑时被调用
        // console.log('palyer onPostSolve');
    }

    

}

