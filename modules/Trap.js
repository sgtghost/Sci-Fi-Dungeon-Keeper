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
        this.des = DungeonRoom.buildList[Math.floor(Math.random() * DungeonRoom.buildList.length)];
        console.log(DungeonRoom.buildList.length);
        console.log("random des");
        console.log(this.des);
    }
    doHit(unit) {
        if (this.uses === 0) {
            // do nothing
        } else {
            let hero = this.curNode.units.filter(unit => unit.cost === 1)[0];
            // let des = pathfinding();
            hero.teleport(this.des);
            // let hero = this.curNode.data.DungeonRoom.unit.filter(
            //     u => typeof(u.dodge) !== "undefined" && u.dodge !== null
            // )[0];
            // this.curNode.data.DungeonRoom.unit = this.curNode.data.DungeonRoom.unit.filter(
            //     u => typeof(u.dodge) == "undefined" || u.dodge == null
            // );
            // let randomNode = this.tree.getRandomNode();
            // hero.room =  randomNode;
            // randomNode.data.DungeonRoom.unit.push(hero);
            //access singleton roomTree here and get a random room in the range, then move the unit to that room
            this.uses -= 1
        }
    }
}

export {Trap, TeleporterTrap}