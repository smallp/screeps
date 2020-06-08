let rooms=[],creeps=[]
for (const x in Game.rooms) {
	rooms.push(x)
}
for (const x in Game.creeps) {
	creeps.push(x)
}
module.exports.loop = function () {
	addFarmer()
}
function addFarmer() {
	const nums=creeps.length
	if (nums<rooms*3){
		Game.spawns[rooms[0]].spawnCreep( [WORK, CARRY, MOVE], 'Harvester'+Game.time, {memory: {role: 'harvester'}} );
	}
}