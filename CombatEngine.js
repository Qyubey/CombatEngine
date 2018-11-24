// SW

// TODO: Ignore log for now, just get functions working.
// Pull dead units out of units array, put in Casualties array.
// Record total damage dealt and kills for each unit.
// Rewrite combat flow so it ends properly when all enemies dead.

// TODO: Create a github for version control
// Add web functionality. Set up armies and manually play turns from HTML.
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
// Add Ammo to certain weapon types? May need restriction to certain targets or behaviours. Such as Bombs to Bombing Runs, or Buzzdroids to Release Buzzdroids.
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
    this.state = 'active'
}
function Unit (name, unitName, wSystems, hp, sp) {
    this.name = name;
    this.unitName = unitName;
    this.wSystems = wSystems;
    this.hp = hp;
    this.sp = sp;
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


// Functions

const printLog = function (logString) {
    const logArray = logString.split("\n");
    logArray.push("=====");
    logArray.forEach(function(part) {
        let para = document.createElement("p");
        const node = document.createTextNode(part);
        para.appendChild(node);

        let element = document.getElementById("div1");
        element.appendChild(para);
    })
}

/**
 * Returns a random number from 1 to 100.
 * @returns {number}
 */
const percentileRoll = function () {
    return Math.floor(Math.random()*100);
};

/**
 * Calculates damage for an attack. Assigns to either shields or hull, and reduces by armour.
 * @param atk
 * @param def
 * @returns {{hpDam: number, spDam: number, sBreaks: number, kills: number}}
 */
const damageCalc = function (atk, def) {
    let log = {hpDam: 0, spDam: 0, sBreaks: 0, kills: 0};
    if (def.sp === 0) {
        def.hp -= atk.weapons[0].damage;
        log.hpDam += atk.weapons[0].damage;
        if (def.hp <= 0) {
            def.hp = 0;
            def.state = 'Destroyed';
            log.kills += 1;
        }
    } else {
        def.sp -= atk.weapons[0].damage;
        log.spDam += atk.weapons[0].damage;
        if (def.sp <= 0) {
            def.sp = 0;
            log.sBreaks += 1;
        }
    }
    return log;
};

/**
 * Rolls an attack, determines if it hits or misses.
 * @param atk
 * @param def
 * @returns {{atk: *, def: *, hits: number, misses: number, hpDam: number, spDam: number, sBreaks: number, kills: number}}
 */
const actionAttack = function (atk, def) {
    let log = {atk: atk, def: def, hits: 0, misses: 0, hpDam: 0, spDam: 0, sBreaks: 0, kills: 0};
    atk.weapons.forEach(function() {
        const roll = percentileRoll();
        if (roll >= 50) {
            let result = damageCalc(atk, def);
            log.hits += 1;
            log.hpDam += result.hpDam;
            log.spDam += result.spDam;
            log.sBreaks += result.sBreaks;
            log.kills += result.kills;
        } else {
            log.misses += 1;
        }
    });
    return log;
};

/**
 * Creates a string log for the recent action from a log object.
 * @param log
 * @returns {string}
 */
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

/**
 * Run combat between an attacker and a defender
 * @param atk
 * @param def
 */
const executeCombat = function (atk, def) {
    const log = constructLog(actionAttack(atk, def));
    console.log(log);
};

/**
 * Returns a random active element from the given array.
 * @param array
 * @returns {*}
 */
const selectTarget = function (array) {
    let validTargets = array.filter(function(element) {
        return element.state === 'active';
    });
    return validTargets[Math.floor(Math.random()*validTargets.length)];
};

/**
 * Determines if it is the turn for any of the sections given.
 * @param sections
 */
const passTurn = function (sections) {
    let targetUp = true;
    // For each section, determine if it is the section's turn.
    sections.forEach(function(section) {
        if (section.speed === 0) {
            console.log(section.name + " takes a turn.");
            printLog(section.name + " takes a turn.");

            // Filter this section out of the sections array, and choose a section to attack.
            let targets = sections;
            targets = targets.filter(function(target) {
                return target.name !== section.name;
            });
            let targetedSection = selectTarget(targets);

            // For each Unit in this section, select a Unit in the targeted section and execute attack.
            section.units.forEach(function(unit) {
                if (unit.state === 'active') {
                    let atk = unit;
                    let def = selectTarget(targetedSection.units);
                    executeCombat(atk, def);
                }
            });
            let activeTargets = targetedSection.units.filter(function(unit) {
                return unit.state === 'active';
            });
            if (activeTargets.length === 0) winner = section.name;

            // Reset speed/turn timer.
            section.speed = Math.floor(Math.random()*3);
            return targetUp;
        } else { // If not your turn, tick speed.
            section.speed -= 1;
            return targetUp;
        }
    });
};


// Setup

let TestForce = new Group(
    "Red Force",
    [
        new Section(
            "Testers",
            [
                new Unit(name, "T65 X-Wing", [
                    new WeaponSystem("KX-9 Laser Array", 
                    [
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                        new Weapon("KX9 Laser Cannon", 3),
                    ])
                ], 10, 10)
            ],
            3
        )
    ]
)

// let RedForce = new Group('Red Force', [
//     new Section('Red Raiders', [
//         new XWing('Red Alpha'),
//         new XWing('Red Beta'),
//         new XWing('Red Gamma'),
//     ], Math.floor(Math.random()*3) )
// ])
// let BlueForce = new Group('Blue Force', [
//     new Section('Blue Pirates', [
//         new XWing('Blue Alpha'),
//         new XWing('Blue Beta'),
//         new XWing('Blue Gamma'),
//     ], Math.floor(Math.random()*3) )
// ])


// Execution

console.log(TestForce.sections[0].units);

// let winner = '';
// for (let i = 0; i < 10; i++) {
//     if (winner.length === 0) {
//         passTurn([RedForce, BlueForce]);
//     } else {
//         console.log("The winner is " + winner + ".");
//         i = 11;
//     }
// }