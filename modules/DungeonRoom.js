import {MapTile} from "./MapTile.js"
import { WORLD_MIN_X,WORLD_MIN_Y,WORLD_MAX_X,WORLD_MAX_Y } from "../modules/DungeonLayout.js"

const NORTH = 1;
const SOUTH = 2;
const EAST = 4;
const WEST = 8;

const FLOOR_A = 1;
const FLOOR_B = 2;
const FLOOR_C = 3;
const FLOOR_D = 4;

class DungeonRoom
{
	constructor(dungeonIndex)
	{
		this.myDungeonIndex = dungeonIndex;
		this.myWorldCoords = new THREE.Vector2(dungeonIndex.x + WORLD_MIN_X, dungeonIndex.y + WORLD_MIN_Y);
		this.isBuilt = false;

		this.trap = null;
		this.units = [];
		this.spawns = [];
	}

	addUnit(unit){
		this.units.push(unit);
		unit.room = this;
	}
	addSpawn(spawn){
		this.spawns.push(spawn);
	}

	addTrap(trap){
		this.trap.push(trap);
	}

	onMobLeave(mob) {
		this.units = this.units.filter(unit => unit !== mob);
	}

	onMobEnter(mob) {
		this.addUnit(mob);
		//check the trap first
		console.log(this.trap);
		if (this.trap !== null) {
			this.trap.doHit(mob);
			console.log(this.trap);
			console.log(mob);
		}

		// //do a battle check
		// if (this.units.length > 1) {
		//
		// }
	}

	CreateMapTiles()
	{
		//play sfx for build success
		this.isBuilt = true;
		new MapTile(SOUTH|WEST,new THREE.Vector2(
			this.myWorldCoords.x + MapTile.worldTileDefaults.x * 0, 
			this.myWorldCoords.y + MapTile.worldTileDefaults.y * 0));
		new MapTile(WEST, 	new THREE.Vector2(
			this.myWorldCoords.x + MapTile.worldTileDefaults.x * 0, 
			this.myWorldCoords.y + MapTile.worldTileDefaults.y * 1), FLOOR_C);
		new MapTile(WEST, 	new THREE.Vector2(
			this.myWorldCoords.x + MapTile.worldTileDefaults.x * 0, 
			this.myWorldCoords.y + MapTile.worldTileDefaults.y * 3), FLOOR_D);
		
		new MapTile(NORTH|WEST,new THREE.Vector2(
			this.myWorldCoords.x + MapTile.worldTileDefaults.x * 0, 
			this.myWorldCoords.y + MapTile.worldTileDefaults.y * 4));
		new MapTile(NORTH,	new THREE.Vector2(
			this.myWorldCoords.x + MapTile.worldTileDefaults.x * 1, 
			this.myWorldCoords.y + MapTile.worldTileDefaults.y * 4));
		new MapTile(NORTH, 	new THREE.Vector2(
			this.myWorldCoords.x + MapTile.worldTileDefaults.x * 3, 
			this.myWorldCoords.y + MapTile.worldTileDefaults.y * 4));
		
		new MapTile(NORTH|EAST,new THREE.Vector2(
			this.myWorldCoords.x + MapTile.worldTileDefaults.x * 4, 
			this.myWorldCoords.y + MapTile.worldTileDefaults.y * 4));
		new MapTile(EAST, 	new THREE.Vector2(
			this.myWorldCoords.x + MapTile.worldTileDefaults.x * 4, 
			this.myWorldCoords.y + MapTile.worldTileDefaults.y * 3), FLOOR_A);
		new MapTile(EAST, 	new THREE.Vector2(
			this.myWorldCoords.x + MapTile.worldTileDefaults.x * 4, 
			this.myWorldCoords.y + MapTile.worldTileDefaults.y * 1), FLOOR_B);
		
		new MapTile(SOUTH|EAST,new THREE.Vector2(
			this.myWorldCoords.x + MapTile.worldTileDefaults.x * 4, 
			this.myWorldCoords.y + MapTile.worldTileDefaults.y * 0));
		new MapTile(SOUTH, 	new THREE.Vector2(
			this.myWorldCoords.x + MapTile.worldTileDefaults.x * 3, 
			this.myWorldCoords.y + MapTile.worldTileDefaults.y * 0));
		new MapTile(SOUTH, 	new THREE.Vector2(
			this.myWorldCoords.x + MapTile.worldTileDefaults.x * 1, 
			this.myWorldCoords.y + MapTile.worldTileDefaults.y * 0));
	}
}

export {DungeonRoom};
