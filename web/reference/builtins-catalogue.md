# Built-ins catalogue

Made by a static scan of the OpenDream-compiled bytecode (`tgstation.json`), back when the game still ran
compiled DM. Counts are the number of call/access *sites* in that bytecode, not runtime call frequency. The scan
and the compiler are gone, so this is a record and is not regenerated.

Scanned 25867 decoded procs out of 26346 total (479 native/empty).

## Needed for boot (shortlist)

Native global procs the world-boot and Master Controller init path is likely to hit first,
picked from the category-1 table below by name (not a separate scan). Note: `istype`, `isnull`,
`get_step`, `get_dir` and `locate` normally compile to dedicated opcodes (`IsType`, `IsNull`,
`GetStep`, `GetDir`, `Locate`) rather than proc calls, so their real usage is in the category-3
table, not here -- a 0 below just means "always inlined to an opcode".

| name | count | implemented? |
|---|---|---|
| typesof | 195 | no |
| istype | 0 | no |
| ispath | 132 | yes |
| isnull | 0 | yes |
| isnum | 80 | yes |
| islist | 1 | yes |
| sleep | 609 | no |
| rand | 1144 | no |
| get_step | 0 | no |
| get_dir | 0 | no |
| locate | 0 | no |
| json_decode | 10 | no |
| json_encode | 7 | no |
| file2text | 22 | no |
| fexists | 18 | no |
| text2path | 65 | no |
| params2list | 36 | no |
| list2params | 38 | no |
| CRASH | 63 | no |
| hascall | 6 | no |
| ref | 0 | no |

## 1. Native global proc calls

| name | count | implemented? | phase |
|---|---|---|---|
| rand | 1144 | no | 1 |
| max | 926 | yes | 1 |
| round | 856 | yes | 1 |
| min | 780 | yes | 1 |
| sleep | 609 | no | 1 |
| text2num | 495 | yes | 1 |
| copytext | 343 | yes | 1 |
| isturf | 337 | no | 1 |
| replacetext | 300 | no | 1 |
| alert | 263 | no | 3 |
| ismob | 241 | no | 1 |
| typesof | 195 | no | 1 |
| findtext | 189 | yes | 1 |
| range | 157 | no | 1 |
| turn | 135 | no | 1 |
| ispath | 132 | yes | 1 |
| view | 122 | no | 1 |
| stat | 110 | no | 3 |
| image | 110 | no | 2 |
| flick | 105 | no | 2 |
| matrix | 93 | no | 2 |
| lowertext | 91 | yes | 1 |
| isnum | 80 | yes | 1 |
| sound | 80 | no | 1 |
| splittext | 73 | no | 1 |
| ckey | 71 | no | 3 |
| uppertext | 71 | yes | 1 |
| orange | 70 | no | 1 |
| text2path | 65 | no | 1 |
| html_encode | 64 | no | 1 |
| CRASH | 63 | no | 1 |
| istext | 57 | yes | 1 |
| oview | 56 | no | 1 |
| block | 53 | no | 1 |
| winset | 46 | no | 3 |
| viewers | 46 | no | 1 |
| text2ascii | 42 | no | 1 |
| time2text | 40 | no | 1 |
| list2params | 38 | no | 1 |
| params2list | 36 | no | 1 |
| num2text | 35 | yes | 1 |
| statpanel | 33 | no | 3 |
| ascii2text | 31 | no | 1 |
| walk_to | 28 | no | 1 |
| file | 25 | no | 1 |
| regex | 25 | no | 1 |
| file2text | 22 | no | 1 |
| md5 | 21 | no | 4 |
| fexists | 18 | no | 1 |
| html_decode | 16 | no | 1 |
| walk | 16 | no | 1 |
| icon_states | 14 | no | 2 |
| findtextEx | 14 | yes | 1 |
| isarea | 14 | no | 1 |
| fdel | 11 | no | 1 |
| json_decode | 10 | no | 1 |
| sorttext | 10 | no | 1 |
| url_encode | 9 | no | 1 |
| fcopy_rsc | 8 | no | 1 |
| ckeyEx | 8 | no | 1 |
| json_encode | 7 | no | 1 |
| winexists | 7 | no | 3 |
| isicon | 7 | no | 1 |
| hascall | 6 | no | 1 |
| winget | 6 | no | 3 |
| replacetextEx | 6 | no | 1 |
| cmptext | 6 | no | 1 |
| flist | 5 | no | 1 |
| isfile | 5 | no | 1 |
| text2file | 4 | no | 1 |
| oviewers | 4 | no | 1 |
| fcopy | 3 | no | 1 |
| shell | 3 | no | 4 |
| hearers | 3 | no | 1 |
| ohearers | 3 | no | 1 |
| _dm_db_close | 2 | no | 4 |
| _dm_db_error_msg | 2 | no | 4 |
| isloc | 2 | no | 1 |
| walk_towards | 2 | no | 1 |
| _dm_db_new_con | 1 | no | 4 |
| _dm_db_connect | 1 | no | 4 |
| _dm_db_is_connected | 1 | no | 4 |
| _dm_db_quote | 1 | no | 4 |
| _dm_db_new_query | 1 | no | 4 |
| _dm_db_execute | 1 | no | 4 |
| _dm_db_next_row | 1 | no | 4 |
| _dm_db_rows_affected | 1 | no | 4 |
| _dm_db_row_count | 1 | no | 4 |
| _dm_db_columns | 1 | no | 4 |
| winclone | 1 | no | 3 |
| bounds_dist | 1 | no | 1 |
| roll | 1 | no | 1 |
| get_step_to | 1 | no | 1 |
| islist | 1 | yes | 1 |

