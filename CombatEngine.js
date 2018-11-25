// SW

// TODO List

// Create functions to assemble units from fed data, rather than a huge const.

// Add in more ship types. Fighter, Corvette, Frigate, Capital.
// Refactor Shields. Add Bypass and Drain.
// Add in Armour reduction. Add Pierce and Shred.
// Add in Components. Shield Gen, Bridge, Engines, Battery, etc.

// Add Weapon System targeting.
// Weapons can be set to a couple of different modes that determine if they will be used during an action.
// Primary: Fires on any target during an attack.
// Anti-Fighter: Only attacks Fighter and Corvette units.
// Anti-Capital: Only attacks Frigate and Capital units.
// Point-Defense: Retaliates against attackers on their attack.
// Secondary: Only attacks during a designated behaviour.

// Add more Weapon types, and power/ammo systems.
// Lasers       use low power,  do low damage,  high accuracy.
// Turbolasers  use high power, do high damage, low accuracy.
// Missiles     use ammo,       medium damage,  high accuracy.
// Bombs        use ammo,       high damage,    low accuracy.
// Power weapons will need to cool down after shots.
// Ammo weapons can be expended and will need to be restocked.

// Add in AI behaviours
// Add in Bombing Run behaviour. Could be general attack.
// Add in Aggressive Attack / No Survivors. Allows killing Disabled.
// Add in Covering Fire behaviour. Adds counter-attack for another Section.
// Add in Evasive Manouvre. Makes Section harder to hit til their next turn.
// Add in Flee. Section attempts to leave the battle.

// Add in behaviour functions for fleeing and panic.
// Add a morale function to check if unit should change behaviour.
// Add in Disabled function for when ship hull gets low enough.
// Move Disabled ships into Disabled array.
// Disabled array is targetable for Aggressive Attack.

// Add in carrier functionality.
// Carriers must launch Sections. Are added into Sections array from Carrier Unit.
// Damaged sections can dock with carrier to repair hp and shields. Are removed from Sections array and placed back in Carrier Unit.
// Sections are Destroyed or Disabled if Hangar is destroyed, or Carrier is disabled.
// Sections are Destroyed if Carrier is Destroyed.

// Consider adding distance functionality. Ships must move to engage.

// Manual turn buttons.

// List all details of all Units, Weapons, Components to external file.
// Allow easy construction of units from said file.
// Export behaviour functions to external file. Clears up space.


// Constructors

function Group (name, team, sections) {
    this.name = name;
    this.team = team;
    this.sections = sections;
    this.state = 'active'
}
function Section (name, units) {
    this.name = name;
    this.units = units;
    this.speed = 0;
    this.casualties = [];
    this.state = 'active'
}
function Unit (name, unitName, hp, sp, armor, evasion, wSystems) {
    this.name = name;
    this.unitName = unitName;
    this.hp = hp;
    this.sp = sp;
    this.hpMax = hp;
    this.spMax = sp;
    this.armor = armor;
    this.evasion = evasion;
    this.wSystems = wSystems;
    this.kills = 0;
    this.totalDamageDealt = 0;
    this.state = 'active'
}
function WeaponSystem (name, weapons) {
    this.name = name;
    this.weapons = weapons;
    this.state = 'active'
}
function Weapon (name, minDamage, maxDamage, accuracy) {
    this.name = name;
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
    this.accuracy = accuracy;
    this.state = 'active'
}

/**
 * Allows calling of a constuctor function using an array of arguements.
 * @param {*} constructor   the constructor we are calling
 * @param {*} args          the arguements for the constructor
 * @param {*} additions     any additions, such as name, to unshift to the start
 */
