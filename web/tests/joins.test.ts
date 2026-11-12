// joins: players who come and go while the world boots (src/worker/joins.ts).
import assert from "node:assert";
import { Joins } from "../src/worker/joins.js";

{ // a later player who leaves before the first join is settled never comes in, and still gets the disconnect answer
	const j = new Joins("alpha");
	j.connect({ key: "Beta", job: "Assistant" });
	j.disconnect("Beta");
	assert.deepStrictEqual(j.takeArrivals(), []);
	assert.deepStrictEqual(j.takeCancelled(), ["beta"]);
	assert.strictEqual(j.firstArrives(), "setup"); j.firstIn();
	assert.deepStrictEqual(j.takeArrivals(), []);
	assert.deepStrictEqual(j.takeLeaving(), []);
}
{ // leave and come back during the boot: one connect
	const j = new Joins("alpha");
	j.connect({ key: "Beta", job: "Assistant" }); j.disconnect("Beta"); j.connect({ key: "Beta", job: "Assistant" });
	assert.strictEqual(j.firstArrives(), "setup"); j.firstIn();
	assert.deepStrictEqual(j.takeArrivals().map((a) => a.ckey), ["beta"]);
}
{ // the first player leaves before the world is ready: gone, nobody connects for them, later players come in
	const j = new Joins("alpha");
	j.disconnect("Alpha"); j.connect({ key: "Gamma", job: "Assistant" });
	assert.deepStrictEqual(j.takeArrivals(), []); // not before the world is ready
	assert.strictEqual(j.firstArrives(), "gone");
	assert.deepStrictEqual(j.takeArrivals().map((a) => a.ckey), ["gamma"]);
	j.connect({ key: "Alpha", job: "Assistant" }); // back later: an ordinary later player
	assert.deepStrictEqual(j.takeArrivals().map((a) => a.ckey), ["alpha"]);
}
{ // the first player leaves and comes back before the world is ready: still the first
	const j = new Joins("alpha");
	j.disconnect("Alpha"); j.connect({ key: "Alpha", job: "Assistant" });
	assert.strictEqual(j.firstArrives(), "setup");
	assert.deepStrictEqual(j.takeArrivals(), []);
}
{ // the first player is refused: later players still come in
	const j = new Joins("alpha");
	j.connect({ key: "Beta", job: "" });
	assert.strictEqual(j.firstArrives(), "setup"); j.firstGone();
	assert.strictEqual(j.open, true);
	assert.deepStrictEqual(j.takeArrivals().map((a) => a.ckey), ["beta"]);
}
{ // the first player leaves in the join wait: their record is dropped, then gone
	const j = new Joins("alpha");
	j.firstArrives(); j.disconnect("Alpha");
	assert.deepStrictEqual(j.takeLeaving(), ["alpha"]);
	j.firstGone(); j.firstIn(); // a late firstIn does not bring them back
	assert.strictEqual(j.mode, "gone");
}
console.log("joins ok");