## 2. Native method calls on built-in types

Method name only: `obj.Method()` bytecode doesn't carry the receiver's static type, so "owner(s)"
lists every built-in type that declares a native of that name (from `native-procs.ts`); a call site
may target any one of them, or (if none listed matches its actual receiver) not be a native call at all.

| name | owner(s) | count | implemented? | phase |
|---|---|---|---|---|
| Remove | /alist, /list | 269 | yes | 1 |
| Add | /alist, /database/query, /list, /matrix | 251 | yes | 1 |
| Copy | /alist, /list | 206 | yes | 1 |
| Cut | /alist, /list | 174 | yes | 1 |
| Find | /alist, /list, /regex | 133 | yes | 1 |
| Insert | /alist, /icon, /list | 69 | yes | 2 |
| NextRow | /database/query | 60 | no | 1 |
| Blend | /icon | 49 | no | 2 |
| Join | /alist, /list | 37 | yes | 1 |
| Height | /icon | 36 | no | 2 |
| Execute | /database/query | 35 | no | 1 |
| Replace | /regex | 23 | no | 1 |
| Topic | /datum, /world | 21 | no | 1 |
| Turn | /icon, /matrix, /vector | 18 | no | 2 |
| Swap | /alist, /list | 17 | yes | 1 |
| Translate | /matrix | 17 | no | 1 |
| SetConfig | /world | 15 | no | 1 |
| Crossed | /atom | 15 | no | 1 |
| Scale | /icon, /matrix | 14 | no | 2 |
| Bump | /atom/movable | 12 | no | 1 |
| MapColors | /icon | 10 | no | 2 |
| Reset | /database/query | 9 | no | 1 |
| Width | /icon | 9 | no | 2 |
| Entered | /atom | 9 | no | 1 |
| Reboot | /world | 8 | no | 1 |
| Click | /atom | 8 | no | 1 |
| GetConfig | /world | 7 | no | 1 |
| Close | /database, /database/query | 7 | no | 1 |
| Crop | /icon | 7 | no | 2 |
| Shift | /icon | 6 | no | 2 |
| MouseDrop | /atom | 5 | no | 1 |
| Export | /client, /world | 4 | no | 4 |
| Exited | /atom | 4 | no | 1 |
| SwapColor | /icon | 4 | no | 2 |
| ErrorMsg | /database, /database/query | 3 | no | 1 |
| Flush | /savefile | 3 | no | 1 |
| DrawBox | /icon | 3 | no | 2 |
| GetPixel | /icon | 3 | no | 2 |
| Open | /database | 3 | no | 1 |
| Uncrossed | /atom | 3 | no | 1 |
| Cross | /vector | 3 | no | 1 |
| SetScores | /world | 2 | no | 4 |
| Flip | /icon | 2 | no | 2 |
| Columns | /database/query | 1 | no | 1 |
| New | /alist, /database, /database/query, /datum, /icon, /image, /list, /matrix, /pixloc, /savefile, /vector, /world | 1 | yes | 1 |
| ExportText | /savefile | 1 | no | 4 |
| SetMedal | /world | 1 | no | 4 |
| GetScores | /world | 1 | no | 4 |
| GetMedal | /world | 1 | no | 4 |
| ClearMedal | /world | 1 | no | 4 |
| SetIntensity | /icon | 1 | no | 2 |
| Stat | /atom | 1 | no | 1 |
| DblClick | /atom | 1 | no | 1 |
| MouseDown | /atom | 1 | no | 1 |
| MouseDrag | /atom | 1 | no | 1 |
| MouseEntered | /atom | 1 | no | 1 |
| MouseExited | /atom | 1 | no | 1 |
| MouseMove | /atom | 1 | no | 1 |
| MouseUp | /atom | 1 | no | 1 |
| MouseWheel | /atom | 1 | no | 1 |

