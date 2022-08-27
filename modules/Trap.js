import { RoomTree, RoomNode } from "../modules/RoomTree.js"
import {DungeonRoom} from "../modules/DungeonRoom.js"
class Trap {
    constructor(hit_rate, damage, debuff = null, room, uses = 1) {
        this.chance = hit_rate; // ranges from 0 - 1
        this.damage = damage;
        this.debuff = debuff;
        this.room = room;
        this.uses = uses;
    }
    doHit(unit) { 
        if (this.uses > 0) {
            if (this.chance === 1) {
                unit.getHit(this.damage);
            } else if ((Math.floor(Math.random() * 100) < ((this.chance / unit.dodge) * 100))) {
                if (this.debuff != null) {
                    unit.getHit(this.damage, this.debuff);
                } else {
                    unit.getHit(this.damage);
                }
            }
            this.uses -= 1;
            if (this.uses <= 0) {
                delete this;
            }
        }
    }
}

// class TeleporterTrap extends Trap {
//     constructor(hit_rate, damage, uses = 1, room, des, posInRoom) {
//         super(hit_rate, damage, posInRoom);
//         this.uses = uses;
//         this.tree = tree;
//         this.room = room;
//         this.des = des;
//     }
//     doHit(unit) {
//         if (this.uses === 0) {
//             // do nothing
//         } else {
//             let hero == null;
//             this.uses -= 1;
//         }
//     }
// }

export {Trap}