function construct(constructor, args, additions) {
    if (additions) args = additions.concat(args);
    function F() {
        return constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;
    return new F();
}

// Models

// Weapons
const KX9LaserCannon = [
    "KX9 Laser Cannon",
    1,
    5,
    25
]
const H9Turbolaser = [
    "H9 Turbolaser",
    5,
    10,
    5
]
const XX9HeavyTurbolaser = [
    "XX9 Heavy Turbolaser",
    20,
    30,
    5
]
const NK7IonCannon = [
    "NK-7 Ion Cannon",
    15,
    30,
    10
]

// Weapon Systems
const KX9LaserArray = [
    "KX-9 Laser Array",
    [
        construct(Weapon, KX9LaserCannon),
        construct(Weapon, KX9LaserCannon),
        construct(Weapon, KX9LaserCannon),
        construct(Weapon, KX9LaserCannon)
    ]
]
const H9TurbolaserTurret = [
    "H9 Turbolaser Turret",
    [
        construct(Weapon, H9Turbolaser)
    ]
]
const H9DualTurbolaserTurret = [
    "H9 Dual Turbolaser Turret",
    [
        construct(Weapon, H9Turbolaser),
        construct(Weapon, H9Turbolaser)
    ]
]

const XX9QuadHeavyTurbolaserTurret = [
    "XX9 Quad Heavy Turbolaser Turret",
    [
        construct(Weapon, H9Turbolaser),
        construct(Weapon, H9Turbolaser),
        construct(Weapon, H9Turbolaser),
        construct(Weapon, H9Turbolaser)
    ]
]
const XX9TripleHeavyTurbolaserTurret = [
    "XX9 Triple Heavy Turbolaser Turret",
    [
        construct(Weapon, H9Turbolaser),
        construct(Weapon, H9Turbolaser),
        construct(Weapon, H9Turbolaser)
    ]
]
const XX9DualHeavyTurbolaserTurret = [
    "XX9 Dual Heavy Turbolaser Turret",
    [
        construct(Weapon, H9Turbolaser),
        construct(Weapon, H9Turbolaser)
    ]
]
const XX9HeavyTurbolaserTurret = [
    "XX9 Heavy Turbolaser Turret",
    [
        construct(Weapon, H9Turbolaser)
    ]
]

const XX9HeavyTurbolaserx20 = [
    "XX9 Heavy Turbolaser Grid (20)",
    [
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
        construct(Weapon, XX9HeavyTurbolaser),
    ]
]

const NK7DualHeavyIonCannonTurret = [
    "NK7 Dual Heavy Ion Cannon Turret",
    [
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon)
    ]
]

const NK7IonCannonx20 = [
    "NK-7 Ion Cannon Grid (20)",
    [
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
    ]
]
const NK7IonCannonx15 = [
    "NK-7 Ion Cannon Grid (15)",
    [
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
    ]
]
const NK7IonCannonx10 = [
    "NK-7 Ion Cannon Grid (10)",
    [
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
        construct(Weapon, NK7IonCannon),
    ]
]

const XWing = [
    "T65 X-Wing",
    10,
    10,
    1,
    50,
    [
        construct(WeaponSystem, KX9LaserArray)
    ]
];

const CorellianCorvette = [
    "CR90 Corvette",
    30,
    20,
    3,
    30,
    [
        construct(WeaponSystem, H9DualTurbolaserTurret),
        construct(WeaponSystem, H9DualTurbolaserTurret),
        construct(WeaponSystem, H9TurbolaserTurret),
        construct(WeaponSystem, H9TurbolaserTurret),
        construct(WeaponSystem, H9TurbolaserTurret),
        construct(WeaponSystem, H9TurbolaserTurret)
    ]
];

const Imperial1 = [
    "Imperial I-class Star Destroyer",
    5000,
    5000,
    5,
    5,
    [
        construct(WeaponSystem, XX9HeavyTurbolaserx20),
        construct(WeaponSystem, XX9HeavyTurbolaserx20),
        construct(WeaponSystem, XX9HeavyTurbolaserx20),
        construct(WeaponSystem, NK7IonCannonx20),
        construct(WeaponSystem, NK7IonCannonx15),
        construct(WeaponSystem, NK7IonCannonx15),
        construct(WeaponSystem, NK7IonCannonx10),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret),
        construct(WeaponSystem, NK7DualHeavyIonCannonTurret),
        construct(WeaponSystem, NK7DualHeavyIonCannonTurret),
        construct(WeaponSystem, XX9QuadHeavyTurbolaserTurret),
        construct(WeaponSystem, XX9QuadHeavyTurbolaserTurret),
        construct(WeaponSystem, XX9TripleHeavyTurbolaserTurret),
        construct(WeaponSystem, XX9TripleHeavyTurbolaserTurret),
        construct(WeaponSystem, XX9TripleHeavyTurbolaserTurret),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret),
    ]
];


// Logging

const printString = function (string) {
    let para = document.createElement("p");
    const node = document.createTextNode(string);
    para.appendChild(node);

    let element = document.getElementById("combatLog");
    element.appendChild(para);
}

const printArray = function (logArray) {
    logArray.forEach(function(part) {
        printString(part);
    })
}

