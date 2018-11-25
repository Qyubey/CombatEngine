// SW

// TODO List

// Refactor Weapon Range.

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

// Add Weapon Ranges
// Weapons have a range they work best at; close and long range.
// Weapons can fire in either range, but recieve a To-Hit penalty for inappropriate range.
// This simulates large weapons working best at range, and small weapons working best up close.
// Range should be optional, for weapons for which range doesn't matter.

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

function Group (sections, name, team) {
    this.sections = sections;
    this.state = 'active';

    // construct args
    this.name = name;
    this.team = team;
}
function Section (units, name) {
    this.units = units;
    this.speed = 0;
    this.casualties = new Array;
    this.escapees = new Array;
    this.state = 'active';

    // construct args
    this.name = name;
}
function Unit (unitName, type, hp, sp, armor, speed, evasion, wSystems, behaviours, name) {
    this.unitName = unitName;
    this.type = type;
    this.hp = hp;
    this.sp = sp;
    this.hpMax = hp;
    this.spMax = sp;
    this.armor = armor;
    this.speed = speed;
    this.evasion = evasion;
    this.wSystems = wSystems;
    this.behaviours = behaviours;
    this.kills = 0;
    this.totalDamageDealt = 0;
    this.state = 'active';

    // construct args
    this.name = name;
}
function WeaponSystem (name, weapons, setting) {
    this.name = name;
    this.weapons = weapons;
    this.state = 'active';

    // construct args
    this.setting = setting;
}
function Weapon (name, minDamage, maxDamage, damageType, accuracy, range) {
    this.name = name;
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
    this.damageType = damageType;
    this.accuracy = accuracy;
    this.range = range;
    this.state = 'active';
}

/**
 * Allows calling of a constuctor function using an array of arguements.
 * @param {*} constructor   the constructor we are calling
 * @param {*} args          the arguements for the constructor
 * @param {*} additions     any additions, such as name, to unshift to the start
 */
