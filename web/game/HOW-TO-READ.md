# How to read this code

The game code in `web/game/` started life as /tg/station's DM and was translated into TypeScript once, by a tool. It now is the source, edited by hand, but it still reads like DM written in JavaScript. Once you know about ten names it reads line for line like the original. The rules for editing it are in [README.md](README.md); this page is for reading.

## A whole example

The gym's punching bag, from `code/modules/mining/lavaland/ruins/gym.ts`. In DM it was:

```dm
/obj/structure/punching_bag/attack_hand(mob/user)
	flick("[icon_state]-punch", src)
	playsound(loc, pick(hit_sounds), 25, 1, -1)
```

Here it is:

```ts
rt.type(12962, "/obj/structure/punching_bag", "/obj/structure", {
	name: "punching bag",
	icon: rt.rsc("icons/obj/gym_equipment.dmi"),
	icon_state: "punchingbag",
	...
});

rt.def("/obj/structure/punching_bag/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	flick(`${this.icon_state}-punch`, this);
	playsound(this.loc, pick(this.hit_sounds), 25, 1, -1);
	return f.dot;
});
```

- `rt.type(id, path, parent, { vars })` declares a type and its default variables, like a DM type block.
- `rt.def(path, function)` defines a proc (`rt.def(path, function* ..., true)`: one that may sleep, below). Inside it `this` is `src`. The function's first parameter `f` is the call's frame: `f.usr` is `usr`, `f.dot` is `.` (the default return value). The parameters after `f` are the proc's DM arguments. A proc that assigns to one of its arguments reads them as `f.args[0]`, `f.args[1]`..., with their DM names on the rt.def's last line (`}, true, { args: ["M"] });`: `f.args[0]` is `M`), so `..()` passes the changed value on as DM's does.
- `$0`, `$1`... are the translator's scratch values: a part of an expression it worked out a line earlier (often the two sides of an `a ? b : c`). Read `$0` as whatever was last put in it.
- `flick(...)` calls the global proc `flick`; `A.powered(chan)` calls `A`'s proc, `this.update_icon()` src's, `parent_proc()` is `..()`. Calls don't pass `f`: the bundler adds it, as Python adds `self`. A few calls keep the older spelling the translator wrote: `rt.call(f, P("/proc/flick"), null, [args])`, `rt.callName(f, A, "powered", [chan])`.
- `` `${x}-punch` `` is DM's string with an embedded value, `"[x]-punch"`: in a proc a template string means DM's, so `${obj}` gives "the" before an object's improper name, numbers come out as DM writes them. Text using DM's macros (`\the`, `\ref`, `\s`) keeps the older spelling `fmt("＄！ shuffles ＀.", [this, A])` (`"\The [src] shuffles [A]."`): each `＀` is one `[...]`, `！` a `[...]` after a macro, `＃` `\ref[...]`, the other wide characters the macros.
- `this.icon_state` is `src`'s variable `icon_state`, written `this.icon_state = v`; another object's is `obj.hit_sounds`, written `obj.hit_sounds = v`. Some places keep the older spellings: `rt.sv(f, "loc")` and `rt.sv(f, "health")` (src's `loc`, `health`) only in a proc that assigns `f.src` (`src = null`) or the tails of one; `rt.fv(f, "hit_sounds", obj)` (`obj.hit_sounds`), written `rt.setFv` / `rt.setSv`. JavaScript's own names (`length`, `size`, `value`, `message`...) always do.
- `DEAD`, `GODMODE`, `slot_back`... are tg's `#define` names, declared in `_defines.d.ts` (tg's file beside each); the build writes the number back. A number a proc writes where tg's own line used no name stays a number.
- **Older spellings** are leftovers a robot couldn't yet rewrite with proof that nothing changes. Both kinds work side by side; write the plain one in new code.
- `rt.rsc("path")` is a file in single quotes in DM, `'icons/obj/gym_equipment.dmi'`.
- `pick(...)` and `prob(p)` are DM's built-ins, as in DM. Most others keep the older spelling: `rt.op(f, "Sqrt", [], [x])` is `sqrt(x)` (the first list holds the constants some take; `rt.op(f, "PickUnweighted", [1], [L])` is the older `pick(L)`).

## The names you'll meet most