const constructString = function (log) {
    let logString = "";

    if (!log.def) return "DEBUG: All defenders killed. Invalid target.";

    // Log initial activity.
    logString += log.atk.name + " fires at " + log.def.name + " using " + log.system.name + "."

    // How many hits
    if (log.hits > 1) logString += " It hit " + log.hits + " times!";
    else if (log.hits === 1) logString += " It hit!";
    else logString += " " + log.atk.name + " missed their shots against " + log.def.name + ". ";

    // If damage was soaked by armour.
    if (log.soaks > 0) logString += " " + log.soaks + " shots were soaked by armour. ";

    // Tabulate all damage against a single target's shields.
    if (log.spDam > 0) logString += " " + log.atk.name + " dealt " + log.spDam + " shield damage. ";

    // If they lost shields.
    if (log.sBreak === true) logString += " " + log.def.name + " has lost shields! ";

    // Tabulate all damage against a single target's hull.
    if (log.hpDam > 0) logString += " " + log.atk.name + " dealt " + log.hpDam + " hull damage. ";

    // // If they were disabled.
    // if (log.disables > 0) logString += " " + log.def.name + " has been disabled! ";

    // If they were destroyed.
    if (log.kill === true) logString += " " + log.def.name + " has been destroyed! ";

    return logString;
};

/**
 * Displays a general log for an entire group.
 * @param {*} groups 
 */
const displayCombatants = function (groups) {
    printString("Combatants:");
    printString("-----");
    groups.forEach(function(group) {
        printString(group.name + ": Team " + group.team);
        group.sections.forEach(function(section) {
            printString("--" + section.name + ", Initiative " + section.speed);
            section.units.forEach(function(unit) {
                let unitString = "----" + unit.name + ": " + unit.unitName + ", " + unit.hp + "/" + unit.hpMax + " Hull, " + unit.sp + "/" + unit.spMax + " Shield.";
                unitString += " Weapons:";
                unit.wSystems.forEach(function(system) {
                    unitString += ", " + system.name;
                })
                printString(unitString);
            })
        })
    })
    printString("=====");
}


// Functions

/**
 * Returns a random number from 1 to 100.
 */
const percentileRoll = function () {
    return Math.floor(Math.random()*100);
};
/**
 * Returns a random number for damage calculation.
 */
const damageRoll = function (max, min) {
    return Math.floor(Math.random() * (max - min) + min) + 1;
};

/**
 * Removes a unit from an array, and returns it for insertion into 
 */
const removeUnit = function (unit, array, deadArray) {
    const index = array.indexOf(unit);
    if (!!deadArray) {
        deadArray.push(unit);
    }
    if (index !== -1) {
        array.splice(index, 1);
    }
}

/**
 * Returns a random active element from the given array.
 */
const selectTarget = function (array) {
    let validTargets = array.filter(function(element) {
        return element.state === 'active';
    });
    return validTargets[Math.floor(Math.random()*validTargets.length)];
};

const checkGroups = function (allGroups) {
    allGroups.forEach(function (group) {
        if (group.state === "active") {
            let activeSections = 0;
            group.sections.forEach(function(section) {
                if (section.state === "active") activeSections += 1;
            });
            if (activeSections === 0) {
                group.state = "destroyed";
                console.log(group.name + " has been destroyed.")
            }
        }
    })
}

/**
 * Checks how many teams are still active in the fight.
 * @param {*} combatants    List of all combatantants
 */
const checkTeams = function (combatants) {
    // Get list of all teams
    let teams = new Set;
    combatants.forEach (function(group) {
        teams.add(group.team);
    });
    // Create a counter for each team
    let teamCounter = new Object;
    teams.forEach(function(team) {
        teamCounter[team] = new Object;
        teamCounter[team].count = 0;
        teamCounter[team].name = team;
    })
    // Add one for each active group on the designated team
    combatants.forEach(function(combatant) {
        if (combatant.state === "active") teamCounter[combatant.team].count += 1;
    });
    // Check how many team counts are above 0.
    let remainingTeams = 0;
    teams.forEach(function(team) {
        if (teamCounter[team].count > 0) remainingTeams += 1;
    })
    // Return the list of active teams.
    return remainingTeams;
}

/**
 * Calculates damage for an attack. Assigns to either shields or hull, and reduces by armour.
 */
