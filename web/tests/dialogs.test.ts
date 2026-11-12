// dialogs: pop-up questions open on players' pages (src/vm/dialogs.ts). Every way out answers the waiting code exactly once.
import assert from "node:assert";
import { Dialogs } from "../src/vm/dialogs.js";
import type { Value } from "../src/vm/value.js";

// `got` collects what each waiting piece of code was told, as Clients would deliver it.
class T {
	readonly d: Dialogs<Value[]>;
	constructor(max = 20) { this.d = new Dialogs(max); }
	private tell(closed: { waiting: Value[]; value: Value }[]) { for (const c of closed) c.waiting.push(c.value); }
	ask(ckey: string, got: Value[], more: { items?: Value[]; num?: boolean; buttons?: string[] } = {}): number {
		const { id, closed } = this.d.open({ ckey, ...more, waiting: got });
		this.tell(closed);
		return id;
	}
	answer(id: number, v: string | number | null, ckey?: string) { this.tell(this.d.answer(id, v, ckey)); }
	left(ckey: string) { this.tell(this.d.playerLeft(ckey)); }
}

{ // a player who leaves with questions open: each waiting piece of code gets a cancel, other players' questions stay
	const t = new T(), alpha: Value[] = [], beta: Value[] = [];
	t.ask("alpha", alpha); t.ask("alpha", alpha, { buttons: ["Yes", "No"] });
	const b = t.ask("beta", beta);
	t.left("alpha");
	assert.deepStrictEqual(alpha, [null, null]);
	assert.strictEqual(t.d.openFor("alpha"), 0);
	assert.deepStrictEqual(beta, []);
	t.answer(b, "hi", "beta");
	assert.deepStrictEqual(beta, ["hi"]);
	t.left("alpha"); // leaving twice does nothing more
	assert.deepStrictEqual(alpha, [null, null]);
}
{ // a late answer to a question that was cancelled by leaving is ignored
	const t = new T(), got: Value[] = [];
	const id = t.ask("alpha", got);
	t.left("alpha"); t.answer(id, "late", "alpha");
	assert.deepStrictEqual(got, [null]);
}
{ // only the asked player answers, and only with something offered
	const t = new T(), got: Value[] = [];
	const list = t.ask("alpha", got, { items: ["a", "b"] });
	t.answer(list, 1, "beta"); t.answer(list, 5, "alpha"); t.answer(list, "b", "alpha");
	assert.deepStrictEqual(got, []);
	t.answer(list, 1, "alpha");
	const alert = t.ask("alpha", got, { buttons: ["Yes", "No"] });
	t.answer(alert, "Maybe", "alpha"); t.answer(alert, "No", "alpha");
	const num = t.ask("alpha", got, { num: true });
	t.answer(num, "12", "alpha");
	const text = t.ask("alpha", got);
	t.answer(text, null, "alpha");
	assert.deepStrictEqual(got, ["b", "No", 12, null]);
	assert.strictEqual(t.d.openFor("alpha"), 0);
}
{ // past the cap the oldest question is cancelled
	const t = new T(2), got: Value[] = [];
	const first = t.ask("alpha", got); t.ask("alpha", got); t.ask("alpha", got);
	assert.deepStrictEqual(got, [null]);
	assert.strictEqual(t.d.openFor("alpha"), 2);
	t.answer(first, "x", "alpha");
	assert.deepStrictEqual(got, [null]);
}
console.log("dialogs ok");