## 3. Opcodes used

| opcode | count | implemented? |
|---|---|---|
| PushReferenceValue | 99310 | yes |
| Call | 59011 | yes |
| Pop | 55039 | yes |
| JumpIfFalse | 43153 | yes |
| AssignNoPush | 41568 | yes |
| PushRefAndDereferenceField | 34947 | yes |
| PushFloat | 31843 | yes |
| PushString | 29003 | yes |
| Jump | 25522 | yes |
| PushNRefs | 25210 | yes |
| DereferenceCall | 21202 | yes |
| FormatString | 16494 | yes |
| PushType | 14871 | yes |
| BooleanNot | 14857 | yes |
| PushNull | 12485 | yes |
| PushFloatAssign | 11126 | yes |
| ReturnReferenceValue | 10710 | yes |
| AppendNoPush | 9446 | yes |
| NullRef | 9166 | yes |
| Assign | 8744 | yes |
| JumpIfReferenceFalse | 7997 | yes |
| BooleanAnd | 7529 | yes |
| CreateObject | 7044 | yes |
| ReturnFloat | 6416 | yes |
| IsTypeDirect | 5958 | yes |
| CompareEquals | 5469 | yes |
| Enumerate | 5409 | yes |
| DestroyEnumerator | 5409 | yes |
| PushNFloats | 5320 | yes |
| CreateList | 5171 | yes |
| DereferenceField | 5063 | yes |
| BooleanOr | 4824 | yes |
| CreateAssociativeList | 4377 | yes |
| DereferenceIndex | 4371 | yes |
| Return | 4104 | yes |
| IsNull | 3703 | yes |
| SwitchOnString | 3238 | yes |
| CreateFilteredListEnumerator | 2942 | yes |
| SwitchOnFloat | 2880 | yes |
| PushNStrings | 2837 | yes |
| PushStringFloat | 2799 | yes |
| PushResource | 2773 | yes |
| IndexRefWithString | 2615 | yes |
| Multiply | 2590 | yes |
| Add | 2509 | yes |
| PushNOfStringFloats | 2474 | yes |
| GetStep | 2360 | NO |
| CompareGreaterThan | 2244 | yes |
| Subtract | 2092 | yes |
| CompareNotEquals | 2042 | yes |
| CreateListEnumerator | 2012 | yes |
| BitAnd | 1790 | yes |
| CompareLessThan | 1667 | yes |
| Remove | 1585 | yes |
| Prob | 1548 | NO |
| PickUnweighted | 1431 | yes |
| Divide | 1342 | yes |
| IsInList | 1315 | yes |
| Initial | 1097 | yes |
| Increment | 1042 | yes |
| CompareLessThanOrEqual | 1035 | yes |
| CreateListNStrings | 1005 | yes |
| CompareGreaterThanOrEqual | 1002 | yes |
| PushProc | 947 | yes |
| Combine | 727 | yes |
| Locate | 625 | yes |
| NPushFloatAssign | 553 | yes |
| Prompt | 541 | NO |
| SwitchCaseRange | 537 | yes |
| CreateRangeEnumerator | 452 | yes |
| Length | 379 | yes |
| CreateListNFloats | 378 | yes |
| Decrement | 368 | yes |
| OutputReference | 282 | NO |
| Spawn | 260 | NO |
| Browse | 240 | NO |
| Negate | 229 | yes |
| LocateCoord | 222 | NO |
| Animate | 201 | NO |
| GetDir | 200 | NO |
| Mask | 166 | yes |
| Append | 153 | yes |
| MultiplyReference | 149 | yes |
| Modulus | 142 | yes |
| Abs | 139 | yes |
| PreIncrement | 133 | yes |
| IsType | 131 | yes |
| BitOr | 103 | yes |
| Input | 99 | NO |
| PreDecrement | 68 | yes |
| Sqrt | 59 | yes |
| Power | 53 | yes |
| BitXorReference | 52 | yes |
| CallStatement | 51 | yes |
| BrowseResource | 48 | NO |
| Rgb | 43 | NO |
| PushNResources | 39 | yes |
| BitNot | 37 | yes |
| CreateMultidimensionalList | 37 | yes |
| DivideReference | 33 | yes |
| Throw | 30 | yes |
| CreateListNRefs | 29 | yes |
| BitXor | 27 | yes |
| BitShiftLeft | 24 | yes |
| BitShiftRight | 23 | yes |
| CreateListNResources | 22 | yes |
| Cos | 20 | yes |
| Sin | 19 | yes |
| PickWeighted | 17 | yes |
| OutputControl | 14 | NO |
| SwitchCase | 12 | yes |
| Link | 11 | NO |
| DeleteObject | 10 | yes |
| ModulusReference | 10 | yes |
| EndTry | 8 | NO |
| IsInRange | 6 | NO |
| Try | 6 | NO |
| LogE | 4 | yes |
| JumpIfNullNoPop | 4 | yes |
| Ftp | 3 | NO |
| CreateTypeEnumerator | 3 | yes |
| Log | 2 | yes |
| ArcCos | 2 | yes |
| ArcSin | 2 | yes |
| TryNoValue | 2 | NO |
| BitShiftRightReference | 1 | yes |
| ArcTan | 1 | yes |
| Output | 1 | NO |
| BitShiftLeftReference | 1 | yes |

