const FARMER='harvester'
const BUILDER='builder'
const UPGRADER='upgrader'
function addFarmer(spawns,roomOfSpawns) {
	let creeps={}
	for (const x in Game.creeps) {
		const obj=Game.creeps[x]
		if (obj.memory.role==FARMER){
			if (obj.room.name in creeps) creeps[obj.room.name].push(x)
			else creeps[obj.room.name]=[x]
		}
	}
	for (const x in Game.rooms) {
		let addOne=false
		if (x in creeps){
			const nums=creeps[x].length
			addOne=nums<3
		}else if (Game.rooms[x].name in roomOfSpawns){
			addOne=true
		}
		addOne && Game.spawns[roomOfSpawns[Game.rooms[x].name]].spawnCreep( [WORK, CARRY, MOVE], FARMER+Game.time, {memory: {role: FARMER}} );
	}
}
module.exports.addFarmer = addFarmer

const handle={}
handle[FARMER] = function(creep) {
	if(creep.store.getFreeCapacity() > 0) {
		var sources = creep.room.find(FIND_SOURCES);
		if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
		}
	}
	else {
		var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
						structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
				}
		});
		if(targets.length > 0) {
			if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
	}
}

handle[BUILDER] = function(creep) {
	if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
		creep.memory.building = false;
		creep.say('harvest');
	}
	if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
		creep.memory.building = true;
		creep.say('build');
	}

	if(creep.memory.building) {
		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(targets.length) {
			if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
	}
	else {
		var sources = creep.room.find(FIND_SOURCES);
		if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
		}
	}
}

handle[UPGRADER] = function(creep) {
	if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
		creep.memory.upgrading = false;
	}
	if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
		creep.memory.upgrading = true;
	}

	if(creep.memory.upgrading) {
		if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
			creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
		}
	}
	else {
		var sources = creep.room.find(FIND_SOURCES);
		if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
		}
	}
}

module.exports.dealCreeps=()=>{
	for (const x in Game.creeps) {
		const obj=Game.creeps[x]
		if (obj.memory.role in handle){
			handle[obj.memory.role](obj)
		}
	}
}