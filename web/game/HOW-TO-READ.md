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
rt.type(12972, "/obj/structure/punching_bag", "/obj/structure", {
	name: "punching bag",
	icon: rt.rsc("icons/obj/gym_equipment.dmi"),
	icon_state: "punchingbag",
	...
});

rt.def("/obj/structure/punching_bag/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	rt.call(f, P("/proc/flick"), null, [fmt("＀-punch", [rt.sv(f, "icon_state")]), live(f.src)]);
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.op(f, "PickUnweighted", [1], [rt.fv(f, "hit_sounds", live(f.src))]), 25, 1, -1]);
	return f.dot;
});
```

- `rt.type(id, path, parent, { vars })` declares a type and its default variables, like a DM type block.
- `rt.def(path, function)` defines a proc. The function's first parameter `f` is the call's frame: `f.src` is `src`, `f.usr` is `usr`, `f.dot` is `.` (the default return value). The parameters after `f` are the proc's DM arguments.
- `P("/proc/flick")` names a proc to call; `rt.call(f, P(...), null, [args])` calls a global proc.
- `fmt("＀-punch", [x])` is DM's string with an embedded value, `"[x]-punch"`: each `＀` is one `[...]`.
- `rt.sv(f, "icon_state")` reads a variable of `src`; `rt.fv(f, "loc", obj)` reads `obj.loc`. Writing is `rt.setSv` / `rt.setFv`.
- `rt.rsc("path")` is a file in single quotes in DM, `'icons/obj/gym_equipment.dmi'`.
- `rt.op(f, "PickUnweighted", ...)` is one of DM's built-in operations, here `pick()`.

## The names you'll meet most

| In the code | In DM |
|---|---|
| `live(x)` | `x`, read safely: a deleted object reads as `null`, as in BYOND |
| `truthy(x)` | `if(x)` (DM's idea of true: not `0`, `null` or `""`) |
| `isEqual(a, b)` | `a == b` |
| `T("/obj/item")` | the type path `/obj/item` |
| `g.callName(f, obj, "name", [args])` | `obj.name(args)` |
| `g.srcCall(f, "name", a, b)` | `name(a, b)` on `src` |
| `g.callSuper(f, [args])` | `..(args)` |
| `g.new_(f, T("/obj/x"), [args])` | `new /obj/x(args)` |
| `rt.gl("SSair")` | the global `SSair` |
| `rt.list(a, b)`, `rt.alist(f, [k, v])` | `list(a, b)`, `list(k = v)` |

## `function*` and `yield*`

DM procs can `sleep()`, then carry on later while the rest of the game keeps running. JavaScript functions can't stop halfway, but JavaScript *generator* functions can: `function*` marks one, and `yield*` calls another one and passes any pause up the chain. So:

- a proc that may sleep, or calls one that may, is `function*` and its calls are `yield* g.call(...)`;
- a proc that never sleeps is a plain `function` and calls with `rt.call(...)` (faster).

The `g.` and `rt.` versions of a call do the same thing; `g.` is the one that can pause.

## Changing something small

Say the punching bag should say something when hit. Add one line to the proc above:

```ts
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Thwack!</span>"]);
```

Then, from `web/`, `npm run boot-check -- mytest` boots the game headless and checks nothing broke, and `npm run build:static` builds a copy you can play (see the top [README](../../README.md#running-it)).

## Finding things

- Every file is named after the DM file it came from, in the same folders as tg's `code/`. A type lives where tg kept it; types with no procs are in the folder's `types.ts`.
- Search for the type path in quotes, `"/obj/structure/punching_bag`, to find its type and its procs.
- The engine underneath (what BYOND did: drawing, the scheduler, maps, icons) is in `web/src/`, plain TypeScript.
