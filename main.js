const farmer = require('./farmer');

let spawns=[],roomOfSpawns={}
for (const x in Game.spawns) {
	spawns.push(x)
	roomOfSpawns[Game.spawns[x].room.name]=x
}
console.log(spawns)
module.exports.loop = function () {
	if (spawns.length==0) return
	farmer.addFarmer(spawns,roomOfSpawns)
	farmer.dealCreeps()
}