| In the code | In DM |
|---|---|
| `truthy(x)` | `x` kept as a true/false value (`a = truthy(b)`). Tests need none: DM's `if(x)` is JavaScript's `if (x)` (false for `0`, `NaN`, `null`, `""`) |
| `a == b`, `a != b` (older: `isEqual(a, b)`, `!isEqual(a, b)`) | the same in DM (no conversions: `null != 0`, `"10" != 10`). `===` and `!==` are JavaScript's |
| `T("/obj/item")` | the type path `/obj/item` |
| `obj.name(args)` (older: `g.callName(f, obj, "name", [args])`) | `obj.name(args)` |
| `this.name(a, b)` (older: `g.srcCall(f, "name", a, b)`) | `name(a, b)` on `src` |
| `get_area(x)` (older: `rt.call(f, P("/proc/get_area"), null, [x])`) | the global proc `get_area(x)` |
| `parent_proc()` (older: `g.callSuper(f, [], rt.Args.Same)`) | `..()` (`parent_proc(a)`: `..(a)`) |
| `x ??= 20;` | a DM argument default: if x is null, it becomes 20 |
| `new_(T("/obj/x"), a, b)`, `yield* new_(...)` when its New() may sleep (older: `g.new_(f, T("/obj/x"), [a, b])`) | `new /obj/x(a, b)` |
| `GLOB.SSair` (older: `rt.gl("SSair")`) | the global `SSair` (tg writes `GLOB.x` for most globals; here every one is) |
| `for (M of each(L, T("/mob"))) {` (older: `rt.forList(f, 0, L, T("/mob")); while (($e = rt.next(f, 0)) !== undefined) { M = $e;` ... `rt.endFor(f, 0);`) | `for(var/mob/M in L)`: the list as it was when the loop began, only mobs (`each(L)`: every item). `M` is a local declared at the top |
| `list(a, b)` (older: `rt.list(a, b)`), `rt.alist(f, [k, v])` | `list(a, b)`, `list(k = v)` |
| `rt.index(L, i)` or `rt.at(L, i)`, `rt.setAt(L, i, v)`, `rt.len(f, L)` (or `L.len`) | `L[i]`, `L[i] = v`, `length(L)`. DM lists count from 1, and `L["key"]` is the value stored under `"key"`, so these stay calls |
| `a + b`, `a < b`, `-a`, `x += v`, `o.x--` | the same in DM. In a proc every arithmetic and comparison operator means DM's: `null + 1` is 1, `L += x` adds x to the list L, a number plus text is a runtime error. Some places keep the older spelling: `add(a, b)`, `subtract`, `multiply`, `divide`, `rt.lt` / `le` / `gt` / `ge`, `rt.neg(a)`, `rt.modify(a, b, add)` (`a += b`), `rt.modSrcVar(f, "x", v, subtract)` (`this.x -= v`), `rt.incField(f, o, "x", -1, true)` (`o.x--`) |
| `rt.bitOr(a, b)`, `rt.bitAnd`, `rt.modify(a, b, rt.bitOr)` | DM's `a \| b`, `a & b`, `a \|= b`: 16 bits, and on lists union and intersection, so they stay calls |
| `rt.worldTime(f)` | `world.time`, in ticks: 10 ticks are 1 second (`Stun(80)` is 8 seconds) |
| `rt.getStep(f, A, dir)`, `rt.isIn(f, x, L)` | `get_step(A, dir)` (dir `0`: A's own turf), `x in L` |

## `function*` and `yield*`

DM procs can `sleep()`, then carry on later while the rest of the game keeps running. JavaScript functions can't stop halfway, but JavaScript *generator* functions can: `function*` marks one, and `yield*` calls another one and passes any pause up the chain. So:

- a proc that may sleep, or calls one that may, is `function*`, and a call in it that can pause has `yield*` in front (`yield* A.attack(user)`, `yield* do_after(user, 50, this)`); one that never can is written plain (`to_chat(user, "Hi")`) and the bundler adds the `yield*` it needs. The bundle stops if a call that can pause has none;
- a proc that never sleeps is a plain `function` and calls without it (`A.powered(chan)`; faster).

In the older spelling the same split is `g.` (can pause, under `yield*`) and `rt.` (can't).

## Changing something small

Say the punching bag should say something when hit. Add one line to the proc above:

```ts
	to_chat(user, "<span class='notice'>Thwack!</span>");
```

Then, from `web/`, `node tools/translate-tg.mjs` compiles the game code and stops on a mistake (`npm test` doesn't compile it), `npm run boot-check -- mytest` boots the game headless and checks nothing broke, and `npm run build:static` builds a copy you can play (see the top [README](../../README.md#running-it)).

## Finding things

Line 1 of each file names the DM file it came from; the `// file.dm:32` above a proc is the DM line it started on.

- Every file is named after the DM file it came from, in the same folders as tg's `code/`. A type lives where tg kept it; types with no procs are in the folder's `types.ts`.
- A new variable gets its default in the type's `rt.type` entry (`recent_throws: null`); a list one is made in the type's `<init>` proc (`this.recent_throws = rt.list();`), as DM's `var/list/x = list()` was.
- Search for the type path in quotes, `"/obj/structure/punching_bag`, to find its type and its procs.
- A var an object inherits sits in a parent's `rt.type` entry, which can be in a surprising file: `grep -rn ', "/mob", "' game/code` finds `/mob`'s (with `lying`) in `_onclick/hud/alert.ts`.
- The engine underneath (what BYOND did: drawing, the scheduler, maps, icons) is in `web/src/`, plain TypeScript.
