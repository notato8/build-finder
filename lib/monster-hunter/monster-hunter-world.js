import fs from "fs";
import path from "path";

import filterByStats from "../filter-by-stats.js";
import {minimumBuild, maximumBuild, meetsConditions} from "../../config.js";


const parse = (fileName) => JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/monster-hunter-world-iceborne", fileName), "utf8"));
const data = {
    helms: filterByStats(parse("helms.json")),
    mails: filterByStats(parse("mails.json")),
    vambraces: filterByStats(parse("vambraces.json")),
    coils: filterByStats(parse("coils.json")),
    greaves: filterByStats(parse("greaves.json")),
    charms: filterByStats(parse("charms.json")),
    decorations: filterByStats(parse("decorations.json"))
        .map(a => ({...a, name: a.name + " " + a.level}))
        .sort((a, b) => b.level - a.level),
    skills: parse("skills.json"),
    sets: parse("sets.json")
}

export default function monsterHunterWorld() {
    return data.helms.flatMap(helm => { // these should not be nested, it can be one function
        return data.mails.flatMap(mail => {
            return data.vambraces.flatMap(vambraces => {
                return data.coils.flatMap(coil => {
                    return data.greaves.flatMap(greaves => {
                        const armor = [helm, mail, vambraces, coil, greaves];
                        return {
                            armor,
                            skills: Object.fromEntries(
                                Object.keys(
                                    Object.assign({}, ...armor.map(a => a.skills))
                                ).map(key => {
                                    return [key, armor.reduce((a, b) => a + (b.skills[key] || 0), 0)]
                                })
                            ),
                            sets: Object.fromEntries(
                                Object.keys(
                                    Object.assign({}, ...armor.map(a => a.sets))
                                ).map(key => {
                                    return [key, armor.reduce((a, b) => a + (b.sets[key] || 0), 0)]
                                })
                            )
                        }
                    }).filter(({sets}) => { 
                        return Object.entries(minimumBuild.sets)
                            .every(([key, minValue]) => sets[key] >= minValue)
                    }).map(({armor, skills, sets}) => {
                        return {
                            armor,
                            slots: [].concat(...armor.map(a => a.slots))
                                .filter(a => a != 0)
                                .sort((a, b) => b - a),
                            defense: armor.reduce((a, b) => a + b.defense, 0),
                            resistances: Object.fromEntries(
                                ["fire", "water", "thunder", "ice", "dragon"].map(key => {
                                    return [key, armor.reduce((a, b) => a + (b.resistances[key] || 0), 0)]
                                })
                            ),
                            skills: {
                                ...skills,
                                ...Object.fromEntries(
                                    [].concat(...Object.entries(sets)
                                        .map(([setKey, setValue]) => {
                                            return Object.entries(data.sets[setKey])
                                                .filter(([skillValue]) => setValue >= skillValue)
                                                .map(([,skillKey]) => [skillKey, 1])
                                        })
                                    )
                                )
                            },
                            sets
                        }
                    }).flatMap(({armor, slots, defense, resistances, skills, sets}) => {
                        return data.charms.flatMap(charm => {
                            return {
                                equipment: [...armor, charm],
                                slots,
                                defense,
                                resistances,
                                skills: {
                                    ...skills,
                                    ...Object.fromEntries(
                                        Object.entries(charm.skills).map(([key, value]) => {
                                            return [key, value + (skills[key] || 0)]
                                        })
                                    )
                                },
                                sets
                            }
                        }).map(({equipment, slots, defense, resistances, skills, sets}) => {
                            return decorationLoop({equipment, slots, defense, resistances, skills, sets})
                        }).filter(build => {
                            return Object.entries(minimumBuild.skills) // these do not cover all properties, but will do for now
                                .every(([key, skillValue]) => build.skills[key] >= skillValue) // i'll need custom functions for comparing objects
                            && meetsConditions(build)
                        });;
                    });
                });
            });
        });
    });
}

function decorationLoop( // what should this function be named?
    {equipment, slots, defense, resistances, skills, sets},
    dataDecorations = data.decorations,
    i = 0
) {
    const dataDecorationsFiltered = dataDecorations.filter(decoration => {
        return (
            Object.keys(decoration.skills)
                .some(skillKey => (skills[skillKey] || 0) < minimumBuild.skills[skillKey])
            && decoration.level <= slots[i]
        );
    })
    

    if (slots[i] && dataDecorationsFiltered.length) {
        const decoration = dataDecorationsFiltered[0];
        return decorationLoop(
            {
                equipment: [...equipment, decoration],
                slots,
                defense,
                resistances,
                skills: {
                    ...skills,
                    ...Object.fromEntries(
                        Object.entries(decoration.skills).map(([key, value]) => {
                            return [key, value + (skills[key] || 0)]
                        })
                    )
                },
                sets
            },
            dataDecorationsFiltered,
            i + 1
        );
    } else {
        return {
            name: equipment
                .map(a => a.name)
                .join("\n"),
            defense,
            resistances,
            skills,
            sets
        };
    }
}