function construct(constructor, args, additions) {
    if (additions) {
        args = args.concat(additions);
    }
    function F() {
        return constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;
    return new F();
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
    const systemName = log.system.name + " (" + log.system.weapons.length + ")"

    if (!log.def) return "DEBUG: All defenders killed. Invalid target.";

    // Log initial activity.
    logString += log.atk.name + " fires at " + log.def.name + " using " + systemName + "."

    // How many hits
    if (log.hits > 1) logString += " It hit " + log.hits + " times!";
    else if (log.hits === 1) logString += " It hit!";
    else logString += " " + log.atk.name + " missed their shots against " + log.def.name + ". ";

    // If damage was soaked by armour.
    if (log.soaks > 0) logString += " " + log.soaks + " shots were soaked by armour. ";

    // Tabulate all damage against a single target's shields.
    if (log.spDam > 0) logString += " " + log.atk.name + " dealt " + log.spDam + " shield damage. ";

    // Display extra damage from ion hitting shields.
    if (log.ionDam > 0) logString += " " + log.ionDam + " extra damage from ion weapons. ";

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
 * Displays a general status log for all groups.
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


// General Functions

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

/**
 * Check if the group is still active, or all sections have been destroyed.
 */
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
 * Checks if the section has any units with PD weapon systems.
 */
const hasPointDefense = function (section) {
    let pdFound = false;
    section.units.forEach(function(unit) {
        unit.wSystems.forEach(function(system){
            if (system.setting === "pointDefense") {
                pdFound = true;
            }
        });
    }) 
    return pdFound;
}

// Attack functions

// Turn Log Constructor
function LogTurnObject (atk, def, system) {
    this.atk = atk;
    this.def = def;
    this.system = system;
    
    this.hits = 0;
    this.hpDam = 0;
    this.spDam = 0;
    this.ionDam = 0;
    this.soaks = 0;
    this.kill = false;
    this.sBreak = false;
}

/**
 * Calculates damage for an attack. Assigns to either shields or hull, and reduces by armour.
 */
const damageCalc = function (logObjTurn, weapon, atk, def) {
    let damage = damageRoll(weapon.maxDamage, weapon.minDamage);

    // If target has shields, resolve shield damage. Otherwise, resolve hull damage.
    if (def.sp > 0) {
        if (weapon.damageType === "ion") {
            damage *= 1.5;
            logObjTurn.ionDam = (damage * 1.5) - damage;
        }
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
 * Rolls an attack against a defender. If defender dies, they are removed from their section.
 */
const rollAttack = function (logObjTurn, weapon, atk, def, defSection, engageRange) {
    // If the unit has not been destroyed.
    if (def.state === "active") {

        // TODO: Refactor range penalties.
        let rangePenality = 0;
        // if (engageRange && weapon.range !== engageRange) rangePenality -= 50;

        const roll = percentileRoll() + weapon.accuracy + rangePenality;

        // If attack hits, calculate damage.
        if (roll >= def.evasion) {
            // Log Data
            logObjTurn.hits += 1;

            damageCalc(logObjTurn, weapon, atk, def);

            // If unit was destroyed by the attack, remove it.
            if (def.state === "destroyed") {
                removeUnit(def, defSection.units, defSection.casualties);
                // If that was the last unit of the section, destroy it.
                if (defSection.units.length === 0) {
                    defSection.state = "destroyed";
                    console.log("All units in " + defSection.name + " destroyed.");
                }
            }
        }
    } else {
        console.log(atk.name + " has destroyed this unit. Shot misses.");
    }
}

/**
 * Selects targets for each weapon system on the attacker.
 */
const selectSystemTargets = function (logArray, atk, targetSection, activeSetting, engageRange) {
    // Systems grab valid targets.
    atk.wSystems.forEach(function(system) {

        if (system.setting === activeSetting && targetSection.units.length > 0) {
            let def = selectTarget(targetSection.units);
            let logObjTurn = new LogTurnObject(atk, def, system);

            // For each weapon, roll an attack and resolve the damage
            // If we destroy the unit, remove it from targets and into casualties.
            // If target is not active, all shots miss.
            system.weapons.forEach(function(weapon) {
                rollAttack(logObjTurn, weapon, atk, def, targetSection, engageRange);
            })

            // Log result of attack
            if (!!logObjTurn) logArray.push(constructString(logObjTurn));
        
        }
    })
}

// Ship Behaviours

// CloseAttack: Unit attacks at close range using Primary weapons. PD retaliation.
const behaviourCloseAttack = function (logArray, atk, targetSection) {
    logArray.push(atk.name + " initiates close attack.");
    let activeSetting = "primary";
    let engageRange = "close";

    selectSystemTargets(logArray, atk, targetSection, activeSetting, engageRange);

}
// LongAttack: Unit attacks at long range using Primary weapons. No PD.
const behaviourLongAttack = function (logArray, atk, targetSection) {
    logArray.push(atk.name + " initiates long attack.");
    let activeSetting = "primary";
    let engageRange = "long";

    selectSystemTargets(logArray, atk, targetSection, activeSetting, engageRange);

}
// Flee: Unit attempts to leave combat. Does not attack.
const behaviourFlee = function (logArray, unit, unitSection) {
    logArray.push(unit.name + " hyperspaces away!");
    removeUnit(unit, unitSection.units, unitSection.escapees);
    // If that was the last unit of the section, destroy it.
    if (unitSection.units.length === 0) {
        unitSection.state = "destroyed";
        console.log("All units in " + unitSection.name + " destroyed.");
    }
}
// PD: Unit fires PD weapons before they are attacked.
const behaviourPD = function (logArray, atk, targetSection) {
    logArray.push(atk.name + " initiates point defense.");
    let activeSetting = "pointDefense";
    let engageRange = "close";

    selectSystemTargets(logArray, atk, targetSection, activeSetting, engageRange);
}
/**
 * Behaviour for General Unit attack.
 */
const behaviourAttack = function (logArray, atk, targetSection) {
    logArray.push(atk.name + " initiates general attack.");
    let activeSetting = "primary";

    selectSystemTargets(logArray, atk, targetSection, activeSetting);
};


// Turn Functions

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

                // Generate a list of possible target sections.
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

                    // Collect unique behaviours from units.
                    let validBehaviours = new Set;
                    activeSection.units.forEach(function(unit) {
                        unit.behaviours.forEach(function(behaviour) {
                            validBehaviours.add(behaviour);
                        })
                    });
                    validBehaviours = Array.from(validBehaviours);
                    let sectionBehaviour = validBehaviours[Math.floor(Math.random()*validBehaviours.length)];
                    
                    logArray.push(targetedSection.name + " has been targeted. " + targetedSection.units.length + " units within.");
                    logArray.push(sectionBehaviour.prototype.constructor.name)
                    logArray.push("----------");

                    // Check if behavior engenders Point Defense
                    if (sectionBehaviour === behaviourCloseAttack) {
                        if (hasPointDefense(targetedSection)) {
                            targetedSection.units.forEach(function(unit) {

                                // Check that there are any possible units left to target in the section.
                                if (activeSection.units.length > 0) {
                                    behaviourPD(logArray, unit, activeSection);
                                } else {
                                    console.log(unit.name + " cannot find any units left in the enemy section.")
                                }
        
                                // Check if any group has been completely destroyed
                                checkGroups(groupArray);
                            })
                        }
                    }

                    // Create a temporary list of units, in case they flee or are destroyed.
                    let unitList = new Array;
                    unitList = unitList.concat(activeSection.units);
                    unitList.forEach(function(unit) {

                        // Check for Conditional Behaviour, such as Fleeing.
                        if (unit.hp <= 3) {
                            logArray.push(unit.name + " has panicked. It only has " + unit.hp + " hp remaining.");
                            sectionBehaviour = behaviourFlee;
                            sectionBehaviour(logArray, unit, activeSection);
                        } else {
                            // Check that there are any possible units left to target in the section.
                            if (targetedSection.units.length > 0) {
                                sectionBehaviour(logArray, unit, targetedSection);
                            } else {
                                console.log(unit.name + " cannot find any units left in the enemy section.")
                            }
                        }
                        console.log(unit.name);

                        // Check if any group has been completely destroyed
                        checkGroups(groupArray);
                    });
                    logArray.push("----------");
                }

                // Reset speed/turn timer.
                setSpeed(activeSection);
            } else { // If not your turn, tick speed.
                if (activeSection.state === "active") activeSection.speed -= 1;
            }
        });

    })

    // Print log array.
    printArray(logArray);
};

