// SW

// TODO: Refactor loops so they cancel out when there are no valid targets.

// TODO: Add web functionality. Set up armies and manually play turns from HTML.
// Log combat turns to HTML properly.

// TODO: List all details of all Units, Weapons, Components to external file.
// Allow easy construction of units from said file.
// Export behaviour functions to external file. Clears up space.

// TODO: Add in behaviour functions for fleeing and panic.
// Add a morale function to check if unit should change behaviour.
// Add in Disabled function for when ship hull gets low enough.
// Move Disabled ships into Disabled array.
// Disabled array is targetable for Aggressive Attack.

// TODO: Add in more ship types. Fighter, Corvette, Frigate, Capital.
// Add in more Weapon Systems.
// Refactor Shields. Add Bypass and Drain.
// Add in Armour reduction. Add Pierce and Shred.
// Add in Components. Shield Gen, Bridge, Engines, Battery, etc.

// TODO: Add in AI behaviours
// Add in Bombing Run behaviour. Could be general attack.
// Add in Aggressive Attack / No Survivors. Allows killing Disabled.
// Add in Covering Fire behaviour. Adds counter-attack for another Section.
// Add in Evasive Manouvre. Makes Section harder to hit til their next turn.
// Add in Flee. Section attempts to leave the battle.

// TODO: Add in carrier functionality.
// Carriers must launch Sections. Are added into Sections array from Carrier Unit.
// Damaged sections can dock with carrier to repair hp and shields. Are removed from Sections array and placed back in Carrier Unit.
// Sections are Destroyed or Disabled if Hangar is destroyed, or Carrier is disabled.
// Sections are Destroyed if Carrier is Destroyed.

// TODO: Consider adding distance functionality. Ships must move to engage.

// Templates
function Group (name, sections, team) {
    this.name = name;
    this.sections = sections;
    this.team = team;
    this.state = 'active'
}
function Section (name, units, speed) {
    this.name = name;
    this.units = units;
    this.speed = speed;
    this.casualties = [];
    this.state = 'active'
}
function Unit (name, unitName, wSystems, hp, sp, armor, evasion) {
    this.name = name;
    this.unitName = unitName;
    this.wSystems = wSystems;
    this.hp = hp;
    this.sp = sp;
    this.hpMax = hp;
    this.spMax = sp;
    this.armor = armor;
    this.evasion = evasion;
    this.kills = 0;
    this.totalDamageDealt = 0;
    this.state = 'active'
}
function WeaponSystem (name, weapons) {
    this.name = name;
    this.weapons = weapons;
    this.state = 'active'
}
function Weapon (name, damage) {
    this.name = name;
    this.damage = damage;
    this.state = 'active'
}


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

    // How many hits
    if (log.hits > 0) logString += log.atk.name + " hit " + log.def.name + " " + log.hits + " times using " + log.system.name + ". ";
    else logString += log.atk.name + " missed their shots against " + log.def.name + ". ";
    // If damage was soaked by armour.
    if (log.soaks > 0) logString += log.soaks + " shots were soaked by armour. ";
    // Tabulate all damage against a single target's shields.
    if (log.spDam > 0) logString += log.atk.name + " dealt " + log.spDam + " shield damage. ";
    // If they lost shields.
    if (log.sBreak > 0) logString += " " + log.def.name + " has lost shields! ";
    // Tabulate all damage against a single target's hull.
    if (log.hpDam > 0) logString += log.atk.name + " dealt " + log.hpDam + " hull damage. ";
    // If they were disabled.
    if (log.disables > 0) logString += " " + log.def.name + " has been disabled! ";
    // If they were destroyed.
    if (log.kills > 0) logString += " " + log.def.name + " has been destroyed! ";
    else logString += log.def.name + ": ";
    if (log.def.sp > 0) logString += log.def.sp + "/" + log.def.spMax + " SP. ";
    if (log.def.hp > 0)  logString += log.def.hp + "/" + log.def.hpMax + " HP.";

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
                let unitString = "----" + unit.name + ": " + unit.unitName + ", " + unit.hp + "/10 Hull, " + unit.sp + "/10 Shield, ";
                unit.wSystems.forEach(function(system) {
                    unitString += system.name;
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
const damageRoll = function (max) {
    return Math.floor(Math.random()*max) + 1;
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
    let damage = damageRoll(weapon.damage);

    // If target has shields, resolve shield damage. Otherwise, resolve hull damage.
    if (def.sp > 0) {
        let newSp = def.sp - damage;
        
        // If we reduced sp to or below zero, the shield has been lost.
        if (newSp <= 0) {
            damage = def.sp;
            def.sp = 0;

            // Add Log Data
            logObjTurn.sBreak += 1;
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
                logObjTurn.armorReduction += damage;

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
            logObjTurn.kills += 1;
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
    let logObjTurn = new Object;
    logObjTurn.hits = 0;
    logObjTurn.atk = atk;
    logObjTurn.hpDam = 0;
    logObjTurn.spDam = 0;
    logObjTurn.kills = 0;
    logObjTurn.sBreak = 0;
    logObjTurn.soaks = 0;

    atk.wSystems.forEach(function(system) {
        logObjTurn.system = system;
        let def = selectTarget(targetSection.units);
        let evasion = def.evasion;
        logObjTurn.def = def;

        // For each weapon, roll an attack and resolve the damage
        // If we destroy the unit, remove it from targets and into casualties.
        // If target is not active, all shots miss.
        system.weapons.forEach(function(weapon) {
            // If the unit has not been destroyed.
            if (def.state === "active") {
                const roll = percentileRoll();

                // If attack hits, calculate damage.
                if (roll >= evasion) {

                    // Log Data
                    logObjTurn.hits += 1;

                    damageCalc(logObjTurn, weapon, atk, def);

                    if (def.state === "destroyed") {
                        removeUnit(def, targetSection.units, targetSection.casualties);
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
    })

    // Log result of behaviour
    logArray.push(constructString(logObjTurn));
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

let RedForce = new Group(
    "Red Force",
    [
        new Section(
            "Red Raiders",
            [
                new Unit("Red Alpha", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array",
                        [
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                        ])
                ], 10, 10, 1, 50),
                new Unit("Red Beta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array",
                        [
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                        ])
                ], 10, 10, 1, 50),
                new Unit("Red Gamma", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array",
                        [
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                        ])
                ], 10, 10, 1, 50),
            ],
            Math.floor(Math.random() * 3)
        ),
        new Section(
            "Red Roaders",
            [
                new Unit("Red Delta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array",
                        [
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                        ])
                ], 10, 10, 1, 50),
                new Unit("Red Epsilon", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array",
                        [
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                        ])
                ], 10, 10, 1, 50),
                new Unit("Red Zeta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array",
                        [
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                        ])
                ], 10, 10, 1, 50),
            ],
            Math.floor(Math.random() * 3)
        )
    ], 1
)

