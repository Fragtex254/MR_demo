/*
 * @Author: OCEAN.GZY
 * @Date: 2024-03-09 22:18:23
 * @LastEditors: OCEAN.GZY
 * @LastEditTime: 2024-03-09 23:07:13
 * @FilePath: /ocean_roguelike/assets/script/SkillData.ts
 * @Description: 注释信息
 */
export const enum SkillId {
    NULL,
    DoubleSpeed,
    DoubleDamage,
    AttackFireBuf,
    AttackIceeBuf
}

export default function getSkillData(id: SkillId): SkillData {
    return new SkillData(data[id]);
}


class SkillData {
    name: string;
    icon: string;
    des: string;
    bufv: number;
    func: Function;
    constructor(data) {
        this.name = data.name;
        this.icon = data.icon;
        this.des = data.des;
        this.bufv = data.bufv;
        this.func = data.func;
    }
}

const data = {
    [SkillId.DoubleSpeed]: {
        name: '双倍速度',
        icon: '',
        des: '增加移动速度',
        bufv: 2,
        func: function () { }
    },
    [SkillId.DoubleDamage]: {
        name: '攻击加倍',
        icon: '',
        des: '增加攻击伤害',
        bufv: 2,
        func: function () { }
    },
    [SkillId.AttackFireBuf]: {
        name: '烈火熊熊',
        icon: '',
        des: '攻击增加灼烧伤害',
        bufv: 2,
        func: function () { }
    },
    [SkillId.AttackIceeBuf]: {
        name: '冰天雪地',
        icon: '',
        des: '攻击增加冰冻伤害',
        bufv: 2,
        func: function () { }
    }
}