// Models

// Weapons
const KX9LaserCannon = [
    "KX9 Laser Cannon",
    1,
    5,
    "energy",
    25,
    "close"
]
const H9Turbolaser = [
    "H9 Turbolaser",
    5,
    10,
    "energy",
    -10,
    "long"
]
const XX9HeavyTurbolaser = [
    "XX9 Heavy Turbolaser",
    20,
    30,
    "energy",
    -25,
    "long"
]
const NK7IonCannon = [
    "NK-7 Ion Cannon",
    10,
    20,
    "ion",
    -20,
    "long"
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
    "XX9 Heavy Turbolaser Grid",
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
    "NK-7 Ion Cannon Grid",
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
    "NK-7 Ion Cannon Grid",
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
    "NK-7 Ion Cannon Grid",
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
    "Fighter",
    10,
    10,
    1,
    2,
    65,
    [
        construct(WeaponSystem, KX9LaserArray, ["primary"])
    ],
    [behaviourCloseAttack]
];
const CR90Corvette = [
    "CR90 'Corellian' Corvette",
    "Corvette",
    30,
    20,
    3,
    5,
    45,
    [
        construct(WeaponSystem, H9DualTurbolaserTurret, ["primary"]),
        construct(WeaponSystem, H9DualTurbolaserTurret, ["primary"]),
        construct(WeaponSystem, H9TurbolaserTurret, ["primary"]),
        construct(WeaponSystem, H9TurbolaserTurret, ["primary"]),
        construct(WeaponSystem, H9TurbolaserTurret, ["pointDefense"]),
        construct(WeaponSystem, H9TurbolaserTurret, ["pointDefense"])
    ],
    [behaviourLongAttack]
];
const Imperial1 = [
    "Imperial I-class Star Destroyer",
    "Capital",
    1000,
    1000,
    5,
    10,
    5,
    [
        construct(WeaponSystem, XX9HeavyTurbolaserx20, ["primary"]),
        construct(WeaponSystem, XX9HeavyTurbolaserx20, ["secondary"]),
        construct(WeaponSystem, XX9HeavyTurbolaserx20, ["pointDefense"]),

        construct(WeaponSystem, NK7IonCannonx20, ["primary"]),
        construct(WeaponSystem, NK7IonCannonx15, ["secondary"]),
        construct(WeaponSystem, NK7IonCannonx15, ["secondary"]),
        construct(WeaponSystem, NK7IonCannonx10, ["pointDefense"]),

        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret, ["primary"]),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret, ["primary"]),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret, ["primary"]),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret, ["primary"]),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret, ["secondary"]),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret, ["secondary"]),

        construct(WeaponSystem, NK7DualHeavyIonCannonTurret, ["primary"]),
        construct(WeaponSystem, NK7DualHeavyIonCannonTurret, ["primary"]),

        construct(WeaponSystem, XX9QuadHeavyTurbolaserTurret, ["primary"]),
        construct(WeaponSystem, XX9QuadHeavyTurbolaserTurret, ["primary"]),

        construct(WeaponSystem, XX9TripleHeavyTurbolaserTurret, ["primary"]),
        construct(WeaponSystem, XX9TripleHeavyTurbolaserTurret, ["primary"]),
        construct(WeaponSystem, XX9TripleHeavyTurbolaserTurret, ["primary"]),

        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret, ["primary"]),
        construct(WeaponSystem, XX9DualHeavyTurbolaserTurret, ["primary"]),
    ],
    [behaviourLongAttack]
];