let BlueForce = new Group(
    "Blue Force",
    [
        new Section(
            "Blue Band",
            [
                new Unit("Blue Alpha", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
                new Unit("Blue Beta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
                new Unit("Blue Gamma", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                        [
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                        ])
                ], 10, 10, 1, 50),
            ],
            Math.floor(Math.random()*3)
        ),
        new Section(
            "Blue Brigade",
            [
                new Unit("Blue Delta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
                new Unit("Blue Epsilon", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
                new Unit("Blue Zeta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
            ],
            Math.floor(Math.random()*3)
        )
    ], 1
)

let GreenForce = new Group(
    "Green Force",
    [
        new Section(
            "Green Garrison",
            [
                new Unit("Green Alpha", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
                new Unit("Green Beta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
                new Unit("Green Gamma", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                        [
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                        ])
                ], 10, 10, 1, 50),
            ],
            Math.floor(Math.random()*3)
        ),
        new Section(
            "Green Guass",
            [
                new Unit("Green Delta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
                new Unit("Green Epsilon", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
                new Unit("Green Zeta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
            ],
            Math.floor(Math.random()*3)
        )
    ], 2
)

let YellowForce = new Group(
    "Yellow Force",
    [
        new Section(
            "Yellow Yattas",
            [
                new Unit("Yellow Alpha", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
                new Unit("Yellow Beta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
                new Unit("Yellow Gamma", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                        [
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                            new Weapon("KX9 Laser Cannon", 5),
                        ])
                ], 10, 10, 1, 50),
            ],
            Math.floor(Math.random()*3)
        ),
        new Section(
            "Yellow Yard",
            [
                new Unit("Yellow Delta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
                new Unit("Yellow Epsilon", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
                new Unit("Yellow Zeta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                        new Weapon("KX9 Laser Cannon", 5),
                    ])
                ], 10, 10, 1, 50),
            ],
            Math.floor(Math.random()*3)
        )
    ], 2
)

// Execution

// Battle Loop
let combatants = new Array;
combatants.push(RedForce);
combatants.push(BlueForce);
combatants.push(GreenForce);
combatants.push(YellowForce);

printString("Combat Start");
printString("=====");
displayCombatants(combatants);
for (let i = 0; i < 100; i++) {
    const remainingTeams = checkTeams(combatants);
    
    if (remainingTeams === 1) {
        combatants.forEach(function(combatant) {
            if (combatant.state === "active") {
                printString("The winner is " + combatant.name + "!");
                displayCombatants(combatants);
                i = 100;
            }
        })
    } else if (remainingTeams === 0) {
        printString("Somehow, everyone is dead. Whoops!");
        displayCombatants(combatants);
        i = 100;
    }
    
    else {
        if (i !== 0 && i % 5 === 0) displayCombatants(combatants);
        passTurn(combatants);
    }

}