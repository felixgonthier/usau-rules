import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import rulesEn from "./data/rules_en.json";
import rulesFr from "./data/rules_fr.json";

const RULES_DBS = { en: rulesEn, fr: rulesFr };

// ─── Legacy hardcoded DB kept as fallback (replaced by PDF-extracted JSON) ───
const RULES_DB_LEGACY = [
{id:"intro", title:"Introduction", keywords:["introduction","description","ultimate","non-contact","self-officiated","seven players","event organizer clause","captain's clause"],
text:`1.A. Description: Ultimate is a non-contact, self-officiated disc sport played by two teams of seven players. The object of the game is to score goals. A goal is scored when a player catches any legal pass in the end zone that player is attacking. A player may not run while holding the disc. The disc is advanced by passing it to other players. The disc may be passed in any direction. Any time a pass is incomplete, a turnover occurs, resulting in an immediate change of the team in possession of the disc.
1.B. Rules Variations: 1.B.2. Event Organizer Clause: The event organizer may modify rules relating to game logistics (game total, time caps, halftime length, timeouts, uniform requirements, observer operations). 1.B.3. Captain's Clause: For games not subject to the event organizer clause, a game may be played under any variation agreed upon by captains.
1.C. General vs. Specific Rules: Many rules are general. Some cover specific situations and override the general case.`},

{id:"spirit", title:"Spirit of the Game", keywords:["spirit","sotg","spirit of the game","fair play","self-officiate","bias","retract","dispute","spirit captain","spirit timeout","sportsmanship","respect"],
text:`2.A. Spirit of the Game places responsibility for fair play on the player. Highly competitive play is encouraged, but never at the expense of: mutual respect among competitors, adherence to the agreed upon rules, and the basic joy of play.
2.B. All players are responsible for knowing, administering, and adhering to the rules.
2.C. No harsh penalties for inadvertent infractions. An intentional infraction is cheating. Players are obligated to abide by rules and not gain advantage by knowingly committing an infraction, or calling one where none exists. 2.C.1. If a player intentionally or flagrantly violates the rules, captains should discuss and determine appropriate outcome. 2.C.2. Captains or coaches may remove players from the game for misconduct.
2.D. Players must: know rules; make calls only where significant; be fair-minded and objective; be truthful; explain viewpoint clearly and concisely; allow opponents to speak; listen to opponent's viewpoint; treat opponents with consideration; resolve disputes efficiently; make calls consistently; acknowledge potential bias. Discussions should not exceed 30 seconds before reaching resolution or requesting observer.
2.E. Good spirit examples: playing safely; ensuring rule knowledge; bringing up spirit issues early; spirit captain meetings; informing teammates of wrong calls; retracting calls made in error; acknowledging good plays.
2.F. Spirit violations: reckless play; intentional fouling; taunting; negative celebration toward opponent; intentionally damaging equipment; intentional interference by non-player with in-play disc; retaliatory calls; allowing bias to affect judgment.
2.G. Teams must teach rules, hold members accountable, provide constructive feedback, be aware of implicit biases.
2.H. Experienced players must explain rules to novice players who commit infractions out of ignorance.
2.I. Rules interpreted by players directly involved or with best perspective. Sideline players should not interject unless requested. Coaches may clarify rules if asked but may not make calls.`},

{id:"definitions", title:"Definitions", keywords:["definition","best perspective","foul","ground contact","guarding","incidental contact","legal position","line","pivot","possession","pull","scoring attempt","state of disc","in play","live","dead","stoppage","throw","pass","thrower","violation","marker","captain","coach","defender","offensive","observer","spirit captain","simultaneous catch"],
text:`3.A. Best perspective: Most complete view available by a player including relative positions of disc, ground, players, and line markers. Players may seek sideline perspective to clarify rules/assist calls. Players may seek coach perspective to clarify rules only. Players may review officially-designated video footage (but may not delay play).
3.B. Foul: Non-incidental contact between opposing players. In general, the player initiating contact has committed the foul.
3.C. Ground contact: All player contact with the ground directly related to a specific event (jumping, diving, leaning, falling), including landing or recovering. Items on the ground are part of the ground (4.A.1).
3.D. Guarding: A defender is guarding an offensive player when within 10 feet and reacting to that player. A defender who turns away and focuses on the thrower is no longer guarding that player.
3.E. Incidental contact: Contact between opposing players that does not affect continued play.
3.F. Legal position: A marker position that does not violate marking rules in Section 16 (sufficient space from thrower's torso, not straddling pivot, arms not wrapping).
3.G. Line: A boundary defining playing areas. On unlined field, imaginary line between field markers.
3.H. Pivot: The part of the body in continuous contact with a single spot during a thrower's possession once stopped or attempted a throw/fake. An infinitesimally small point on the body.
3.I. Possession: Sustained contact with, and control of, a non-spinning disc. 3.I.1. Catching = establishing possession. 3.I.2. If player loses possession during movement related to catch, initial possession ends (disc touching ground while in possession is not a turnover). 3.I.3. Thrower's possession ends when no longer in contact with disc. 3.I.4. Disc in possession is part of player (hitting disc in possession is a foul). 3.I.5. Team in possession = team whose player has possession or may pick up disc. During flight after legal pass, thrower's team has possession. 3.I.6. Simultaneous catch by offense and defense: offense retains possession.
3.J. Pull: The throw from one team to the other that starts play at beginning of half or after goal. Not a legal pass for scoring. Pulling team may designate new puller before pull.
3.K. Scoring attempt: Starts at beginning of game or when previous goal scored, ends when next goal scored.
3.L. State of disc: 3.L.1. "In play": players may move, play proceeds without defense acknowledgment. In-bounds disc in central zone is in play. Subject to turnover. Any offensive player may become thrower. Must establish pivot before passing. 3.L.2. "Live": players may move, subject to turnover, but thrower cannot make legal pass (e.g., walking to spot). Must establish pivot and touch disc to ground. 3.L.3. "Dead": play stopped, can continue only with check. Not subject to turnover.
3.M. Stoppage of play: Any halting due to call, discussion, or timeout requiring check. Play-halting calls: "foul," "violation," "pick," "stall," etc.
3.N. Throw: Disc in flight following throwing motion (including fake) resulting in thrower losing contact. 3.N.1. Pass = throw (interchangeable). 3.N.2. Intentionally dropped disc = thrown disc. Accidentally dropped (falling, non-spinning) disc is NOT a throw. 3.N.3. Accidentally released spinning flying disc IS a throw. 3.N.4. Act of throwing = motion transferring momentum to disc. Pivots and wind-ups are NOT part of act of throwing. 3.N.5. Throw is complete when catch results in team retaining possession. Throw not complete = incomplete.
3.O. Thrower: Offensive player in possession of, or who has most recently possessed, the disc. 3.O.1. Player becomes thrower immediately upon establishing possession of a catch.
3.P. Violation: Any infraction other than a foul.
3.Q. Roles: Captain (3.Q.1), Coach (3.Q.2, may clarify rules if asked, cannot make calls), Defender (3.Q.3, cannot pick up live/in-play disc or call for pass), Event organizer (3.Q.4), Marker (3.Q.6, defensive player within 10 feet of thrower's pivot), Observer (3.Q.8), Offensive player (3.Q.9), Player (3.Q.10, up to 14 per point), Sideline player (3.Q.11), Spirit captain (3.Q.13).`},

{id:"field", title:"Playing Field", keywords:["field","end zone","goal line","central zone","brick","sideline","backline","perimeter","cone","pylon","obstruction","equipment line","team line","midfield"],
text:`4.A. Playing field is rectangular, flat, free of obstructions, reasonable player safety. Grass recommended, all lines marked. 4.A.1. Grass and items on ground are part of ground.
4.B. Standard dimensions in Appendix A.
4.C. Bounded by four perimeter lines: two sidelines (length) and two backlines (width). Perimeter lines are NOT part of the playing field.
4.D. Two goal lines parallel to backlines. End zones: areas bounded by backline, sidelines, and nearest goal line.
4.E. Central zone: playing field excluding end zones.
4.F. Goal lines separate central zone from end zones and are PART OF THE CENTRAL ZONE (not end zones).
4.G. Brick marks in central zone at set distance from each goal line, midway between sidelines. Reverse brick marks in each end zone midway between goal line and backline. Midfield mark midway between goal lines.
4.J. Obstruction within 5 yards of or on the playing field by sideline players, non-players, or objects: any physically obstructed player or thrower may call violation. Stall count resumes at count reached plus 1, or 9 if over 8.`},

{id:"equipment", title:"Equipment", keywords:["equipment","disc","cleats","clothing","uniform","jersey","amplifier","electronic","cast","brace","protective","spike"],
text:`5.A. USA Ultimate-approved disc for sanctioned play. In unsanctioned play, any disc acceptable under Event Organizer and Captain's Clauses.
5.B. Players may wear any soft clothing that does not endanger others or provide unfair advantage.
5.C. Players may wear casts, guards, braces, or similar protective medical equipment. Hard or sharp materials must be sufficiently covered and padded.
5.D. Player's clothing, shoes, and accessories are considered part of the player.
5.E. No metallic baseball cleats, track spikes, or worn/broken studs with sharp edges.
5.F. Each player must wear clothing distinguishing them from other team. Matching uniforms and numbered jerseys recommended in tournament play.
5.G. No clothing or equipment to unfairly inhibit or assist disc or player movement.
5.H. No misusing game equipment in manner likely to cause damage (kicking field markers, spiking disc to alter flight).
5.I. No acoustic amplifiers or electronic communication devices for players. Medically necessary devices exempt. Non-playing team members may communicate electronically.`},

{id:"game_structure", title:"Game Structure", keywords:["game total","halftime","cap","soft cap","hard cap","halftime cap","time cap","score","length","game structure","15","start of game","flip"],
text:`6.A. Start of game: 6.A.1. Representatives fairly determine which team chooses to receive/throw initial pull or which end zone to defend. 6.A.2. Other team gets remaining choice. 6.A.3. Second half reverses initial choices. 6.A.4. If one team fails to signal readiness for scheduled start, opposing team may be awarded goals at one per five minutes.
6.B. Game total: predetermined number of goals to win. Game played until one team first reaches game total. 6.B.1. Standard game total = 15.
6.C. Halftime target: minimum goals to reach or exceed half of game total. Halftime begins when one team's score reaches halftime target. In game to 15, halftime target = 8. 6.C.1. Standard halftime = 7 minutes. At end of halftime, standard time between pulls (9.L) begins.
6.D. Time Caps: 6.D.1. Soft cap: predetermined time elapsed. Complete current scoring attempt. If game total not reached, add 1 to higher score = new game total. If during halftime, new total = higher score + 1. 6.D.2. Hard cap: predetermined time elapsed. Complete current scoring attempt. If tied, play one more goal. Otherwise game ends, most goals wins. If during halftime, game over, higher score wins. 6.D.3. Halftime cap: similar to soft cap for halftime target. 6.D.4. If discussion results in goal being awarded, scoring attempt completed at time of goal-scoring catch, not after discussion.`},

{id:"timeouts", title:"Timeouts", keywords:["timeout","team timeout","injury timeout","technical timeout","spirit timeout","70 seconds","T formation","no timeouts","bleeding","wound","dangerous condition","broken disc"],
text:`7.A. Timeout stops play and suspends time limit counts.
7.B. Team Timeout: 2 per half (standard). 70 seconds. 7.B.2. Any player, sideline player, or coach may call between points (after goal, before both teams signal readiness). Readiness signals are reset. Cannot call between re-pull call and ensuing pull. 7.B.3. During play: only thrower with possession that survived all ground contact. Form T with hand and disc, say "timeout." Timeout begins when T formed. Disc placed at pivot spot. 7.B.4. Restarting: All players must return unless injury timeout also called. Offense sets up by end of timeout. Defense has 90 sec or 20 sec after offense sets (whichever longer) to check in. Count resumes at last number +1 or 9 if over 8. 7.B.4.d. If time limits exceeded: other team may announce "delay of game" and self-check (warnings at 20, 10, 5 seconds). 7.B.5. No timeouts remaining: play stops, stall count +3. If results in 10+, turnover.
7.C. Injury Timeout: 7.C.1. Any player on injured player's team may call. 7.C.2. Retroactive to time of injury (unless injured player continued play, then begins at call). If disc in air/act of throwing, begins when play completed. 7.C.2.a. Serious injury: captains may agree to resolve/restart play in any appropriate manner. 7.C.3. Restarting: replacing player takes possession if thrower leaves. Count resumes at last number +1 or 9 if over 8. Players resume locations at time of timeout (no setup). 7.C.4. If injury NOT caused by contact with opponent: injured player must be substituted OR team forfeits a timeout by announcing it prior to restart. If no announcement made, opposing team cannot retroactively charge timeout. 7.C.7. Bleeding/open wound: timeout takes effect when called (not retroactive). 70 seconds to effectively cover wound. If not covered in 70 sec: replace player or call team timeout.
7.D. Technical Timeout: dangerous condition, illegal equipment, broken disc. 7.D.1. Any player may call "technical" for dangerous condition. Thrower may call for cracked/torn/gouged/creased/punctured disc (not warped/wet/dirty). 7.D.1.a. If dangerous condition discovered during throw: disc returned to thrower unless both teams agree ceasing play didn't affect outcome. 7.D.4. Count resumes: if called during stoppage = appropriate count; if stopped play = count +1, or 6 if over 5.
7.E. Spirit Timeout: Called by spirit captain(s) when play dangerous or repeated SOTG violations causing conflict. 7.E.1. Conditions: both spirit captains discussed violations and adjustments; discussed need for timeout; play is stopped; in observed games, communicated to observers. 7.E.2. 5 minutes target. No tactical discussions. One circle (default) or two circles format. 7.E.3. Resumes like team timeout. Doesn't affect available timeouts. Time added to game clock (up to 5 min automatically).
7.F. Injury, technical, spirit timeouts exclusively for their purpose. Cannot use as team timeouts unless also calling team timeout.`},

{id:"substitutions", title:"Player Substitutions", keywords:["substitution","sub","replace","injured","illegal equipment","misconduct","personnel"],
text:`8.A. Substitutions only: 8.A.1. after a goal and before substituting team signals readiness; or 8.A.2. to replace injured players, illegal equipment, incorrect personnel violation (9.D.1), or misconduct removal. Opposing team may substitute like number or fewer.
8.B. No substitutions after re-pull call unless per 8.A.2.`},

{id:"pull", title:"The Pull", keywords:["pull","offsides","false start","brick","middle","midfield","receiving team","pulling team","re-pull","pull violation","OB","out of bounds pull","catch pull","drop pull","time between pulls"],
text:`9.B. Play starts each half and after each goal with a pull.
9.C. After goal, teams switch direction, scoring team pulls.
9.D. Pull made only after puller and receiving player both raise hands signaling readiness. Min 2, max 7 players to signal. Pull occurs when puller throws after signaling. Players may not signal until all other team members off field. 9.D.1. If pulled and team has >7 players or incorrect mixed ratio: all players must call violation ASAP. Team in violation removes/substitutes. Other team may substitute equal number. Other team chooses re-pull or team-timeout restart with stall per 15.F.1. If after goal scored, other team may nullify goal and re-pull.
9.E. Positioning: 9.E.1. Pulling team: anywhere in their end zone, feet may not break goal line plane until disc released. 9.E.2. Receiving team: one foot on defending goal line, no changing relative position. 9.E.3. After release: in play, any player may move any direction.
9.E.4. Pull violations: Offsides and false starts accumulate together as "pull violations." Offsides: receiving team calls before gaining possession. False start: pulling team calls before receiving team gains possession. Do not immediately stop play. Continuation Rule does not apply. Contested offsides = stoppage + re-pull. 9.E.4.b. 1st pull violation by pulling team: receiving team may take disc at brick mark (let disc hit ground untouched). 9.E.4.c. Subsequent pull violations by pulling team: receiving team may take disc at midfield. 9.E.4.d. False start: play stops after pull outcome. Resumes like team timeout. Offense goes to appropriate spot. 10 sec to set up. Defense 20 sec to check in. 9.E.4.e. If pulling team offsides AND receiving team false starts: offense puts disc at offsides spot but may not pass until checked in.
9.F. Pulling team may not touch pull in air before receiving team touches. Violation = receiving team may request re-pull.
9.G. Pull hits ground untouched: 9.G.1. Hits and remains in-bounds: in play where it stops. 9.G.2. Hits in-bounds then goes OB before receiving team touches: put in play at nearest central zone spot to where it first crossed perimeter. 9.G.3. Hits in-bounds then goes OB after receiving team touches: nearest playing field spot to where it crossed perimeter. 9.G.4. Initially hits OB: receiving team may put in play at spot per 11.H, OR signal brick (hand overhead, call "brick") to take at brick mark closest to defending end zone, OR signal middle (hand overhead, call "middle") to take at long axis spot nearest to 11.H spot.
9.H. Pull caught on playing field: in play where caught. Caught outside: nearest playing field spot.
9.I. If receiving team touches pull before it hits ground and disc then hits ground: dropped disc, turnover.
9.J. Player who takes possession must put it into play. If dropped while carrying to spot: turnover at nearest central zone spot to drop.
9.K. No stoppage when putting pull into play. If disc must be put in play at different location: disc is live, must touch disc to ground after establishing pivot before passing.
9.L. Time between pulls: 9.L.1. If dispute around goal, timer begins after resolution. 9.L.2. 50 sec: receiving team lines up (one foot on goal line, visible, no changing positions). 9.L.3. 60 sec: receiving team signals readiness. 9.L.4. Pull released before latest of: 80 sec after goal, 30 sec after lineup, 20 sec after readiness. 9.L.5. Re-pull: receiving team signals within 20 sec; pull released before later of 40 sec or 20 sec after readiness. 9.L.6. Observer time violations: first = warning, then = team timeout charged. No timeouts: receiving team violation = disc at midpoint of defending end zone; pulling team violation = disc at midfield.`},

{id:"restarting", title:"Restarting and Continuing Play", keywords:["restart","check","self-check","delay of game","disc in","3-2-1","pre-stall","pick up disc","10 seconds","20 seconds","put into play","touch ground","dead disc","live disc"],
text:`10.A. All players must avoid delay when starting, restarting, or continuing play. Includes standing over disc or taking more time than reasonably necessary.
10.B. If disc on ground (in or OB), any member of team becoming offense may take possession. 10.B.1. If offensive player picks up live/in-play disc, must put it into play. 10.B.2. If possession gained at spot where disc is in play, must establish pivot at spot of disc. 10.B.3. Central zone disc: 10 seconds to pick up after it comes to rest. After 10 sec, defender within 10 feet may announce "disc in" and start stall count (only if audible warnings given at 10 and 5 seconds = pre-stall). 10.B.4. OB or end zone disc: 20 seconds. 10.B.4.a. OB disc not retrievable quickly: replacement disc may be introduced (confirm with opponent, raise overhead, announce "new disc"). 10.B.4.b. End zone: after 20 sec, defender within 10 feet may announce "disc in" (warnings at 20, 10, 5 sec). 10.B.4.c. OB: after 20 sec, defender within 10 feet of put-into-play spot may announce "disc in" (warnings at 20, 10, 5 sec). 10.B.4.d. Non-playing offense may retrieve live discs outside team lines but cannot cause turnover.
10.B.5. Delay of game warning: defender within 10 feet announces "delay of game" and counts 3-2-1-0 at 1-sec intervals. If behavior stops before "zero": marker initiates stall normally. If not stopped: marker announces "disc in" and starts stall regardless of offense actions.
10.C. Live disc put into play: thrower establishes pivot at appropriate spot and touches disc to ground.
10.D. Dead disc: 10.D.1. When play stops, each player must stop ASAP. Before restarting, all assume locations specified by the covering rule. 10.D.2. If infraction called during stoppage: subsequent play negated, players resume appropriate locations. Does not alter stall count. 10.D.3. Check: player in possession offers disc to marker. Marker announces "3-2-1," touches disc, announces "disc in." If thrower passes before marker touches disc: pass doesn't count, thrower regains possession. 10.D.3.a. Stall count resumes per 15.F. 10.D.4. Offensive self-check: no defender near enough to touch disc. Defense acknowledges readiness. Thrower establishes pivot, announces "3-2-1," touches disc to ground, announces "disc in." 10.D.5. Defensive self-check: no offensive player at appropriate spot. Disc placed at spot. Offense acknowledges readiness. Nearest defender announces "3-2-1 disc in."`},

{id:"in_out_bounds", title:"In- and Out-of-bounds", keywords:["in bounds","out of bounds","OB","perimeter","airborne","momentum","force out","force-out","pivot out of bounds","crossing"],
text:`11.A. Entire playing field is in-bounds. Perimeter lines are NOT part of playing field and are OB.
11.B. OB area: ground not in-bounds and everything in contact with it except players. Non-players other than observers are part of OB area.
11.C. Player contacting OB is OB. Player not OB is in-bounds. Airborne player retains status until contacting playing field or OB area. Exceptions: 11.C.1. Momentum exception: if momentum carries player OB after landing in-bounds with possession of in-bounds disc, player is considered in-bounds. First point of ground contact must be completely in-bounds. Disc put into play at edge where player first went OB. If traversed attacking end zone, 12.B applies. 11.C.2. Thrower who has established pivot may contact OB while pivoting and is considered in-bounds while in possession. 11.C.3. Contact between players does not confer in/OB status. 11.C.4. Force-out foul: player catches in-bounds disc, would have landed in-bounds, but lands on opponent causing first ground contact to be OB. Treated as force-out foul (20.E.2.d). Cannot be construed as dangerous play.
11.D. Disc becomes in-bounds when put into play or when play starts/restarts.
11.E. Disc becomes OB when it first contacts OB area, contacts OB offensive player, or is caught by OB defensive player.
11.F. Disc may fly outside perimeter and return. Players may go OB to make play on disc.
11.G. In-bounds defender gains possession while airborne and becomes OB while still in possession: treated as if defender was OB when possession gained.
11.H. After disc becomes OB: put into play at nearest central zone spot to where most recent of: 11.H.1. disc completely crossed inside of perimeter line; 11.H.2. disc contacted in-bounds player; 11.H.3. disc contacted defensive player; or 11.H.4. disc became OB while any part was inside perimeter. Then establish pivot and touch disc to ground.
11.I. Events after disc becomes OB do not affect where it is put into play.`},

{id:"end_zone", title:"End Zone Possession", keywords:["end zone","defending end zone","attacking end zone","goal line","carry to goal line","turnover in end zone"],
text:`12.A. Turnover results in possession in defending end zone: player must immediately either: 12.A.1. establish pivot at spot of disc (faking or pausing commits player to that spot); or 12.A.2. carry disc directly to closest goal line point and put into play there. May carry at any speed. Failure = travel. Must put in play at spot of disc or on goal line, not in between.
12.B. Gains/retains possession in attacking end zone other than scoring: must carry disc directly to goal line spot closest to where player stopped.
12.C. Gains/retains possession of dead disc in attacking end zone: checked into live state where infraction occurred, then proceed per 12.B.`},

{id:"scoring", title:"Scoring", keywords:["goal","score","scoring","end zone","ground contact","catch","goal line","contested goal","retracted goal"],
text:`13.A. Goal scored when in-bounds player catches any legal pass in attacking end zone and retains possession through all ground contact. 13.A.1. First point of ground contact must be completely in end zone. NEW: If player loses possession during ground contact and another offensive player gains possession before turnover, that player's first ground contact must also be completely in end zone. Goal line is NOT part of end zone. 13.A.2. If in-bounds player in possession whose first ground contact will be in end zone loses possession due to uncontested foul, or lands out of end zone due to uncontested force-out foul (20.E.2.d), goal awarded.
13.B. If after receiving pass outside end zone, player stops contacting end zone without pivot on central zone: must carry disc back to closest goal line spot.
13.C. If player scores per 13.A but unknowingly throws another pass: goal awarded regardless of pass outcome. If unclear if scored: result of pass stands.
13.D. Player may call "goal" if they believe goal scored. Play stops. May NOT call "goal" before completion of all ground contact. After contested/retracted goal call: restart with check, call deemed made when pass caught. Stall resumes at 1. Players return to positions at time of catch.
13.E. Act of scoring subject to 3.I.2.`},

{id:"turnovers", title:"Turnovers", keywords:["turnover","incomplete","drop","dropped disc","interception","stall","double turnover","hand","catch own throw","assist","equipment"],
text:`14.A. Turnover when: 14.A.1. pass incomplete; 14.A.2. disc contacts ground not in possession (except pull); 14.A.3. disc becomes OB (except pull).
14.B. Thrower accidentally drops live/in-play disc without defensive interference and it contacts ground = turnover. If thrower regains accidentally dropped disc before ground contact without another player touching: continuous possession, stall count continues uninterrupted. If regains after another player touches: new possession.
14.C. Interception: defensive player gains possession. If defender accidentally loses possession before/during ground contact: pass is incomplete (not double-turnover), defender's team still gains possession.
14.D. Turnovers with stoppage: 14.D.1. Stall count reaches 10 (15.D). 14.D.2. Thrower hands disc to another player. 14.D.3. Thrower catches own legally thrown disc (unless another player touched it during flight, unless thrower intentionally deflected off another player). 14.D.4. Offensive player intentionally assists teammate's movement to catch (e.g., pushing off teammate to jump higher). If defender does this, intended receiver awarded possession. 14.D.5. Offensive player uses equipment to assist catching (e.g., hat/shirt at disc). Tacky gloves are legal.`},

{id:"stalling", title:"Stalling / Stall Count", keywords:["stall","stalling","count","ten","fast count","marker","reinitiate","resume","stall count","contested stall"],
text:`15.A. Stalling: period of time within which thrower must release throw, timed by stall count.
15.B. Stall count: announcing "stalling" and counting 1-10 loudly enough for thrower to hear. 15.B.1. Interval between each number must be at least 1 second (legal count 1-10 takes minimum 9 seconds). 15.B.2. All counts initiated/reinitiated/resumed after stoppage must start with "stalling." 15.B.3. Count reset to 1 during stoppage = new count.
15.C. Only marker may initiate or continue stall count, anytime thrower has possession of live/in-play disc. 15.C.1. Marker may also count if delay of game or pre-stall rules (10.B.3, 10.B.4, 10.B.5, 7.B.4.d) apply. 15.C.2. Unless 15.C.1 applies, stall count may NOT be initiated/resumed before pivot established: directly after turnover, when putting pull into play, after travel called with no pass attempted.
15.D. If thrower hasn't released at first utterance of "ten": turnover. Marker announces "stall," play stops. If disc thrown: play continues until pass outcome determined. Stall is NOT a violation; Continuation Rule does NOT apply. 15.D.1. Uncontested stall: disc returned to thrower at stall spot. Thrower places on ground, announces "3-2-1 disc in," disc is in play. 15.D.2. Contested stall: thrower believes released before "ten" or marker committed fast count denying opportunity to call. If pass complete or 16.F.2 applies: play stops, possession reverts to thrower, count per 15.F.2.c. If pass incomplete: turnover, check. If retracted and pass attempted: outcome stands, check.
15.E. Defense switches markers: new marker must reinitiate count (start over at "stalling one"). Marker leaving 10-foot radius and returning = new marker.
15.F. Stall count interrupted by call: thrower and marker agree on correct count. Count reached = last number fully uttered before call. Resume with "stalling" followed by:
15.F.1. General: (a) Uncontested defensive foul/violation: 1. (b) Uncontested offensive foul/violation: count+1, max 9. (c) Contested foul/violation: count+1, max 6. (d) Offsetting calls: count+1, max 6. (e) Unresolved calls: count+1, max 6. (f) Retracted defensive calls: 1. (g) Retracted offensive calls: count+1, max 9.
15.F.2. Specific: (a) Pick: count+1, max 6. (b) Marking violation (no stoppage): count-1, no "stalling." (c) Contested stall: 1st call = 8; 2nd+ when due to fast count = 6. (d) Technical timeout: count+1, max 6. (e) Obstruction within 5 yards: count+1, max 9.`},

{id:"marking_violations", title:"Marking Violations", keywords:["marking violation","fast count","double team","disc space","straddle","wrapping","vision blocking","marker","count minus one","contest marking"],
text:`16.A. Marking violations: infractions by marker or nearby defender against thrower.
16.B. Only thrower may call, must call specific name.
16.C. Play does NOT stop. Violation must be corrected. Marker resumes count at number last uttered minus 1 (e.g., "stalling 1...2...3..." "fast count" "...2...3..."). If marker resumes before correction: another instance of same violation.
16.D. Second marking violation in same stall count before thrower is in act of throwing: thrower may call another marking violation OR treat as general defensive violation (call "violation," play stops).
16.E. Types: Fast count, double team, disc space, straddle, wrapping, vision blocking.
16.F. Fast count: 16.F.1. No "stalling" to initiate/resume, intervals <1 second, or skipped number. 16.F.2. If fast count denies reasonable opportunity to call before "ten": treated as contested stall. 16.F.3. If this occurs in same possession following contested stall: count resumes at 6.
16.G. Double team: Defender other than marker within 10 feet of thrower's pivot without also being within 10 feet of and guarding another offensive player. Merely running across is NOT double team (running for exclusive purpose of reaching other side; running to interfere with thrower IS double team).
16.H. Disc space: 16.H.1. Any part of marker less than one disc diameter from thrower's torso, OR a line between any two points on marker touches thrower or is less than one disc diameter from torso/pivot. 16.H.2. Straddle: line between marker's feet less than one disc diameter from thrower's pivot. 16.H.3. Wrapping: line between marker's hands less than one disc diameter from thrower's torso/pivot. 16.H.4. Thrower may call "disc space" for straddle/wrapping (subsets of disc space). 16.H.5. If caused solely by thrower's movement: not a violation.
16.I. Vision blocking: marker deliberately blocks thrower's vision.
16.J. Marker may contest by calling "violation." Treated as offensive violation, Continuation Rule applies. Marker responsible for announcing if play affected. If marker diverted attention to assess marking position and thrower completed throw: marker could claim play affected.
16.K. Flagrant marking infractions: immediately callable as general violation. Covered under 2.C.1.`},

{id:"calls", title:"Making and Resolving Calls / Continuation Rule", keywords:["call","infraction","continuation","continuation rule","contest","contested","uncontested","play on","affected","revert","retract","dispute","positioning","multiple calls","offsetting","reverse sequence"],
text:`17.A. Infraction called only by infracted team player who recognizes it occurred. Must know specific rule violated and perceive with certainty. Must immediately call "violation" or specific infraction name loudly.
17.B. Player called for infraction may contest if they believe it did not occur.
17.C. Continuation Rule: Play stops when thrower in possession acknowledges call. NEW: If call made when no thrower in possession and disc not in air (disc on ground): play stops at time of call. If disc in air or thrower in act of throwing, or thrower fails to acknowledge and attempts pass: play continues until pass outcome determined. Uncontested stall after another call = treated as incomplete pass.
17.C.1. If involved players agree infraction did not affect outcome: result stands. Does not apply if thrower knew about call and attempted pass anyway.
17.C.2. If play should continue unhalted: caller announces "play on." Any player recognizing this should also announce "play on." If uncertain: opposing team may call "violation" to stop play.
17.C.3. Offense calls: (a) Pass complete: if called before act of throwing = revert to thrower; if after = play on. Where thrower calls: treat as if made when infraction occurred. If infraction after release = non-thrower call. (b) Pass incomplete: if affected play = revert to thrower (unless specific rule says otherwise, e.g. receiving foul); if not affected = result stands. Where thrower calls infraction before act of throwing = play on, result stands.
17.C.4. Defense calls: (a) Pass complete: if affected play = revert to thrower; if not affected = result stands. (b) Pass incomplete: play continues unhalted.
17.C.5. Affected play: infracted player determines outcome may have been meaningfully different absent infraction. Infracted player responsible for announcing. Contact after outcome determined cannot affect play.
17.C.6. Positioning: (a) No pass thrown before thrower acknowledges: return to positions at time of call. (b) Pass thrown/attempted: if reverts to thrower = return to earlier of time of throw or time of call; if player other than thrower awarded possession = return to time of infraction; if result stands = return to positions when play stopped. NEW: infracted player may recover relative position lost due to infraction (17.C.6.b.3).
17.D. Thrower must stop play promptly when aware of call. Players should echo calls. If marker believes thrower hasn't stopped promptly: may call violation, completed pass comes back.
17.E. Unclear catch/ground contact or in/out of bounds/end zone: player with best perspective makes call.
17.F. Retracted calls: announce "retracted." Play still stops. Restart with check, stall per 15.F.1.
17.G. Unresolvable dispute: disc returned to thrower, check, count+1 or 6 if over 5.
17.H. If possession reverts to thrower who was airborne when releasing: play restarts at closest spot on playing field to point of release.
17.I. Multiple calls on same play or before play stops: resolve in reverse sequence (latest first). 17.I.1. Earlier infraction not affecting play: not resolved, doesn't affect subsequent resolutions. 17.I.2. Offsetting: offensive and defensive infractions simultaneous or sequence undetermined: disc to thrower, count+1 or 6 if over 5. 17.I.3. Exception: separate fouls while disc in air but before anyone attempts to catch/block: treated as simultaneous.
17.J. Player's ability to catch/make play NOT considered "affected" because player stopped/slowed due to another player's call. Players encouraged to continue playing until play actually stops.`},

{id:"travels", title:"Travels", keywords:["travel","pivot","ground contact","stop","bobble","tip","brush","advance","three contacts","running catch","greatest"],
text:`18.A. After catching pass, player must stop as quickly as possible and establish pivot.
18.B. If catching while running/jumping: may release pass without stopping/setting pivot, provided no speed increase or direction change while in possession, and pass released before 3 additional ground contacts, all completely in-bounds excluding attacking end zone.
18.C. Player may bobble disc to gain control.
18.D. Travels: 18.D.1. Thrower fails to establish and maintain pivot at appropriate spot until throw released. Small toe-drag during release unreasonable to call. Err toward allowing play if drag < 2 inches. Only call if significant enough to affect play. 18.D.2. Thrower fails to touch disc to ground when required. 18.D.3. Offensive player advances in-bounds disc rolling/sliding/sitting on ground. If defender does this: thrower informs defense, indicates spot, puts disc in play there. 18.D.4. Player catches disc and doesn't stop ASAP, speeds up, or changes direction before establishing pivot. 18.D.5. Purposeful bobbling (tipping, delaying, guiding, brushing) to oneself to advance disc. Tipping to someone else is legal. Tipping own throw is legal, but if first player to touch after own tip = travel. 18.D.5.a. If defender commits this on disc in flight and result is defender/team gaining possession: defender retains possession at initial spot of infraction.
18.E. Exceptions: 18.E.1. Non-standing player losing contact with pivot to stand up: not travel if new pivot at same location. 18.E.2. Catching while running/jumping with no speed increase/direction change and pass released before 3 additional ground contacts, all in-bounds excluding attacking end zone: not required to establish pivot or stop. 18.E.3. If play stops: thrower may reset pivot.
18.F. Resolutions: 18.F.1. Travel + pass thrown: (a) Pass incomplete: play continues uninterrupted. (b) Pass complete: play stops, disc returned to thrower where travel occurred, check. If thrower threw from end zone or OB and pivot more than one step from appropriate spot: disc checked in where thrown (making it live), then thrower walks to correct pivot spot and puts in play. 18.F.2. Travel + no pass: (a) Play does NOT stop. Defense points to spot, thrower returns without delay, must touch disc to ground before passing. Disc is live, still subject to turnover. (b) Stall count paused until thrower sets pivot at travel spot. Marker not required to say "stalling" again if already initiated. (c) If thrower contests: announces "violation," play stops. Count resumes at count+1, or 6 if over 5.`},

{id:"picks", title:"Picks", keywords:["pick","obstruction","obstructed","guarding","offensive player","defensive player","recover position"],
text:`19.A. Pick: offensive player moves in manner causing defensive player guarding an offensive player to be obstructed by another player. Obstruction from contact with, or need to avoid, obstructing player. NOT a pick if both guarded player and obstructing player are making play on disc at time of obstruction.
19.B. Only obstructed player may call, must call "pick" immediately. Call it immediately or lose window.
19.C. If play stops per 17.C: players reposition per 17.C.6. Obstructed player then allowed to recover relative position lost. If trailing by 9 feet, catches back up to 9 feet away (not right next to offensive player).
19.D. During any stoppage, opposing players may agree to slightly adjust locations to avoid potential imminent picks.`},

{id:"fouls", title:"Fouls", keywords:["foul","dangerous play","throwing foul","receiving foul","blocking foul","strip","contact","non-incidental","verticality","force out","force-out","marker foul","thrower foul","reckless"],
text:`20.A. All players must avoid initiating contact in every way reasonably possible. Some contact inevitable but players have affirmative obligation. In violent collisions, player anticipating collision has responsibility to avoid it.
20.B. Dangerous Play: Reckless disregard for safety or significant injury risk. Call "dangerous play," play stops. Not superseded by any other rule. Examples: colliding with stationary opponent, jumping into group, diving around/through player contacting back/legs, running without looking, jumping where significant collision likely, wild throwing motions, contact with head, contact with airborne player's lower body preventing landing on feet, jumping in front of sprinting player where contact unavoidable. 20.B.1. Foul regardless of when disc arrives or contact occurs. 20.B.1.a. NEW: Contact generally required. No-contact dangerous play only when "near certainty" significant contact would have occurred had player not taken last-moment steps to avoid. Mere possibility insufficient. If offending player stops/changes path such that contact wouldn't occur: not nearly certain. 20.B.2. Resolution: uncontested = resolved as analogous foul. 20.B.2.a. Between thrower/marker: treated as throwing foul that affected play. 20.B.2.b. When disc in air: treated as receiving foul if either player attempting play on disc. Calling player may elect general foul if unrelated to overall play. 20.B.2.c. General foul: when disc not in air, far from disc, obviously uncatchable, or caller elects.
20.C. Foul called only by fouled player, immediately announced "foul."
20.D. Offsetting fouls: non-incidental contact from adjacent opponents vying for same unoccupied position.
20.E. Special foul provisions:
20.E.1. Throwing Fouls: (a) Non-incidental contact between thrower and marker. Nearly every contact non-incidental to thrower. Disc in possession = part of thrower. (b) Contact between thrower and extended arms/legs of marker = foul on marker unless contacted area completely stationary and legal. (c) Contact due to marker's illegal position (16.H) = foul on marker. Must be part of ultimate-related maneuver. Once marker in legal position, both must respect it. Thrower and marker vying for unoccupied position = foul on marker. (d) Contact initiated by thrower with body of legally positioned marker = foul on thrower. (e) Incidental follow-through contact (after release) is not a foul. (f) "Contact" call: thrower may call "contact" instead of foul. Play does not stop. Marker resumes at "one." Resolved like marking violation. Marker may contest by calling "violation." If called after beginning throwing motion and disc released: treated as "foul." (g) Applies to any defender within 10 feet. (h) NEW: Before pivot established, throwing foul protections limited to throwing motion and related windups only. General foul rules apply instead. Player who just caught disc and initiates contact with nearby defender cannot call foul/strip based on illegal marker position if pivot not set.
20.E.2. Receiving Fouls: (a) Contact with opponent while disc in air that interferes with attempt to make play on disc. Opponent must at least begin attempt. Includes second efforts after tip if disc not uncatchable. Incidental contact is not a foul. (b) If Continuation Rule applies (17.C.3.b.1 or 17.C.4.a.1): uncontested = fouled player gains possession at closest spot to infraction. Contested = disc reverts to thrower. (c) Principle of Verticality: all players have right to airspace immediately above torso. Non-incidental contact in that airspace before outcome determined = foul on player entering other's space. If disc caught/uncatchable before contact: outcome already determined. (d) Force-out Foul: airborne player catches disc, contacted by opponent before landing, contact causes landing OB instead of in-bounds (or out of end zone instead of in): foul on opponent, fouled player retains possession at spot of foul. If uncontested and would have landed in attacking end zone: goal awarded.
20.E.3. Blocking Fouls: (a) When disc in air, may not move solely to prevent opponent's unoccupied path to disc. Resulting contact = foul treated like receiving foul. Intent can be partly motivated to prevent path if part of general effort to play disc. Trailing player running into player in front = nearly always foul on trailing player. (b) May not take position unavoidable by moving opponent considering time, distance, sight. Maintaining existing position is NOT "taking a position."
20.E.4. Strip: foul causing loss of possession. Subset of fouls, treated same. Initiating contact with disc in possession is a foul. Must have had sustained contact and control (possession) to call strip.`},

{id:"positioning", title:"Positioning", keywords:["position","occupy","jump","land","takeoff","extended arms","obstruct"],
text:`21.A. Each player entitled to occupy any position not occupied by opponent, provided no contact caused.
21.B. Jumping player entitled to land at takeoff spot without hindrance. Also entitled to land at another spot if landing spot and direct path were not already occupied at takeoff. Does not override responsibility to avoid contact or blocking fouls.
21.C. NEW: Defense must not move in manner that obstructs offense from taking possession of disc or establishing pivot.
21.D. Players may not use extended arms or legs to obstruct opponent's movement. Arms/legs not considered "extended" during normal running and jumping.`},

{id:"observers", title:"Observers", keywords:["observer","dispute","resolve","censure","eject","overrule","active ruling"],
text:`22.A. Observers may be used if desired by captains or event organizer.
22.B. Observers may: 22.B.1. Track time limits and announce warnings/expirations. 22.B.2. Resolve player disputes (player may request; observer may resolve without request if not timely). Play restarts with check. 22.B.3. Censure or eject players for spirit infractions (includes assigning responsibility for delays). 22.B.4. Render opinions on other on-field events (line calls, offside calls) as determined by event organizer.
22.C. Players agree to abide by observers' decisions by playing under observers.
22.D. Players may overrule observer's active ruling to their own team's detriment. May decline yardage penalty from misconduct. Observers may deny declination if teams circumventing mandatory rules/safety.`},

{id:"misconduct", title:"Misconduct System (Appendix C)", keywords:["misconduct","blue card","yellow card","red card","TMF","PMF","ejection","technical misconduct","personal misconduct","penalty","yardage"],
text:`Appendix C: Misconduct System (2026-2027 changes):
- Technical Misconduct Foul (TMF) renamed to BLUE CARD. Assessed for: repeated or egregious violations of etiquette/spirit, excessive language directed at officials/opponents, deliberate delay of game, other technical violations.
- Personal Misconduct Foul (PMF) renamed to YELLOW CARD. Assessed for: particularly aggressive, dangerous, or reckless behavior; taunting; fighting; threatening; aggressive physical contact.
- Ejection renamed to RED CARD. Player ejected from remainder of game. NEW: Red card now results in TWO blue cards assessed against the team (was previously one).
- Blue card penalties typically include yardage assessments (field position penalties).
- Players may decline enforcement of yardage penalty. Observers may deny declination if circumventing mandatory rules/safety.
- Captains/coaches may also remove own players from game per 2.C.2.`},

{id:"mixed", title:"Mixed Rules (Appendix B)", keywords:["mixed","gender","ratio","personnel","4/3","woman-matching","man-matching","endzone decides","ratio rule"],
text:`Appendix B: Mixed Rules and Adaptations (2026-2027):
- Mixed play rules moved to dedicated appendix from main rules body.
- Personnel ratio: teams play with a ratio of man-matching and woman-matching players (e.g., 4/3).
- The team with choice of gender ratio signals the ratio for each point.
- Specific timing rules for signaling gender ratio between points.
- Player substitution rules specific to mixed divisions.
- Pull rules and adaptations for mixed play.`}
];