// Setup

let RedForce = new Group(
    [
        new Section(
            [
                // construct(Unit, Imperial1, ["Imperial-1"]),
                construct(Unit, XWing, ["Red Alpha"]),
                construct(Unit, XWing, ["Red Beta"]),
                construct(Unit, XWing, ["Red Gamma"]),
                construct(Unit, XWing, ["Red Delta"]),
                construct(Unit, XWing, ["Red Epsilon"]),
                construct(Unit, XWing, ["Red Zeta"]),
                // construct(Unit, CR90Corvette, ["Blockrunner"]),
                // construct(Unit, CR90Corvette, ["Hammerhead"]),
            ],
            "Red Raiders"
        ),
    ],
    "Red Force",
    1
)

let BlueForce = new Group(
    [
        new Section(
            [
                construct(Unit, Imperial1, ["Imperial-1"])
            ],
            "Blue Ball"
        ),
    ],
    "Blue Force",
    2
)

let GreenForce = new Group(
    [
        new Section(
            [
                construct(Unit, XWing, ["Green Alpha"]),
                construct(Unit, XWing, ["Green Beta"]),
                construct(Unit, XWing, ["Green Gamma"]),
            ],
            "Green Gunners"
        ),
        new Section(
            [
                construct(Unit, XWing, ["Green Delta"]),
                construct(Unit, XWing, ["Green Epsilon"]),
                construct(Unit, XWing, ["Green Zeta"]),
            ],
            "Green Garrison"
        ),
    ],
    "Green Force",
    3
)

// Execution

console.log(GreenForce)

/**
 * Find the highest speed of units within the section
 */
const setSpeed = function (section) {
    let highestSpeed = 0;
    section.units.forEach(function(unit) {
        if (unit.speed > highestSpeed) highestSpeed = unit.speed;
    })
    // section.speed = Math.floor(Math.random()*highestSpeed);
    section.speed = highestSpeed;
}

// Battle Loop
let combatants = new Array;
combatants.push(RedForce);
// combatants.push(BlueForce);
combatants.push(GreenForce);
// combatants.push(YellowForce);

combatants.forEach(function(combatant) {
    combatant.sections.forEach(function(section) {
        setSpeed(section);
    })
});

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
        if (i > 0 && i % 10 === 0) displayCombatants(combatants);
        passTurn(combatants);
    }

}