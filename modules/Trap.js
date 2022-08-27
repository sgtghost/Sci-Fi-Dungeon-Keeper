import { RoomTree, RoomNode } from "../modules/RoomTree.js"
import {DungeonRoom} from "../modules/DungeonRoom.js"
class Trap {
    constructor(hit_rate, damage, debuff = null) {
        this.chance = hit_rate; // ranges from 0 - 1
        this.damage = damage;
        this.debuff = debuff;
    }
    doHit(unit) { 
        if (this.chance === 1) {
            unit.getHit(this.damage);
        } else if ((Math.floor(Math.random() * 100) < ((this.chance / unit.dodge) * 100))) {
            if (this.debuff != null) {
                unit.getHit(this.damage, this.debuff);
            } else {
                unit.getHit(this.damage);
            }
        }
    }
}

class TeleporterTrap extends Trap {
    constructor(hit_rate, damage, uses = 1, curNode, tree) {
        super(hit_rate, damage);
        this.uses = uses;
        this.tree = tree;
        this.curNode = curNode;
    }
    doHit(unit) {
        if (this.uses === 0) {
            // do nothing
        } else {
            this.curNode.data.DungeonRoom.unit = this.curNode.data.DungeonRoom.unit.filter(function( obj ) {
                return this.curNode.data.DungeonRoom;
            });
            let randomNode = this.tree.getRandomNode();
            hero.room =  randomNode;
            randomNode.data.DungeonRoom.unit.push(hero);
            //access singleton roomTree here and get a random room in the range, then move the unit to that room
            this.uses -= 1
        }
    }
}

export {Trap, TeleporterTrap}