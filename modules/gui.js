import {scene,renderer} from "../src/main.js"
import {init_document_events} from "../modules/document_events.js"

import { WORLD_MIN_X,WORLD_MIN_Y,WORLD_MAX_X,WORLD_MAX_Y } from "../modules/DungeonLayout.js"
import {Spawner, SpawnManager} from "../modules/Spawner.js";
import { Trap } from "../modules/Trap.js"
import { mobManager } from "../modules/MobManager.js"
import { Unit } from "../modules/Unit.js"
import { RoomTree, RoomNode } from "../modules/RoomTree.js" 
import {DungeonRooms} from "../modules/DungeonLayout.js"
import { MapTile } from "../modules/MapTile.js"
import { UIBuildRoom } from "../modules/UIBuildRoom.js"

const ROOM_COSTP = [1000,5,3,4,1,2,3,4,5,100]
const ROOM_COSTC = [1000,10,3,4,3,2,3,4,5,50]
let camera,aspect,gui,ghostPlane;
let CP_ctx,PT_ctx,CP_t,PT_t;
const plane05_1 = new THREE.PlaneGeometry( 1, 0.5 );

var mx = 0;
var my = 0;

const CAMERA_HIDDEN_Z = 100;
const GHOST_BUILD_Z = 3;
const frustumSize = 10;

var power = 100;
var circuit = 20;

// var ROOM_COSTP = 10
// var ROOM_COSTC = 2

let Build = false;
var buildType = 0;
var mouse_down = false;

function create_context(color,text){

    var context= document.createElement("canvas").getContext("2d");  
    context.canvas.height = 200;
    context.canvas.width = 400;
    context.clearRect(0, 0, 400, 200);
    context.fillStyle = color;
    context.font = "bold 140px Arial";
    context.fillText(text,0,200);
    return context

}
function update_text(new_text, old_text, texture){
    old_text.clearRect(0, 0, 400, 200);
    old_text.fillText(new_text,10,200);
    texture.needsUpdate = true;
}

function init_gui(){

    aspect = window.innerWidth / window.innerHeight;
        
    camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000);
    camera.position.z = 5;

    ghostPlane = new THREE.Mesh(new THREE.PlaneGeometry( 1, 1 ), new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.1 }));
    ghostPlane.position.z = CAMERA_HIDDEN_Z;
    scene.add(ghostPlane);

    const bar = new THREE.Mesh(new THREE.PlaneGeometry( 10, 1 ), new THREE.MeshBasicMaterial({ color: 0xFF0000 }));
    bar.position.y += -4;
    bar.position.z += 3;

    CP_ctx = create_context("blue","5")
    CP_t = new THREE.CanvasTexture(CP_ctx.canvas)
    var CP_tp =  new THREE.Mesh(plane05_1, new THREE.MeshBasicMaterial({ map: CP_t, }));
    CP_tp.material.transparent = true;
    CP_tp.position.x -= 4.3;
    CP_tp.position.z += 3;
    CP_tp.position.y += 2.6;

    PT_ctx = create_context("blue","10")
    PT_t = new THREE.CanvasTexture(PT_ctx.canvas)
    var PT_tp =  new THREE.Mesh(plane05_1, new THREE.MeshBasicMaterial({ map: PT_t, }));
    PT_tp.material.transparent = true;
    PT_tp.position.x -= 4.3;
    PT_tp.position.z += 3;
    PT_tp.position.y += 3.1;

    const icon = new THREE.PlaneGeometry(0.5, 0.5);
    const CB_tex = new THREE.TextureLoader().load( '../sprites/circuit_board.png' );
    const CB_mt = new THREE.MeshBasicMaterial({ map: CB_tex });
    CB_mt.transparent = true;
    const circuit_board = new THREE.Mesh(icon, CB_mt);
    circuit_board.position.x = -5;
    circuit_board.position.y = 2.5;
    circuit_board.position.z= 3;

    const PT_tex = new THREE.TextureLoader().load( '../sprites/power_thing.png' );
    const PT_mt= new THREE.MeshBasicMaterial({ map: PT_tex });
    PT_mt.transparent = true;
    const power_thing = new THREE.Mesh(icon, PT_mt);
    power_thing.position.x = -5;
    power_thing.position.z = 3;
    power_thing.position.y = 3;
    
    scene.add(power_thing);
    scene.add(PT_tp);
    scene.add(circuit_board);
    scene.add(CP_tp);
    scene.add(bar);
   
    gui = [null,null,null,null,null,null];
    gui[0] = camera;
    gui[1] = bar;
    gui[2] = power_thing;
    gui[3] = PT_tp;
    gui[4] = circuit_board;
    gui[5] = CP_tp;


    document.body.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('keydown',onDocumentKeyDown, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
}

