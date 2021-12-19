import fs from "fs";
import path from "path";

import filterByStats from "../filter-by-stats.js";
import {minimumBuild, maximumBuild, meetsConditions} from "../../config.js";


export default function marioKart8Deluxe() {
    const parse = (fileName) => JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/mario-kart-8-deluxe", fileName), "utf8"));
    
    const data = {
        drivers: filterByStats(parse("drivers.json")),
        bodies: filterByStats(parse("bodies.json")),
        tires: filterByStats(parse("tires.json")),
        gliders: filterByStats(parse("gliders.json"))
    }
    

    // Functional Programming
    return data.drivers.flatMap(driver => {
        return data.bodies.flatMap(body => {
            return data.tires.flatMap(tires => {
                return data.gliders.flatMap(glider => {
                    const parts = [driver, body, tires, glider];

                    const {acceleration, weight, traction, miniTurbo} = Object.fromEntries(
                        ["acceleration", "weight", "traction", "miniTurbo"].map(key => {
                            return [key, parts.reduce((a, b) => a + b[key], 0)];
                        })
                    );
                    const speed = Object.fromEntries(
                        ["ground", "water", "air", "antiGravity"].map(key => {
                            return [key, parts.reduce((a, b) => a + b.speed[key], 0)];
                        })
                    );
                    const handling = Object.fromEntries(
                        ["ground", "water", "air", "antiGravity"].map(key => {
                            return [key, parts.reduce((a, b) => a + b.handling[key], 0)];
                        })
                    );

                    return {
                        name: parts.map(a => a.name)
                            .join("\n"),
                        speed,
                        acceleration,
                        miniTurbo,
                        weight,
                        handling,
                        traction,
                        sportBike: body.sportBike
                    }
                }).filter(build => {
                    return meetsConditions(build)
                });
            });
        });
    });


    // Object-Oriented Programming
    let builds = [];
    for (const driver of data.drivers) {
        for (const body of data.bodies) {
            for (const tires of data.tires) {
                for (const glider of data.gliders) {
                    const parts = [driver, body, tires, glider];

                    const {acceleration, weight, traction, miniTurbo} = Object.fromEntries(
                        ["acceleration", "weight", "traction", "miniTurbo"].map(key => {
                            return [key, parts.reduce((a, b) => a + b[key], 0)];
                        })
                    );
                    const speed = Object.fromEntries(
                        ["ground", "water", "air", "antiGravity"].map(key => {
                            return [key, parts.reduce((a, b) => a + b.speed[key], 0)];
                        })
                    );
                    const handling = Object.fromEntries(
                        ["ground", "water", "air", "antiGravity"].map(key => {
                            return [key, parts.reduce((a, b) => a + b.handling[key], 0)];
                        })
                    );

                    const build = {
                        name: parts.map(a => a.name)
                            .join("\n"),
                        speed,
                        acceleration,
                        miniTurbo,
                        weight,
                        handling,
                        traction,
                        sportBike: body.sportBike
                    }
                    if (meetsConditions(build)) builds.push(build);
                }
            }
        }
    }
    return builds;
}