// ─── Search Logic ───
function searchRules(query, db) {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 2);

  const scored = db.map(section => {
    let score = 0;
    // Keyword matches (strongest signal)
    for (const kw of section.keywords) {
      if (q.includes(kw)) score += 10;
      for (const w of words) {
        if (kw.includes(w)) score += 3;
      }
    }
    // Title match
    if (section.title.toLowerCase().includes(q)) score += 15;
    for (const w of words) {
      if (section.title.toLowerCase().includes(w)) score += 5;
    }
    // Body text match
    const bodyLower = section.text.toLowerCase();
    for (const w of words) {
      const escapedW = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedW, 'gi');
      const matches = bodyLower.match(regex);
      if (matches) score += matches.length;
    }
    return { ...section, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4); // Top 4 most relevant sections
}

// ─── Components ───
function parseFormatted(text) {
  const blocks = [];
  const lines = text.split("\n");
  let currentBullets = [];
  const flushBullets = () => {
    if (currentBullets.length > 0) {
      blocks.push({ type: "bullets", items: [...currentBullets] });
      currentBullets = [];
    }
  };
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^#{1,3}\s/.test(trimmed)) {
      flushBullets();
      const level = trimmed.match(/^(#{1,3})/)[1].length;
      blocks.push({ type: "heading", level, text: trimmed.replace(/^#{1,3}\s*/, "").replace(/\*\*/g, "") });
    } else if (trimmed === "---" || trimmed === "***") {
      flushBullets();
      blocks.push({ type: "hr" });
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
      const indent = line.match(/^\s*/)[0].length;
      currentBullets.push({ text: trimmed.slice(2), depth: indent > 0 ? 1 : 0 });
    } else if (/^\d+\.\s/.test(trimmed)) {
      const indent = line.match(/^\s*/)[0].length;
      currentBullets.push({ text: trimmed.replace(/^\d+\.\s*/, ""), depth: indent > 0 ? 1 : 0 });
    } else {
      flushBullets();
      if (trimmed === "") blocks.push({ type: "spacer" });
      else blocks.push({ type: "paragraph", text: trimmed });
    }
  }
  flushBullets();
  return blocks;
}

function InlineFormatted({ text }) {
  const parts = [];
  // Match **bold**, *italic*, `code`, and plain text
  const regex = /\*\*(.+?)\*\*|\*([^*\n]+)\*|`([^`]+)`/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    if (match[1]) {
      // Bold
      parts.push(
        <span key={key++} style={{
          color: "#edd98b", fontWeight: 700, fontFamily: "'DM Mono', monospace",
          fontSize: "0.92em",
        }}>{match[1]}</span>
      );
    } else if (match[2]) {
      // Italic
      parts.push(
        <em key={key++} style={{ color: "#c8c4b4", fontStyle: "italic" }}>{match[2]}</em>
      );
    } else if (match[3]) {
      // Inline code
      parts.push(
        <code key={key++} style={{
          color: "#c0baa8", fontFamily: "'DM Mono', monospace", fontSize: "0.88em",
          background: "rgba(255,255,255,0.05)", padding: "2px 5px", borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.06)",
        }}>{match[3]}</code>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  return <>{parts}</>;
}

function FormattedMessage({ text }) {
  const blocks = useMemo(() => parseFormatted(text), [text]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {blocks.map((block, i) => {
        if (block.type === "spacer") return <div key={i} style={{ height: 4 }} />;
        if (block.type === "hr") return <div key={i} style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "6px 0" }} />;
        if (block.type === "heading") {
          const sizes = { 1: 16, 2: 14.5, 3: 13.5 };
          return (
            <div key={i} style={{ fontSize: sizes[block.level] || 14, fontWeight: 600, color: "#d8d2c0", marginTop: i > 0 ? 6 : 0, paddingBottom: 4, borderBottom: block.level === 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <InlineFormatted text={block.text} />
            </div>
          );
        }
        if (block.type === "paragraph") return (
          <p key={i} style={{ margin: 0, lineHeight: 1.8, color: "#b0ac9f", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            <InlineFormatted text={block.text} />
          </p>
        );
        if (block.type === "bullets") {
          // Group items: each depth-0 item may have depth-1 children
          const grouped = [];
          for (const item of block.items) {
            if (item.depth === 0 || grouped.length === 0) {
              grouped.push({ text: item.text, children: [] });
            } else {
              grouped[grouped.length - 1].children.push(item.text);
            }
          }
          return (
            <ul key={i} style={{ margin: "2px 0", paddingLeft: 4, display: "flex", flexDirection: "column", gap: 7 }}>
              {grouped.map((item, j) => (
                <li key={j} style={{ lineHeight: 1.75, listStyleType: "none", position: "relative", paddingLeft: 20, fontSize: "0.96em", color: "#aaa89c", wordBreak: "break-word", overflowWrap: "anywhere" }}>
                  <span style={{ position: "absolute", left: 3, top: "0.6em", width: 6, height: 6, borderRadius: "50%", background: "rgba(232,200,114,0.3)", border: "1px solid rgba(232,200,114,0.15)" }} />
                  <InlineFormatted text={item.text} />
                  {item.children.length > 0 && (
                    <ul style={{ margin: "4px 0 0 0", paddingLeft: 4, display: "flex", flexDirection: "column", gap: 5 }}>
                      {item.children.map((child, k) => (
                        <li key={k} style={{ lineHeight: 1.75, listStyleType: "none", position: "relative", paddingLeft: 20, fontSize: "0.93em", color: "#918e84", wordBreak: "break-word", overflowWrap: "anywhere" }}>
                          <span style={{ position: "absolute", left: 3, top: "0.65em", width: 4, height: 4, borderRadius: "50%", background: "rgba(232,200,114,0.18)", border: "1px solid rgba(232,200,114,0.1)" }} />
                          <InlineFormatted text={child} />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          );
        }
        return null;
      })}
    </div>
  );
}

const EXAMPLES = {
  en: [
    { text: "What happens on a contested foul?", icon: "⚡" },
    { text: "How does the stall count work?", icon: "⏱" },
    { text: "What is a pick?", icon: "🚧" },
    { text: "Explain the continuation rule", icon: "▶" },
    { text: "When can I call a travel?", icon: "👟" },
    { text: "What are the marking violations?", icon: "🛡" },
    { text: "How do time caps work?", icon: "⏳" },
    { text: "What is dangerous play?", icon: "⚠" },
    { text: "Pull goes OB — what now?", icon: "↗" },
    { text: "How does force-out foul work?", icon: "💨" },
    { text: "What are blue/yellow/red cards?", icon: "🟨" },
  ],
  fr: [
    { text: "Que se passe-t-il sur une faute contestée?", icon: "⚡" },
    { text: "Comment fonctionne le compte de stalle?", icon: "⏱" },
    { text: "Qu'est-ce qu'un pick?", icon: "🚧" },
    { text: "Expliquer la règle de continuation", icon: "▶" },
    { text: "Quand puis-je appeler un marcher?", icon: "👟" },
    { text: "Quelles sont les violations du marqueur?", icon: "🛡" },
    { text: "Comment fonctionnent les limites de temps?", icon: "⏳" },
    { text: "Qu'est-ce que le jeu dangereux?", icon: "⚠" },
    { text: "Le lancer d'engagement sort — que faire?", icon: "↗" },
    { text: "Comment fonctionne la faute de force-out?", icon: "💨" },
    { text: "Cartes bleues/jaunes/rouges — explications", icon: "🟨" },
  ],
};

export default function USAURulesHelper() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchedSections, setSearchedSections] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState("en");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const askQuestionRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "auto" }); }, [messages, loading]);
  useEffect(() => { if (!loading) inputRef.current?.focus(); }, [loading]);
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [input]);

  const askQuestion = useCallback(async (question) => {
    if (!question.trim() || loading) return;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setMessages(prev => [...prev, { role: "user", text: question.trim() }]);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "52px";
    setLoading(true);
    setSearchedSections([]);

    const db = RULES_DBS[lang];
    const edition = lang === "fr" ? "2024-2025" : "2026-2027";
    const replyLang = lang === "fr" ? "French (français)" : "English";

    try {
      // Step 1: Local search to find relevant rule sections
      const results = searchRules(question.trim(), db);
      const sectionNames = results.map(r => r.title);
      setSearchedSections(sectionNames);

      const rulesContext = results.length > 0
        ? results.map(r => `=== ${r.title} ===\n${r.text}`).join("\n\n")
        : `No specific rules sections matched. Use your knowledge of the ${edition} USAU rules to answer.`;

      // Step 2: Send question + relevant sections to API
      const conversationMessages = [
        ...messages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
        { role: "user", content: question.trim() },
      ];

      const systemPrompt = `You are an expert on the ${edition} Official Rules of Ultimate. Answer the user's question using ONLY the rules text provided below. Cite specific rule numbers (e.g. **17.C.3**). Be concise and practical. Always reply in ${replyLang}.

Format responses clearly:
- Use **bold** for rule numbers and key terms
- Use ### headings to separate major topics if answer covers multiple areas
- Use bullet points (- ) for lists; use indented bullets (  - ) for sub-items within a list item
- Use --- to separate distinct sections when helpful
- Keep paragraphs short (2-3 sentences max)

RULES TEXT (from the ${edition} Official Rules of Ultimate):
${rulesContext}`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          system: systemPrompt,
          messages: conversationMessages,
        }),
      });

      const data = await response.json();
      const assistantText = (data.content || [])
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("\n\n") || "Sorry, I couldn't generate a response.";

      setMessages(prev => [...prev, {
        role: "assistant",
        text: assistantText,
        sections: sectionNames,
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", text: "Something went wrong. Please try again.", sections: [] }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  askQuestionRef.current = askQuestion;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askQuestion(input); }
  };

  const toggleVoice = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in your browser. Try Chrome or Safari.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang === "fr" ? "fr-FR" : "en-US";
    let pendingFinal = "";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      if (pendingFinal.trim() && recognitionRef.current === recognition) {
        askQuestionRef.current(pendingFinal.trim());
      }
      pendingFinal = "";
    };
    recognition.onerror = (e) => {
      setIsListening(false);
      pendingFinal = "";
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        alert("Microphone access was denied. Please allow microphone permission in your browser settings and try again.");
      }
    };
    recognition.onresult = (e) => {
      if (recognitionRef.current !== recognition) return;
      let interim = "";
      let final = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript;
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      if (final) pendingFinal = final;
      setInput((final || interim).trim());
      if (final.trim()) {
        recognition.stop();
      }
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  }, [isListening, lang]);

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: "#09090d", color: "#c8c4b8", fontFamily: "'DM Sans', system-ui, sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a1a22; border-radius: 10px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dotPulse { 0%, 80%, 100% { transform: scale(0.5); opacity: 0.25; } 40% { transform: scale(1); opacity: 1; } }
        .chat-msg { animation: fadeUp 0.25s ease-out; }
        .example-btn { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.05); color: #888; padding: 11px 16px; border-radius: 12px; font-size: 13px; cursor: pointer; transition: all 0.2s ease; font-family: 'DM Sans', sans-serif; text-align: left; line-height: 1.35; display: flex; align-items: center; gap: 10px; }
        .example-btn:hover { background: rgba(232,200,114,0.05); border-color: rgba(232,200,114,0.12); color: #bbb; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,0,0,0.25); }
        .example-btn .ico { font-size: 14px; opacity: 0.65; flex-shrink: 0; width: 20px; text-align: center; }
        .input-wrap { background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; display: flex; align-items: stretch; padding: 4px 0 4px 0; transition: all 0.2s ease; }
        .input-wrap:focus-within { border-color: rgba(232,200,114,0.25); box-shadow: 0 0 0 3px rgba(232,200,114,0.04); background: rgba(255,255,255,0.045); }
        .input-wrap textarea { flex: 1; background: transparent; border: none; outline: none; color: #ddd8cc; font-family: 'DM Sans', sans-serif; font-size: 16px; padding: 14px 20px; font-weight: 400; resize: none; overflow-y: auto; min-height: 52px; max-height: 180px; line-height: 1.5; }
        .input-wrap textarea::placeholder { color: #3a3a3a; }
        .input-wrap textarea:disabled { opacity: 0.4; }
        .lang-toggle { background: none; border: 1px solid rgba(255,255,255,0.07); color: #444; font-size: 10px; font-family: 'DM Mono', monospace; padding: 3px 7px; border-radius: 6px; cursor: pointer; transition: all 0.2s; flex-shrink: 0; letter-spacing: 0.4px; }
        .lang-toggle:hover { color: #888; border-color: rgba(255,255,255,0.12); }
        .lang-toggle.active { color: #d4a853; border-color: rgba(212,168,83,0.25); }
        .send-btn { width: 42px; height: 42px; border-radius: 12px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; background: linear-gradient(135deg, #d4a853, #b8902e); color: #09090d; }
        .send-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 2px 14px rgba(212,168,83,0.25); }
        .send-btn:disabled { opacity: 0.12; cursor: not-allowed; }
        .send-btn svg { width: 17px; height: 17px; }
        .mic-btn { width: 38px; height: 38px; border-radius: 10px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; background: transparent; color: #444; margin-right: 2px; }
        .mic-btn:hover:not(:disabled) { color: #777; background: rgba(255,255,255,0.04); }
        .mic-btn:disabled { opacity: 0.2; cursor: not-allowed; }
        .mic-btn svg { width: 16px; height: 16px; }
        .mic-btn.listening { color: #d4a853; }
        @keyframes micPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(212,168,83,0.4); } 50% { box-shadow: 0 0 0 6px rgba(212,168,83,0); } }
        .mic-btn.listening { animation: micPulse 1.2s ease-in-out infinite; }
        .input-wrap.recording { border-color: rgba(212,168,83,0.35); box-shadow: 0 0 0 3px rgba(212,168,83,0.07); }
        @keyframes recDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .rec-pill { display: flex; align-items: center; gap: 6px; font-size: 11px; font-family: 'DM Mono', monospace; color: #d4a853; letter-spacing: 0.4px; margin-bottom: 8px; }
        .rec-dot { width: 7px; height: 7px; border-radius: 50%; background: #d4a853; animation: recDot 1s ease-in-out infinite; flex-shrink: 0; }
        .clear-btn { background: none; border: 1px solid rgba(255,255,255,0.06); color: #4a4a4a; font-size: 11px; font-family: 'DM Mono', monospace; padding: 5px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.5px; text-transform: uppercase; }
        .clear-btn:hover { border-color: rgba(255,255,255,0.1); color: #777; }
        .user-bubble { background: linear-gradient(135deg, rgba(232,200,114,0.1), rgba(232,200,114,0.04)); border: 1px solid rgba(232,200,114,0.1); border-radius: 18px 18px 6px 18px; padding: 12px 18px; }
        .assistant-bubble { background: rgba(255,255,255,0.018); border: 1px solid rgba(255,255,255,0.035); border-radius: 6px 18px 18px 18px; padding: 16px 20px; word-break: break-word; overflow-wrap: anywhere; }
        .section-tag { display: inline-flex; align-items: center; font-size: 10px; color: #5a5a4a; font-family: 'DM Mono', monospace; padding: 2px 7px; background: rgba(232,200,114,0.04); border: 1px solid rgba(232,200,114,0.06); border-radius: 5px; }
        .header-bar { padding: 16px 24px; }
        .empty-state { padding: 32px 24px; }
        .examples-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(195px, 1fr)); gap: 7px; width: 100%; max-width: 540px; }
        .chat-area { padding: 20px 24px; }
        .input-bar { padding: 12px 24px 20px; padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px)); }
        .disclaimer { font-size: 10px; color: #222; text-align: center; margin-top: 10px; font-family: 'DM Mono', monospace; letter-spacing: 0.3px; }
        @media (max-width: 640px) {
          .header-bar { padding: 12px 16px; }
          .empty-state { padding: 24px 16px; }
          .examples-grid { grid-template-columns: 1fr; }
          .chat-area { padding: 14px 14px; }
          .input-bar { padding: 10px 12px 12px; padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)); }
          .input-wrap textarea { padding: 12px 14px; min-height: 48px; }
          .user-bubble { padding: 10px 14px; }
          .assistant-bubble { padding: 12px 14px; }
          .send-btn { width: 44px; height: 44px; }
          .disclaimer { display: none; }
        }
      `}</style>

      {/* Header */}
      <header className="header-bar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.035)", flexShrink: 0, background: "rgba(9,9,13,0.92)", backdropFilter: "blur(16px)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #d4a853, #a07828)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 2px 10px rgba(212,168,83,0.15)" }}>🥏</div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#e8e4da", letterSpacing: "-0.3px" }}>USAU Rules</h1>
            <p style={{ fontSize: 10.5, color: "#4a4a4a", fontFamily: "'DM Mono', monospace", letterSpacing: "0.4px", marginTop: 1 }}>{lang === "fr" ? "2024–2025 FR" : "2026–2027 EN"} · {RULES_DBS[lang].length} {lang === "fr" ? "sections indexées" : "sections indexed"}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            className={`lang-toggle${lang === "fr" ? " active" : ""}`}
            onClick={() => { setLang(l => l === "en" ? "fr" : "en"); setMessages([]); setInput(""); }}
            title={lang === "fr" ? "Passer en anglais" : "Switch to French"}
            disabled={isListening}
          >
            {lang === "fr" ? "FR" : "EN"}
          </button>
          {messages.length > 0 && <button className="clear-btn" onClick={() => { setMessages([]); setInput(""); }}>Clear</button>}
        </div>
      </header>

      {/* Chat */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", overscrollBehavior: "none" }}>
        {messages.length === 0 ? (
          <div className="empty-state" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 32 }}>
            <div style={{ textAlign: "center", maxWidth: 420 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, rgba(212,168,83,0.1), rgba(212,168,83,0.03))", border: "1px solid rgba(212,168,83,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>🥏</div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#b8b4a8", letterSpacing: "-0.4px", marginBottom: 6 }}>{lang === "fr" ? "Posez une question sur les règles" : "Ask a rules question"}</h2>
              <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6 }}>{lang === "fr" ? "Recherche dans le règlement 2024–2025, puis génère une réponse citée par l'IA." : "Searches the full 2026–2027 rulebook, then uses AI to give you a cited answer from the matching sections."}</p>
            </div>
            <div className="examples-grid">
              {EXAMPLES[lang].map((q, i) => (
                <button key={i} className="example-btn" onClick={() => askQuestion(q.text)}>
                  <span className="ico">{q.icon}</span><span>{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-area" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} className="chat-msg" style={{ alignSelf: "flex-end", maxWidth: "82%", marginTop: i > 0 && messages[i - 1]?.role === "assistant" ? 10 : 2 }}>
                  <div className="user-bubble" style={{ fontSize: 14.5, lineHeight: 1.6, color: "#d8d2c4", fontWeight: 450 }}>{msg.text}</div>
                </div>
              ) : (
                <div key={i} className="chat-msg" style={{ alignSelf: "flex-start", maxWidth: "94%", marginTop: 2 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginTop: 3 }}>🥏</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="assistant-bubble" style={{ fontSize: 14, lineHeight: 1.7, color: "#b0ac9f" }}>
                        <FormattedMessage text={msg.text} />
                      </div>
                      {msg.sections && msg.sections.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                          <span style={{ fontSize: 10, color: "#3a3a3a", fontFamily: "'DM Mono', monospace", marginRight: 2, lineHeight: "20px" }}>from:</span>
                          {msg.sections.map((s, j) => <span key={j} className="section-tag">{s}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
            {loading && (
              <div className="chat-msg" style={{ alignSelf: "flex-start", maxWidth: "94%", marginTop: 2 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginTop: 3 }}>🥏</div>
                  <div>
                    {searchedSections.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                        <span style={{ fontSize: 10, color: "#3a3a3a", fontFamily: "'DM Mono', monospace", marginRight: 2, lineHeight: "20px" }}>searching:</span>
                        {searchedSections.map((s, j) => <span key={j} className="section-tag">{s}</span>)}
                      </div>
                    )}
                    <div className="assistant-bubble" style={{ display: "flex", gap: 5, alignItems: "center", padding: "14px 20px" }}>
                      {[0, 1, 2].map(j => (
                        <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: "#d4a853", animation: "dotPulse 1.4s ease-in-out infinite", animationDelay: `${j * 0.16}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="input-bar" style={{ flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.025)", background: "rgba(9,9,13,0.95)", backdropFilter: "blur(16px)" }}>
        {isListening && (
          <div className="rec-pill">
            <span className="rec-dot" />
            <span>{lang === "fr" ? "Écoute en cours — parlez, appuyez sur le micro pour arrêter" : "Listening — speak now, tap mic to stop"}</span>
          </div>
        )}
        <div className={`input-wrap${isListening ? " recording" : ""}`}>
          <textarea
            ref={inputRef}
            value={input}
            rows={1}
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? (lang === "fr" ? "Parlez maintenant…" : "Speak now…") : (lang === "fr" ? "Posez une question…" : "Ask about a rule…")}
            disabled={loading}
            style={{ height: "52px" }}
          />
          <div style={{ display: "flex", alignItems: "center", alignSelf: input ? "flex-end" : "center", flexShrink: 0, paddingRight: "4px" }}>
            <button className={`mic-btn${isListening ? " listening" : ""}`} onClick={toggleVoice} disabled={loading} title={isListening ? "Stop recording" : "Ask by voice"}>
              {isListening ? (
                <svg viewBox="0 0 24 24" fill="currentColor"><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" opacity="0.3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v3M9 21h6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="9" y1="21" x2="15" y2="21"/></svg>
              )}
            </button>
            <button className="send-btn" onClick={() => askQuestion(input)} disabled={loading || !input.trim()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
            </button>
          </div>
        </div>
        <p className="disclaimer">
          {lang === "fr"
            ? "Règlement 2024–2025 indexé localement · Réponses IA ancrées dans le texte des règles · Pas une ressource officielle USAU"
            : "Full 2026–2027 rulebook indexed locally · AI answers grounded in rule text · Not an official USAU resource"}
        </p>
      </div>
    </div>
  );
}
