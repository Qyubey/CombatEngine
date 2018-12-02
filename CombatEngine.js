// SW

// Future Ideas

// Normalize all statistics so any unit could fight another.
// This is purely for fun and simulation, such as ground forces firing at a capital ship.

// Import into Unity to provide better application and UI functions.
// Could sell as a PC game or Mobile app.

// Create libraries for various things.
// Star Wars, Star Trek, Battlestar Galactica, Stargate, Halo, Lord of the Rings, Game of Thrones, Superheroes, XCOM.
// Real world time periods; such as modern, WW1, WW2, Medieval, Antiquity, Stone age, etc.

// Conquer/Campaign mode.
// Strategic map mode like Empire At War, Dawn of War, or Civ.
// Map consists of strategic nodes, which could represent anything.
// Nodes can also have maps inside them. This allows simulation of planets, to ground locations, to even individual cities.
// Economic and Diplomatic functionality.
// Each faction generates revenue or resources. Can build on strategic nodes, and construct units.
// Could engage diplomacy with the AI, or other players.
// Save campaigns mid-way through and reload later.

// Could be played multiplayer, either in realtime on map until a battle, or in turns. Or timed turns.
// Load custom libraries and games, have other players download the library files.
// Loading saved multiplayer games lets you slot players into factions, can switch midway through.
// Host player hosts everything, can edit details of save or campaign. GM priviledges.


// Version 1 features

// Add AI General.
// Acts for Section and Individual units. Selects targets.
// AI Types are derived from the design. May be overridden.
// Fighters and Corvettes will engage fighters, close range first.
// Frigates and Capitals attack the highest threat (damage potential) ships first.
// Regarldess of type, sections will generally continue attacking their target section until it is destroyed.
// Add AI Specific.
// Target Light will target fighters and corvettes.
// Target Heavy will target capitals and frigates.
// Target Type will target only that unit type.
// Target Single will target a single section. Possibly a single unit as well.

// Add Regions.
// There are regions in a combat zone. All share borders with each other and the outside.
// The amount of regions is 3 x the number of groups. These are considered; Middle, and Left/Right Flanks.
// Sections exist in regions, and regions determine range.
// If two sections are in the same region, they are in close range. Otherwise, they are at long range.
// Sections can move to another region by performing move behaviour on their turn.
// If a section wants to close attack another unit in a different section, it will instead move to that section first.

// Add Ranges
// Weapons have a range they work best at; close or long range.
// Weapons may be locked to a specific range, or simply take to-hit penalties for attacking at the wrong range.
// Weapons may be set to only attack in a specific range.
// Sections may have a range they will only fire at, or may randomly select between the two.

// Add Weapon System Setting.
// Weapons can be set to a couple of different settings that determine if they will be used during an action.
// Primary: Fires on any target during your attack.
// Secondary: Only attacks while ammo/power is high.
// Reserve: Only attacks during a designated behaviour.
// Point-Defense: Retaliates against attackers on their attack.
// Anti-Fighter: Only attacks Fighter and Corvette units during your attack.
// Anti-Capital: Only attacks Frigate and Capital units during your attack.

// Add more Weapon types, and power/ammo systems.
// Lasers       use low power,  do low damage,  high accuracy.
// Turbolasers  use high power, do high damage, low accuracy.
// Missiles     use ammo,       medium damage,  high accuracy.
// Bombs        use ammo,       high damage,    low accuracy.
// Power weapons will need to cool down after shots.
// Ammo weapons can be expended and will need to be restocked.

// Refactor Shields. Add Bypass and Drain.
// Drain allows weapons to deal 1.5x more damage against shields.
// Bypass allows weapons to completely bypass a certain amount of shields.
// Refactor Armour. Add Pierce and Shred.
// Shred allows weapons to reduce the armour of a target on an attack
// Pierce allows weapons to completely bypass a certain amount of armor.
// Refactor Hull. Add Impact.
// Impact allows weapons to deal 1.5x more damage against hull/health.

// Add in Components. Shield Gen, Bridge, Engines, Battery, etc.

// Add in Behaviours/Actions
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

// List all details of all Units, Weapons, Components to external file.
// Allow easy construction of objects from said file.
// Export behaviour functions to external file. Clears up space.


// Version 2 features

// Manual turn buttons.
// Form list to edit groups mid-battle.
// Can set groups to be uneditable, for playable strategic battles.