const damageCalc = function (logObjTurn, weapon, atk, def) {
    let damage = damageRoll(weapon.maxDamage, weapon.minDamage);

    console.log(atk.name + " dealt " + damage);

    // If target has shields, resolve shield damage. Otherwise, resolve hull damage.
    if (def.sp > 0) {
        let newSp = def.sp - damage;
        
        // If we reduced sp to or below zero, the shield has been lost.
        if (newSp <= 0) {
            damage = def.sp;
            def.sp = 0;

            // Add Log Data
            logObjTurn.sBreak = true;
        } else {
            def.sp = newSp;
        }

        // Add Log Data
        atk.totalDamageDealt += damage;
        logObjTurn.spDam += damage;
    } else {
        // Reduce Hull damage by armor
        if (def.armor > 0) {
            let newDamage = damage - def.armor;

            // If we reduced damage to or below zero.
            if (newDamage <= 0) {
                // Add Log Data
                logObjTurn.soaks += 1;

                damage = 0;
            } else {
                // Add Log Data
                damage = newDamage;
            }
        }

        let newHp = def.hp - damage;
        
        // If we reduced hp to or below zero, the unit has been destroyed.
        if (newHp <= 0) {
            damage = def.hp;
            def.hp = 0;
            def.state = 'destroyed';

            // Add Log Data
            atk.kills += 1;
            logObjTurn.kill = true;
        } else {
            def.hp = newHp;
        }

        // Add Log Data
        atk.totalDamageDealt += damage;
        logObjTurn.hpDam += damage;
    }
};

/**
 * Behaviour for General Unit attack.
 */
const behaviourAttack = function (logArray, atk, targetSection) {

    // Redo Logs
    // Each Unit makes a behaviour. In an attack, each weapon system picks a target, and each weapon fires.
    // To start, log each attack: Miss, Hit, Soak, Damage, Kill.

    // Sample Log
    // Alpha takes a turn.
    // Alpha fires with GunSys at Beta. It hits 2 times! Deals 5 Shield Damage. Beta has lost shields!
    // Alpha fires with GunSys at Beta. It hits 0 times!
    // Alpha fires with GunSys at Beta. It hits 1 times! Damage has been soaked by armor.

    atk.wSystems.forEach(function(system) {
        
        if (targetSection.units.length > 0) {
            let def = selectTarget(targetSection.units);
            let evasion = def.evasion;

            let logObjTurn = new Object;
            logObjTurn.atk = atk;
            logObjTurn.def = def;
            logObjTurn.system = system;
            logObjTurn.hits = 0;
            logObjTurn.hpDam = 0;
            logObjTurn.spDam = 0;
            logObjTurn.soaks = 0;
            logObjTurn.kill = false;
            logObjTurn.sBreak = false;

            // For each weapon, roll an attack and resolve the damage
            // If we destroy the unit, remove it from targets and into casualties.
            // If target is not active, all shots miss.
            system.weapons.forEach(function(weapon) {
                // If the unit has not been destroyed.
                if (def.state === "active") {
                    const roll = percentileRoll() + weapon.accuracy;

                    // If attack hits, calculate damage.
                    if (roll >= evasion) {

                        // Log Data
                        logObjTurn.hits += 1;

                        damageCalc(logObjTurn, weapon, atk, def);

                        // If unit was destroyed by the attack, remove it.
                        if (def.state === "destroyed") {
                            removeUnit(def, targetSection.units, targetSection.casualties);
                            // If that was the last unit of the section, destroy it.
                            if (targetSection.units.length === 0) {
                                targetSection.state = "destroyed";
                                console.log("All units in " + targetSection.name + " destroyed.");
                            }
                        }
                    }
                } else {
                    console.log(atk.name + " has destroyed this unit. Shot misses.");
                }
            })

            // Log result of behaviour
            logArray.push(constructString(logObjTurn));
        }
    })
};

/**
 * Handles turn calculations.
 */