## 4. Built-in var access (world/client/atom/mob/appearance/...)

Matched against a curated BYOND-511 var whitelist per bucket (see `buildVarBuckets` in the scanner);
`/matrix`, `/regex`, `/savefile`, `/database`, `/sound`, `/icon`, `/image`, `/mutable_appearance` and
`/list` use their JSON own-declared var list directly, since tg doesn't extend those types.
Counts include both reads and writes (the bytecode doesn't always distinguish cheaply); a name can be
read on an unrelated object with a coincidentally identical field name, so treat this as a ceiling.
A bucket like `atom/appearance|/sound` means the name (e.g. `len`) is ambiguous between buckets --
the count is real but the split between them is not known statically.

| bucket | name | count | phase |
|---|---|---|---|
| atom/appearance|/image | loc | 4287 | 1 |
| world|atom/appearance|/regex|/savefile|/image | name | 2686 | 1 |
| /sound|/list | len | 2314 | 1 |
| atom/appearance|/image | icon_state | 2255 | 1 |
| mob | stat | 1485 | 3 |
| mob | client | 1425 | 1 |
| world | time | 1038 | 1 |
| atom/appearance|/sound|/image | z | 852 | 1 |
| atom/appearance|/sound|/image | x | 739 | 1 |
| atom/appearance|/sound|/image | y | 717 | 1 |
| atom/appearance|/savefile|/image | dir | 493 | 1 |
| /list | type | 472 | 1 |
| world|/image | contents | 438 | 1 |
| world|atom/appearance|/icon|/image | icon | 437 | 1 |
| client | key | 407 | 3 |
| /regex | flags | 367 | 1 |
| atom/appearance|/image | desc | 355 | 1 |
| atom/appearance|/image | density | 347 | 1 |
| client | screen | 341 | 3 |
| client | ckey | 329 | 3 |
| atom/appearance|/image | pixel_y | 321 | 2 |
| atom/appearance|/image | color | 276 | 2 |
| atom/appearance|/image | pixel_x | 257 | 2 |
| atom/appearance|/mutable_appearance | screen_loc | 237 | 2 |
| world|client | mob | 234 | 1 |
| world | tick_usage | 223 | 1 |
| /sound | volume | 215 | 1 |
| atom/appearance|/image | layer | 186 | 2 |
| world|/sound | status | 170 | 1 |
| atom/appearance|/image | gender | 150 | 1 |
| /sound | frequency | 125 | 1 |
| client|/image | verbs | 109 | 1 |
| atom/appearance|/image | invisibility | 105 | 2 |
| world | vars | 102 | 1 |
| atom/appearance|/sound|/image | transform | 102 | 2 |
| world | host | 91 | 1 |
| atom/appearance|/image | alpha | 90 | 2 |
| world | timeofday | 89 | 1 |
| world | maxx | 89 | 1 |
| world | maxy | 85 | 1 |
| client | images | 75 | 1 |
| atom/appearance|/image | plane | 73 | 2 |
| world|client | view | 72 | 1 |
| client | eye | 68 | 3 |
| world | cpu | 61 | 1 |
| world|client | tick_lag | 55 | 1 |
| /sound | channel | 55 | 1 |
| world | area | 45 | 1 |
| atom/appearance|/image | maptext | 39 | 2 |
| /sound | wait | 36 | 1 |
| /savefile | cd | 36 | 1 |
| atom/appearance|/image | overlays | 33 | 2 |
| atom/appearance|/image | appearance | 31 | 2 |
| atom/appearance|/image | underlays | 31 | 2 |
| mob | sight | 28 | 1 |
| /regex | next | 27 | 1 |
| mob | see_invisible | 26 | 1 |
| world | realtime | 25 | 1 |
| world|client | address | 25 | 1 |
| /sound | priority | 24 | 1 |
| atom/appearance|/image | mouse_opacity | 24 | 1 |
| atom/appearance|/image | filters | 24 | 1 |
| /regex | group | 23 | 1 |
| atom/appearance|/image | opacity | 23 | 1 |
| /image | override | 21 | 1 |
| world|client | fps | 20 | 1 |
| atom/appearance|/image | appearance_flags | 20 | 1 |
| world | log | 19 | 1 |
| /regex|/image | text | 19 | 1 |
| client | computer_id | 16 | 1 |
| /sound | file | 15 | 1 |
| atom/appearance|/image | luminosity | 13 | 1 |
| /regex | index | 13 | 1 |
| /sound | repeat | 13 | 1 |
| world | maxz | 12 | 1 |
| world|client | byond_version | 10 | 1 |
| client | perspective | 10 | 1 |
| client | mouse_pointer_icon | 10 | 3 |
| /matrix | f | 9 | 1 |
| /image | visibility | 7 | 1 |
| atom/appearance|/image | blend_mode | 7 | 2 |
| atom/appearance|/image | pixel_z | 7 | 1 |
| world | port | 5 | 1 |
| client | inactivity | 5 | 1 |
| atom/appearance|/image | suffix | 5 | 1 |
| /sound | offset | 4 | 1 |
| client | connection | 4 | 1 |
| /matrix | b | 4 | 1 |
| /matrix | d | 4 | 1 |
| atom/appearance|/image | maptext_width | 3 | 1 |
| world | system_type | 3 | 1 |
| /matrix | c | 3 | 1 |
| atom/appearance|/mutable_appearance | animate_movement | 2 | 1 |
| /matrix | a | 2 | 1 |
| /matrix | e | 2 | 1 |
| world | turf | 2 | 1 |
| world|/sound | params | 1 | 1 |
| world | sleep_offline | 1 | 1 |
| world | url | 1 | 1 |
| atom/appearance|/image | maptext_height | 1 | 1 |
| /savefile | eof | 1 | 1 |
| client | control_freak | 1 | 1 |
| client | statpanel | 1 | 3 |
| /sound | falloff | 1 | 1 |
| /regex | match | 1 | 1 |