// Add in carrier functionality.
// Carriers must launch Sections. Are added into Sections array from Carrier Unit.
// Damaged sections can dock with carrier to repair hp and shields. Are removed from Sections array and placed back in Carrier Unit.
// Sections are Destroyed or Disabled if Hangar is destroyed, or Carrier is disabled.
// Sections are Destroyed if Carrier is Destroyed.

// Version 3

// Add battlefields. Types for Space, Air, Sea, and Ground.
// Add two weapon ranges for Space/Air and Sea/Ground battles.
// For example; close space/air lasers may be long sea/ground. Long sea/ground weapons may be close space/air.
// Sea and Ground have unique regions for Above and Below.
// Sea above and Ground above are accessible only by flying units.
// Sea below is accessible only by submersible units.
// Ground below is accessible only by subterrain units.

// Add support for designs: Soldiers, Trucks, Tanks, Diggers, Sea Ships, Submarines, Planes.
// Could either give all types a unique name, or categorize them inside a battlefield type.

// Add more weapons like grenades, artillery cannons, melee weapons, torpedoes, etc.

// Allow libraries for Units, Weapons, Weapon Systems.

// Add Area Effect weapons. These target Regions themselves.
// Undodgable, they incur damage to all units within the region. Can include friendlies.

// Constructors

function Group (sections, name, team) {
    this.sections = sections;
    this.state = 'active';

    // construct args
    this.name = name;
    this.team = team;
}
function Section (units, name, targetPrefs) {
    this.units = units;
    this.speed = 0;
    this.casualties = [];
    this.escapees = [];
    this.state = 'active';
    this.id = '_' + Math.random().toString(36).substr(2, 9);

    // construct args
    this.name = name;
    this.targetPrefs = targetPrefs;
}
function Unit (design, type, hp, sp, armor, speed, evasion, wSystems, behaviours, name, targetPrefs) {
    this.design = design;
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
    this.components = [
        {name: "Engines", state: "active"},
        {name: "Shield Generator", state: "active"},
        {name: "Astrodroid", state: "active"},
    ]
    this.kills = 0;
    this.totalDamageDealt = 0;
    this.state = 'active';
    this.id = '_' + Math.random().toString(36).substr(2, 9);

    // construct args
    this.name = name;
    this.targetPrefs = targetPrefs;

    if (this.wSystems.length > 0) addWSystemsAsComponents(this);
}
function addWSystemsAsComponents (Unit) {
    Unit.wSystems.forEach(function(system) {
        Unit.components.push(system);
    });
}

function WeaponSystem (name, weapons, setting, targetPrefs) {
    this.name = name;
    this.weapons = weapons;
    this.state = 'active';
    this.type = "wSystem";
    this.id = '_' + Math.random().toString(36).substr(2, 9);

    // construct args
    this.setting = setting;
    this.targetPrefs = targetPrefs;
}
function Weapon (name, minDamage, maxDamage, damageType, accuracy, range) {
    this.name = name;
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
    this.damageType = damageType;
    this.accuracy = accuracy;
    this.range = range;
    this.state = 'active';
    this.id = '_' + Math.random().toString(36).substr(2, 9);
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

    // If a component was destroyed.
    if (log.compDest.length > 0) {
        log.compDest.forEach(function(comp) {
            logString += " " + comp.name + " was destroyed!";
        });
    }

    // // If they were disabled.
    // if (log.disables > 0) logString += " " + log.def.name + " has been disabled! ";

    // If they were destroyed.
    if (log.kill === true) logString += " " + log.def.name + " has been destroyed! ";

    return logString;
};

/**
 * Displays a general status log for all groups.
 */