const passTurn = function (groupArray) {
    // Generate a Log Array
    let logArray = new Array;

    // Iterate through each group
    groupArray.forEach (function (activeGroup){

        // For each section, check if it is the section's turn.
        activeGroup.sections.forEach(function(activeSection) {
            if (activeSection.speed === 0 && activeSection.state === "active") {

                // Generate a list of target sections.
                let targetSectionsArray = new Array;
                groupArray.forEach (function (targetGroup){
                    if (activeGroup.team !== targetGroup.team){
                        targetSectionsArray = targetSectionsArray.concat(targetGroup.sections);
                    }
                })

                // Filter out invalid targets from targetSectionsArray
                targetSectionsArray = targetSectionsArray.filter(function(target) {
                    return target.units.length > 0;
                });

                // Check that there are valid sections to target.
                if (targetSectionsArray.length > 0) {
                    logArray.push(activeSection.name + " takes a turn. " + activeSection.units.length + " units within.");

                    // Select a random section. All units of active section will attack the units within.
                    let targetedSection = selectTarget(targetSectionsArray);

                    // TODO: Determine Behaviour of Section here.
                    
                    logArray.push(targetedSection.name + " has been targeted. " + targetedSection.units.length + " units within.");
                    logArray.push("----------");

                    activeSection.units.forEach(function(unit) {

                        // TODO: Alter behaviour based on Morale here.
                        // TODO: For each unit in section, execute behaviour.

                        // Check that there are any possible units left to target in the section.
                        if (targetedSection.units.length > 0) {
                            behaviourAttack(logArray, unit, targetedSection);
                        } else {
                            console.log(unit.name + " cannot find any units left in the enemy section.")
                        }

                        // Check if any group has been completely destroyed
                        checkGroups(groupArray);
                    });
                    logArray.push("----------");
                }

                // Reset speed/turn timer.
                activeSection.speed = Math.floor(Math.random()*3);
            } else { // If not your turn, tick speed.
                if (activeSection.state === "active") activeSection.speed -= 1;
            }
        });

    })

    // Print log array.
    printArray(logArray);
};


// Setup

// Can Either Use
// let RedForce = construct(
//     Group,
//     [[
//         construct(
//             Section,
//             [[
//                 construct(Unit, XWing, ["Red Alpha"]),
//                 construct(Unit, XWing, ["Red Beta"]),
//                 construct(Unit, XWing, ["Red Gamma"])
//             ]],
//             ["Red Raiders"]),
//         construct(
//             Section,
//             [[
//                 construct(Unit, XWing, ["Red Delta"]),
//                 construct(Unit, XWing, ["Red Epsilon"]),
//                 construct(Unit, XWing, ["Red Zeta"])
//             ]],
//             ["Red Roaders"])
//     ]],
//     ["Red Force", 1]);
//
// OR
//
// let RedForce = new Group(
//     "Red Force",
//     1,
//     [
//         new Section(
//             "Red Raiders",
//             [
//                 construct(Unit, XWing, ["Red Alpha"]),
//                 construct(Unit, XWing, ["Red Beta"]),
//                 construct(Unit, XWing, ["Red Gamma"]),
//             ]
//         ),
//         new Section(
//             "Red Roaders",
//             [
//                 construct(Unit, XWing, ["Red Alpha"]),
//                 construct(Unit, XWing, ["Red Beta"]),
//                 construct(Unit, XWing, ["Red Gamma"]),
//             ]
//         ),
//     ]
// )

let RedForce = new Group(
    "Red Force",
    1,
    [
        new Section(
            "Red Rack",
            [
                construct(Unit, Imperial1, ["Red Empire"])
            ]
        ),
    ]
)

let BlueForce = new Group(
    "Blue Force",
    2,
    [
        new Section(
            "Blue Ball",
            [
                construct(Unit, Imperial1, ["Blue Empire"])
            ]
        ),
    ]
)

let GreenForce = new Group(
    "Green Force",
    2,
    [
        new Section(
            "Green Gunners",
            [
                construct(Unit, XWing, ["Green Alpha"]),
                construct(Unit, XWing, ["Green Beta"]),
                construct(Unit, XWing, ["Green Gamma"]),
            ]
        ),
        new Section(
            "Green Garrison",
            [
                construct(Unit, XWing, ["Green Delta"]),
                construct(Unit, XWing, ["Green Epsilon"]),
                construct(Unit, XWing, ["Green Zeta"]),
            ]
        ),
    ]
)

// Execution

// Battle Loop
let combatants = new Array;
combatants.push(RedForce);
combatants.push(BlueForce);
// combatants.push(GreenForce);
// combatants.push(YellowForce);

printString("Combat Start");
printString("=====");
displayCombatants(combatants);
for (let i = 0; i < 100; i++) {
    const remainingTeams = checkTeams(combatants);
    
    if (remainingTeams === 1) {
        printString("Combat has ended!");
        i = 100;
        displayCombatants(combatants);
    } else if (remainingTeams === 0) {
        printString("Somehow, everyone is dead. Whoops!");
        displayCombatants(combatants);
        i = 100;
    } else {
        if (i !== 0 && i % 5 === 0) displayCombatants(combatants);
        passTurn(combatants);
    }

}