function onDocumentMouseDown( event ) {
	mouse_down = true;    

	if(Build == true)
	{

        if (power >= ROOM_COSTP[buildType] && circuit >= ROOM_COSTC[buildType] && buildType > 0){
            var x = mx-WORLD_MIN_X-0.5;
            var y = my-WORLD_MIN_Y-0.5;
            power -= ROOM_COSTP[buildType];
            circuit -= ROOM_COSTC[buildType];
            switch(buildType){
                case 1:
                        UIBuildRoom(new THREE.Vector2(x,y)); 
                    break;
                case 4:
                    if (DungeonRooms[x][y].isBuilt && DungeonRooms[x][y].trap == null){
                        DungeonRooms[x][y].trap = new Trap(10,5,x -3 ,y -3);
                        power -= 2;

                        scene.add(DungeonRooms[x][y].trap.sprite)
                    }
                    break;

            }
        }
        //exit room construction mode
        buildType = 0;
        Build = false
        ghostPlane.position.z = CAMERA_HIDDEN_Z;
        update_text(power.toString(),PT_ctx,PT_t);
        update_text(circuit.toString(),CP_ctx,CP_t);
        
	}
    
}
function onDocumentMouseUp( event ) {
    mouse_down = false;
}
function onDocumentMouseMove(event) {
	event.preventDefault();
	//update the coordinates of the "mouse over" room
	mx = Math.ceil(camera.position.x + aspect * frustumSize *((event.clientX/window.innerWidth)*2 -1) * 0.5 - 0.4);
	my = Math.ceil(camera.position.y + -frustumSize *((event.clientY/window.innerHeight)*2 -1) * 0.5 - 0.4);
	
	//boundary checks
	if(mx < WORLD_MIN_X+0.5)
	{
		mx = WORLD_MIN_X+0.5;
	}
	else if(mx > WORLD_MAX_X+0.5)
	{
		mx = WORLD_MAX_X+0.5;
	}
	if(my < WORLD_MIN_Y+0.5)
	{
		my = WORLD_MIN_Y+0.5;
	}
	else if(my > WORLD_MAX_Y+0.5)
	{
		my = WORLD_MAX_Y+0.5;
	}

	//click and drag the map around
	if (mouse_down){
		for (let i =0; i < 6; i++){
			if (gui[i] != null){
				gui[i].position.x -= event.movementX * 0.01;
				gui[i].position.y += event.movementY * 0.01;
			}
		}
	}
	
	//update the position of the construction ghost
	if (Build == true){
		ghostPlane.position.x = mx;
		ghostPlane.position.y = my;
		//console.log("animate() ghost:" + ghost.position.x + "," + ghost.position.x);
	}
}

function onDocumentKeyDown(event) {
    ghostPlane.position.x = mx;
    ghostPlane.position.y = my;
    
    switch(event.key) {
        case "a":
            ghostPlane.position.z = GHOST_BUILD_Z;
            Build = true;
            buildType = 1;
            break;
        case "v":
            ghostPlane.position.z = GHOST_BUILD_Z;
            Build = true;
            buildType = 4;
            break;
        case "e":
            ghostPlane.position.z = GHOST_BUILD_Z;
            Build = true;
            buildType = 3;
            break;
        default:
            break;
    }
	//press 'a' to go into room construction mode, and create a construction ghost
	//this is a visual effect which follows the cursor
}

export {init_gui,camera,aspect,frustumSize};