const displayCombatants = function (groups) {
    printString("Combatants:");
    printString("-----");
    groups.forEach(function(group) {
        printString(group.name + ": Team " + group.team);
        group.sections.forEach(function(section) {
            printString("--" + section.name + ", Initiative " + section.speed);
            section.units.forEach(function(unit) {
                let unitString = "----" + unit.name + ": " + unit.design + ", " + unit.hp + "/" + unit.hpMax + " Hull, " + unit.sp + "/" + unit.spMax + " Shield.";
                unitString += " Weapons:";
                unit.wSystems.forEach(function(system) {
                    unitString += ", " + system.name;
                })
                printString(unitString);
            })
            if (section.casualties.length > 0) {
                let casualtyString = "Casualties: " + section.casualties.length + " - ";
                section.casualties.forEach(function(casualty) {
                    casualtyString += casualty.name + ", ";
                })
                printString(casualtyString);
            }
            if (section.escapees.length > 0) {
                let escapeeString = "Escapees: " + section.escapees.length + " - ";
                section.escapees.forEach(function(escapee) {
                    escapeeString += escapee.name + ", ";
                })
                printString(escapeeString);
            }
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
const removeUnit = function (unit, activeArray, deadArray) {
    const index = activeArray.indexOf(unit);
    if (deadArray) {
        deadArray.push(unit);
    }
    if (index !== -1) {
        activeArray.splice(index, 1);
    }
}

/**
 * Returns a random active element from the given array.
 */
const selectRandomTarget = function (array) {
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
    let teamCounter = {};
    teams.forEach(function(team) {
        teamCounter[team] = {};
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
 * Checks if the item has any PD weapon systems.
 */
const hasPointDefense = function (checkitem) {
    let pdFound = false;
    if (checkitem.units) {
        checkitem.units.forEach(function(unit) {
            unit.wSystems.forEach(function(system){
                if (system.setting === "pointDefense") {
                    pdFound = true;
                }
            });
        })
    } else {
        checkitem.wSystems.forEach(function(system){
            if (system.setting === "pointDefense") {
                pdFound = true;
            }
        });
    }
    return pdFound;
}

/**
 * Checks if the item has any the range for this attack.
 */
const hasWeaponWithRange = function (checkitem, range) {
    let hasRange = false;
    checkitem.wSystems.forEach(function(system){
        system.weapons.forEach(function(weapon) {
            if (weapon.range === range) {
                hasRange = true;
            }
        })
    });
    return hasRange;
}

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

/**
 * Sorts the array provided by a certain preference. Works for numeric values, high and low, and strings.
 * @param {*} targetUnits   Array of target units in a section.
 * @param {*} targetPref    An object containing the target preference details.
 */
const sortByPreference = function (targetArray, targetPrefs) {
    // Disassemble targetPrefs. Type used for unit variable, order used for "high" or "low", and value used for sorting by a desired string or number.
    let prefType = targetPrefs.type;
    let prefOrder = targetPrefs.order;
    let prefValue = targetPrefs.value;
    
    const valueSortHighest = function (a, b) {
        if (a[prefType] > b[prefType])
            return -1;
        if (a[prefType] < b[prefType])
            return 1;
        return 0;
    }
    const valueSortLowest = function (a, b) {
        if (a[prefType] < b[prefType])
            return -1;
        if (a[prefType] > b[prefType])
            return 1;
        return 0;
    }
    const typeSort = function (a, b) {
        if (a[prefType] === prefValue)
            return -1;
        else if (b[prefType] === prefValue)
            return 1;
        return 0;
    }

    if (prefValue) {
        return targetArray.sort(typeSort);
    } else if (prefOrder === "high") {
        return targetArray.sort(valueSortHighest);
    } else {
        return targetArray.sort(valueSortLowest);
    }
}

/**
 * Sepcialised sorter for checking types of units inside.
 * @param {*} targetUnits   Array of target units in a section.
 * @param {*} targetPref    An object containing the target preference details.
 */
const sortSectionByUnitPreference = function (targetArray, targetPrefs) {
    let prefValue = targetPrefs.value;
    
    const typeSort = function (a, b) {
        if (a.types.indexOf(prefValue) > -1)
            return -1;
        else if (b.types.indexOf(prefValue) > -1)
            return 1;
        return 0;
    }

    targetArray.forEach(function(section) {
        foundTypes = new Set;
        section.units.forEach(function(unit) {
            foundTypes.add(unit.type);
        })
        section.types = Array.from(foundTypes);
    })

    return targetArray.sort(typeSort);
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
    this.compDest = [];
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

        // Damage components
        if (def.components.length > 0 && damage > def.hpMax / 2) {
            let componentLost = {};
            let num = Math.floor(Math.random()*def.components.length);

            // If we grabbed a weapon system.
            if (def.components[num].weapons) {
                let system = def.components[num];
                let wpnNum = Math.floor(Math.random()*system.weapons.length);

                console.log(BlueForce);
                componentLost = system.weapons.splice(wpnNum, 1);
                componentLost = componentLost[0];
                componentLost.state === "destroyed";
                // If we destroyed all weapons of the system, remove it.
                if (system.weapons.length === 0) {
                    system.active === "destroyed";
                    def.components.splice(num, 1);
                };
            } else {
                componentLost = def.components.splice(num, 1);
                componentLost = componentLost[0];
                componentLost.state === "destroyed";
            }
            logObjTurn.compDest.push(componentLost);
        }
        
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
const selectSystemTargets = function (logArray, atk, targetSection, engageRange, setting) {
    // Systems grab valid targets.
    atk.wSystems.forEach(function(system) {
        // TODO: Setting determines which weapons systems can attack.

        if (targetSection.units.length > 0 && system.setting === setting) {
            // If we are selecting a target by a preference, sort here and select the first. Else, pick randomly.
            let targetUnitArray = targetSection.units;
            let def = {};
            let unitTargetPrefs = atk.targetPrefs;
            if (unitTargetPrefs) {
                def = sortByPreference(targetUnitArray, unitTargetPrefs)[0];
            } else {
                def = selectRandomTarget(targetUnitArray);
            }
            // Create a new log for the system attack
            let logObjTurn = new LogTurnObject(atk, def, system);

            // For each weapon, roll an attack and resolve the damage
            // If we destroy the unit, remove it from targets and into casualties.
            // If target is not active, all shots miss.
            system.weapons.forEach(function(weapon) {
                rollAttack(logObjTurn, weapon, atk, def, targetSection, engageRange);
            })

            // Log result of system attack
            if (logObjTurn) logArray.push(constructString(logObjTurn));
        }
    })
}

// Ship Behaviours

// Debug: Behaviour for general unit attack.
const behaviourAttack = function (logArray, atk, targetSection) {
    logArray.push(atk.name + " initiates general attack.");
    selectSystemTargets(logArray, atk, targetSection, null, null);
};
// CloseAttack: Unit attacks at close range using Primary weapons. PD retaliation.
const behaviourCloseAttack = function (logArray, atk, targetSection) {
    let activeSetting = "primary";
    let engageRange = "close";
    if (hasWeaponWithRange(atk, engageRange)) {
        logArray.push(atk.name + " initiates a close-range attack.");

        selectSystemTargets(logArray, atk, targetSection, engageRange, activeSetting);
    }
}
// LongAttack: Unit attacks at long range using Primary weapons. No PD.
const behaviourLongAttack = function (logArray, atk, targetSection) {
    let activeSetting = "primary";
    let engageRange = "long";
    if (hasWeaponWithRange(atk, engageRange)) {
        logArray.push(atk.name + " initiates a long-range attack.");
    
        selectSystemTargets(logArray, atk, targetSection, engageRange, activeSetting);
    }
}
// Move: Unit moves to region of targeted section.
const behaviourMoveRegion = function (logArray, activeSection, targetSection) {
    logArray.push(activeSection.name + " approaches " + targetSection.name + " in " + regions[targetSection.region].name + ".");
    activeSection.region = targetSection.region;
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

    selectSystemTargets(logArray, atk, targetSection, engageRange, activeSetting);
}


// Turn Functions

/**
 * Handles turn calculations.
 */
const passTurn = function (groupArray) {

    // Create function to resolve section's actions.
    const sectionTurn = function (logArray, activeSection, targetedSection, sectionBehaviour) {
        // Create a temporary list of units, in case they flee or are destroyed.
        let unitList = [];
        unitList = unitList.concat(activeSection.units);

        // Iterate through each unit of active section.
        unitList.forEach(function(unit) {
            // Check for Conditional Behaviour, such as Fleeing.
            if (unit.hp <= (unit.hpMax * 0.3) ) {
                logArray.push(unit.name + " has panicked. It only has " + unit.hp + " hp remaining.");
                behaviourFlee(logArray, unit, activeSection);
            // Else begin section behaviour.
            } else {
                // Check that there are any possible units left to target in the section.
                if (targetedSection.units.length > 0) {

                // Execute behaviour.
                sectionBehaviour(logArray, unit, targetedSection);
                } else {
                    // console.log(unit.name + " cannot find any units left in the enemy section.")
                }
            }
        });
    }

    // Iterate through each group
    groupArray.forEach (function (activeGroup){
        // For each section, check if it is the section's turn.
        activeGroup.sections.forEach(function(activeSection) {
            if (activeSection.speed === 0 && activeSection.state === "active") {
                // Generate a Log Array
                let logArray = [];

                // TODO: Allow targeting via group or team.
                // Generate a list of possible target sections.
                let targetSectionsArray = [];
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
                    logArray.push(activeSection.name + " takes a turn. " + activeSection.units.length + " active units within.");

                    // If we are selecting a target by a preference, sort here and select the first. Else, pick randomly.
                    let targetedSection = {};
                    let sectionTargetPrefs = activeSection.targetPrefs;
                    if (sectionTargetPrefs) {
                        if (sectionTargetPrefs.type === "design") {
                            targetedSection = sortSectionByUnitPreference(targetSectionsArray, sectionTargetPrefs)[0];
                        } else {
                            targetedSection = sortByPreference(targetSectionsArray, sectionTargetPrefs)[0];
                        }
                    } else {
                        targetedSection = selectRandomTarget(targetSectionsArray);
                    }

                    // Collect unique behaviours from units.
                    let validBehaviours = new Set;
                    activeSection.units.forEach(function(unit) {
                        unit.behaviours.forEach(function(behaviour) {
                            validBehaviours.add(behaviour);
                        })
                    });
                    validBehaviours = Array.from(validBehaviours);

                    // Choose a random behaviour for the section to execute.
                    let sectionBehaviour = validBehaviours[Math.floor(Math.random()*validBehaviours.length)];
                    
                    // Write Log data.
                    logArray.push(targetedSection.name + " has been targeted. " + targetedSection.units.length + " active units within.");
                    logArray.push(sectionBehaviour.prototype.constructor.name)
                    logArray.push("----------");

                    // If close behaviour, check the distance.
                    if (sectionBehaviour === behaviourCloseAttack) {
                        if (activeSection.region === targetedSection.region) {

                            // Check if behaviour engenders Point Defense
                            if (hasPointDefense(targetedSection)) {
                                targetedSection.units.forEach(function(unit) {
                                    // Check that there are any possible units left to target in the section.
                                    if (activeSection.units.length > 0 && hasPointDefense(unit)) {
                                        behaviourPD(logArray, unit, activeSection);
                                    } else {
                                        // console.log(unit.name + " cannot find any units left in the enemy section.");
                                    }
                                })
                            }

                            // Execute the section's turn
                            sectionTurn(logArray, activeSection, targetedSection, sectionBehaviour);
                        } else {
                            behaviourMoveRegion(logArray, activeSection, targetedSection);
                        }
                    } else {
                        // Execute the section's turn
                        sectionTurn(logArray, activeSection, targetedSection, sectionBehaviour);
                    }

                    // Check if any group has been completely destroyed for battle resolution purposes.
                    checkGroups(groupArray);

                    logArray.push("----------");
                }

                // Reset speed/turn timer.
                setSpeed(activeSection);

                // Print log array.
                printArray(logArray);
            } else { // If not your turn, tick speed.
                if (activeSection.state === "active") activeSection.speed -= 1;
            }
        });

    })
};

// Models

// Weapons
function KX9LaserCannon () {
    return [
        "KX9 Laser Cannon",
        1,
        5,
        "energy",
        15,
        "close"
    ]
}
function LS1LaserCannon () {
    return [
        "L-S1 Laser Cannon",
        1,
        3,
        "energy",
        15,
        "close"
    ]
}
function H9Turbolaser () {
    return [
        "H9 Turbolaser",
        5,
        10,
        "energy",
        0,
        "long"
    ]
} 
function XX9HeavyTurbolaser () {
    return [
        "XX9 Heavy Turbolaser",
        20,
        30,
        "energy",
        -15,
        "long"
    ]
}
function NK7IonCannon () {
    return [
        "NK-7 Ion Cannon",
        10,
        20,
        "ion",
        -10,
        "long"
    ]
}

// Weapon Systems
function KX9LaserArray () {
    return [
        "KX-9 Laser Array",
        [
            construct(Weapon, KX9LaserCannon()),
            construct(Weapon, KX9LaserCannon()),
            construct(Weapon, KX9LaserCannon()),
            construct(Weapon, KX9LaserCannon())
        ]
    ]
} 
function LS1LaserArray () {
    return [
        "L-S1 Laser Array",
        [
            construct(Weapon, LS1LaserCannon()),
            construct(Weapon, LS1LaserCannon())
        ]
    ]
}
function H9TurbolaserTurret () {
    return [
        "H9 Turbolaser Turret",
        [
            construct(Weapon, H9Turbolaser())
        ]
    ]
}
function H9DualTurbolaserTurret () {
    return [
        "H9 Dual Turbolaser Turret",
        [
            construct(Weapon, H9Turbolaser()),
            construct(Weapon, H9Turbolaser())
        ]
    ]
}

function XX9QuadHeavyTurbolaserTurret () {
    return [
        "XX9 Quad Heavy Turbolaser Turret",
        [
            construct(Weapon, H9Turbolaser()),
            construct(Weapon, H9Turbolaser()),
            construct(Weapon, H9Turbolaser()),
            construct(Weapon, H9Turbolaser())
        ]
    ]
}
function XX9TripleHeavyTurbolaserTurret () {
    return [
        "XX9 Triple Heavy Turbolaser Turret",
        [
            construct(Weapon, H9Turbolaser()),
            construct(Weapon, H9Turbolaser()),
            construct(Weapon, H9Turbolaser())
        ]
    ]
}
function XX9DualHeavyTurbolaserTurret () {
    return [
        "XX9 Dual Heavy Turbolaser Turret",
        [
            construct(Weapon, H9Turbolaser()),
            construct(Weapon, H9Turbolaser())
        ]
    ]
}
function XX9HeavyTurbolaserTurret () {
    return [
        "XX9 Heavy Turbolaser Turret",
        [
            construct(Weapon, H9Turbolaser())
        ]
    ]
}
function XX9HeavyTurbolaserx20 () {
    return [
        "XX9 Heavy Turbolaser Grid",
        [
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
            construct(Weapon, XX9HeavyTurbolaser()),
        ]
    ]
}
function NK7DualHeavyIonCannonTurret () {
    return [
        "NK7 Dual Heavy Ion Cannon Turret",
        [
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon())
        ]
    ]
}

function NK7IonCannonx20 () {
    return [
        "NK-7 Ion Cannon Grid",
        [
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
        ]
    ]
}
function NK7IonCannonx15 () {
    return [
        "NK-7 Ion Cannon Grid",
        [
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
        ]
    ]
}
function NK7IonCannonx10 () {
    return [
        "NK-7 Ion Cannon Grid",
        [
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
            construct(Weapon, NK7IonCannon()),
        ]
    ]
}


// Fighters
function XWing () {
    return [
        "T65 X-Wing",
        "Fighter",
        10,
        10,
        1,
        2,
        65,
        [
            construct(WeaponSystem, KX9LaserArray())
        ],
        [behaviourCloseAttack]
    ]
}
function TIEFighter () {
    return [
        "TIE/LN Starfighter",
        "Fighter",
        10,
        0,
        0,
        2,
        50,
        [
            construct(WeaponSystem, LS1LaserArray(), ["primary"])
        ],
        [behaviourCloseAttack]
    ]
}
// Corvettes
function CR90Corvette () {
    return [
        "CR90 'Corellian' Corvette",
        "Corvette",
        30,
        20,
        3,
        5,
        45,
        [
            construct(WeaponSystem, H9DualTurbolaserTurret(), ["primary"]),
            construct(WeaponSystem, H9DualTurbolaserTurret(), ["primary"]),
            construct(WeaponSystem, H9TurbolaserTurret(), ["primary"]),
            construct(WeaponSystem, H9TurbolaserTurret(), ["primary"]),
            construct(WeaponSystem, H9TurbolaserTurret(), ["pointDefense"]),
            construct(WeaponSystem, H9TurbolaserTurret(), ["pointDefense"])
        ],
        [behaviourLongAttack]
    ]
}
// Frigates
// Capitals
function Imperial1 () {
    return [
        "Imperial I-class Star Destroyer",
        "Capital",
        1000,
        1000,
        5,
        10,
        5,
        [
            construct(WeaponSystem, XX9HeavyTurbolaserx20(), ["primary"]),
            construct(WeaponSystem, XX9HeavyTurbolaserx20(), ["secondary"]),
            construct(WeaponSystem, XX9HeavyTurbolaserx20(), ["pointDefense"]),
    
            construct(WeaponSystem, NK7IonCannonx20(), ["primary"]),
            construct(WeaponSystem, NK7IonCannonx15(), ["secondary"]),
            construct(WeaponSystem, NK7IonCannonx15(), ["secondary"]),
            construct(WeaponSystem, NK7IonCannonx10(), ["pointDefense"]),
    
            construct(WeaponSystem, XX9DualHeavyTurbolaserTurret(), ["primary"]),
            construct(WeaponSystem, XX9DualHeavyTurbolaserTurret(), ["primary"]),
            construct(WeaponSystem, XX9DualHeavyTurbolaserTurret(), ["primary"]),
            construct(WeaponSystem, XX9DualHeavyTurbolaserTurret(), ["primary"]),
            construct(WeaponSystem, XX9DualHeavyTurbolaserTurret(), ["secondary"]),
            construct(WeaponSystem, XX9DualHeavyTurbolaserTurret(), ["secondary"]),
    
            construct(WeaponSystem, NK7DualHeavyIonCannonTurret(), ["primary"]),
            construct(WeaponSystem, NK7DualHeavyIonCannonTurret(), ["primary"]),
    
            construct(WeaponSystem, XX9QuadHeavyTurbolaserTurret(), ["primary"]),
            construct(WeaponSystem, XX9QuadHeavyTurbolaserTurret(), ["primary"]),
    
            construct(WeaponSystem, XX9TripleHeavyTurbolaserTurret(), ["primary"]),
            construct(WeaponSystem, XX9TripleHeavyTurbolaserTurret(), ["primary"]),
            construct(WeaponSystem, XX9TripleHeavyTurbolaserTurret(), ["primary"]),
    
            construct(WeaponSystem, XX9DualHeavyTurbolaserTurret(), ["primary"]),
            construct(WeaponSystem, XX9DualHeavyTurbolaserTurret(), ["primary"]),
        ],
        [behaviourLongAttack]
    ]
}


// Setup

let RedForce = new Group(
    [
        new Section(
            [
                construct(Unit, XWing(), ["Red Alpha"]),
                construct(Unit, XWing(), ["Red Beta"]),
                construct(Unit, XWing(), ["Red Gamma"]),
                construct(Unit, XWing(), ["Red Delta"]),
                construct(Unit, CR90Corvette(), ["Blockrunner"]),
                construct(Unit, CR90Corvette(), ["Redrunner"]),
            ],
            "Red Raiders 1"
        )
    ],
    "Red Force",
    1
)

let BlueForce = new Group(
    [
        new Section(
            [
                construct(Unit, TIEFighter(), ["TIE-1a", {type: "type", value: "Corvette"}]),
                construct(Unit, TIEFighter(), ["TIE-2a", {type: "type", value: "Corvette"}]),
                construct(Unit, TIEFighter(), ["TIE-3a", {type: "type", value: "Corvette"}]),
                construct(Unit, TIEFighter(), ["TIE-4a", {type: "type", value: "Corvette"}]),
                construct(Unit, TIEFighter(), ["TIE-5a", {type: "type", value: "Corvette"}]),
                construct(Unit, TIEFighter(), ["TIE-6a", {type: "type", value: "Corvette"}]),
            ],
            "TIE Squadron 1"
        )
    ],
    "Blue Force",
    2
)

// Execution

console.log(RedForce);
console.log(BlueForce);

// Battle Loop
let regions = [];
let combatants = [];
combatants.push(RedForce);
combatants.push(BlueForce);
// combatants.push(GreenForce);
// combatants.push(YellowForce);

// Clear out empty combatants
for (let i = 0; i < combatants.length; i++) {
    // Filter out any combatants with no sections.
    if  (combatants[i].sections.length === 0) {
        combatants.splice(i, 1);
    } else {
        // Filter out any sections with no units.
        let sections = combatants[i].sections;
        for (let i = 0; i < sections.length; i++) {
            if  (sections[i].units.length === 0) {
                sections.splice(i, 1);
            }
        }
    }
}
// Check Combatant sections again, as we may have removed all sections from them.
for (let i = 0; i < combatants.length; i++) {
    if  (combatants[i].sections.length === 0) {
        combatants.splice(i, 1);
    }
}

// Set up Regions
for (let i = 0; i < combatants.length*3; i++) {
    regions.push({name: "Region " + i, value: i, type: ""});
}
// Place each section in a random region
for (let i = 0; i < combatants.length; i++) {
    // Available starting regions are limited to 3 places; middle and two flanks. Later will add options for above and below.
    let availableRegions = [i*3, i*3+1, i*3+2]
    combatants[i].sections.forEach(function(section) {
        section.region = availableRegions[Math.floor(Math.random()*availableRegions.length)];
    })
}
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