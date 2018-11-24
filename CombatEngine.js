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
function Group (name, sectionsArray, team) {
    this.name = name;
    this.sectionsArray = sectionsArray;
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
function Unit (name, unitName, wSystems, hp, sp, evasion) {
    this.name = name;
    this.unitName = unitName;
    this.wSystems = wSystems;
    this.hp = hp;
    this.sp = sp;
    this.evasion = evasion;
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

const printLog = function (logString) {
    const logArray = logString.split("\n");
    logArray.push("-----");
    logArray.forEach(function(part) {
        let para = document.createElement("p");
        const node = document.createTextNode(part);
        para.appendChild(node);

        let element = document.getElementById("div1");
        element.appendChild(para);
    })
}

const constructLog = function (log) {
    // Record amount of hits, amount of misses.
    // Record total damage to sp and hp
    // Record any kills
    let resultString = "";
    if (log.hits > 0) {
        resultString += log.atk.name + " hit "    + log.def.name + " " + log.hits   + " times with a " + log.atk.weapons[0].name + "!";
        resultString += "\n";
    }
    // if (log.misses > 0) {
    //     resultString += log.atk.name + " missed " + log.def.name + " " + log.misses + " times with a " + log.atk.weapons[0].name + ".";
    //     resultString += "\n";
    // }
    if (log.spDam > 0) {
        resultString += log.def.name + " recieved " + log.spDam + " shield damage.";
        resultString += "\n";
    }
    if (log.hpDam > 0) {
        resultString += log.def.name + " recieved " + log.hpDam + " hull damage.";
        resultString += "\n";
    }
    if (log.sBreaks > 0) {
        resultString += log.def.name + " has lost shields.";
        resultString += "\n";
    }
    if (log.kills > 0) {
        resultString += log.def.name + " has been destroyed!";
        resultString += "\n";
    }
    if (resultString.misses === 4) {
        resultString += "Ya missed everything.";
        resultString += "\n";
    }
    if (resultString.length === 0) {
        resultString += "Nothing happened.";
        resultString += "\n";
    } else {
        resultString += log.def.name + " Shields: " + log.def.sp + "/10.";
        resultString += "\n";
        resultString += log.def.name + " Hull: " + log.def.hp + "/10.";
        resultString += "\n";
    }
    printLog(resultString);
    return resultString;
};


// Functions

/**
 * Returns a random number from 1 to 100.
 */
const percentileRoll = function () {
    return Math.floor(Math.random()*100);
};

/**
 * Removes a unit from an array, and returns it for insertion into 
 */
const removeUnit = function (unit, array, deadArray) {
    const index = array.indexOf(unit);
    if (index !== -1) {
        array.splice(index, 1);
    }
    if (!!deadArray) {
        deadArray.push(unit);
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
 * Calculates damage for an attack. Assigns to either shields or hull, and reduces by armour.
 */
const damageCalc = function (weapon, def) {
    if (def.sp === 0) {
        def.hp -= weapon.damage;
        if (def.hp <= 0) {
            def.hp = 0;
            def.state = 'Destroyed';
        }
    } else {
        def.sp -= weapon.damage;
        if (def.sp <= 0) {
            def.sp = 0;
        }
    }
};

/**
 * Behaviour for General Unit attack.
 */
const behaviourAttack = function (atk, targetsArray) {

    atk.wSystems.forEach(function(system) {
        let targetedSection = selectTarget(targetsArray);
        if (targetedSection.units.length !== 0) {
            let def = selectTarget(targetedSection.units);
            let evasion = def.evasion;
            
            // For each weapon, roll an attack and resolve the damage
            // If we destroy the unit, remove it from targets and into casualties.
            // Check that our target is destroyed before we calc attack.
            system.weapons.forEach(function(weapon) {
                if (def.state !== "Destroyed") {
                    const roll = percentileRoll();

                    // If attack hits, calculate damage.
                    if (roll >= evasion) {
                        let combatLog = atk.name + ' hits ' + def.name + " for " + weapon.damage + " damage!";
                        damageCalc(weapon, def);
                        printLog(combatLog);
                        printLog(def.name + ": " + def.hp + "/10 HP " + def.sp + "/10SP");
                        if (def.state === "Destroyed") {
                            printLog(def.name + " Destroyed")
                            removeUnit(def, targetedSection.units, targetedSection.casualties);
                        }
                    }
                }
            })
        }
    })
};

/**
 * Determines if it is the turn for any of the sectionsArray given.
 */
const passTurn = function (sectionsArray) {

    // For each section, determine if it is the section's turn.
    sectionsArray.forEach(function(section) {
        if (section.speed === 0) {
            printLog(section.name + " takes a turn. " + section.units.length + " units available.");

            // Create possible targets array.
            let targetSectionsArray = sectionsArray.filter(function(target) {
                return target.name !== section.name;
            });

            // TODO: Determine Behaviour of Section here.
            // TODO: Alter behaviour based on Morale here.
            // TODO: For each unit in section, execute behaviour.
            section.units.forEach(function(unit) {
                behaviourAttack(unit, targetSectionsArray);
            });

            // Reset speed/turn timer.
            section.speed = Math.floor(Math.random()*3);
        } else { // If not your turn, tick speed.
            section.speed -= 1;
        }
    });
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
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                    ])
                ], 10, 10, 50),
                new Unit("Red Beta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                    ])
                ], 10, 10, 50),
                new Unit("Red Gamma", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                    ])
                ], 10, 10, 50),
            ],
            Math.floor(Math.random()*3)
        )
    ]
)

let BlueForce = new Group(
    "Blue Force",
    [
        new Section(
            "Blue Pirates",
            [
                new Unit("Blue Alpha", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                    ])
                ], 10, 10, 50),
                new Unit("Blue Beta", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                    ])
                ], 10, 10, 50),
                new Unit("Blue Gamma", "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                    ])
                ], 10, 10, 50),
            ],
            Math.floor(Math.random()*3)
        )
    ]
)

// Execution

// Battle Loop
printLog("Combat Start");
for (let i = 0; i < 20; i++) {

    if (BlueForce.sectionsArray[0].units.length === 0) {
        // End loop
        printLog("The winner is " + RedForce.name + "!");
        i = 100;
    } else if (RedForce.sectionsArray[0].units.length === 0) {
        // End loop
        printLog("The winner is " + BlueForce.name + "!");
        i = 100;
    } else {
        let combatants = [];
        combatants = combatants.concat(RedForce.sectionsArray);
        combatants = combatants.concat(BlueForce.sectionsArray);
        passTurn(combatants);
        // console.log(RedForce.sectionsArray[0]);
        // console.log(BlueForce.sectionsArray[0]);
    }

}