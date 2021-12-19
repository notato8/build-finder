import { game, minimumBuild, maximumBuild, meetsConditions, sortValue1, sortValue2, sortValue3 } from "./config.js";
import marioKart8Deluxe from "./lib/mario-kart/mario-kart-8-deluxe.js";
import monsterHunterWorld from "./lib/monster-hunter/monster-hunter-world.js";


const timeStart = Date.now();

const builds = (() => {
    switch (game) {
        case "mk8d": return marioKart8Deluxe;
        case "mhwi": return monsterHunterWorld;
    }
})()()
    .filter(build => { // this can be anywhere, so don't worry about involving it with the recursion
        return Object.entries(minimumBuild.skills || {}) // these do not cover all properties, but will do for now
            .every(([key, skillValue]) => build.skills[key] >= skillValue) // i'll need custom functions for comparing objects
        && meetsConditions(build)
    })
    .sort((a, b) => {
        const sort1 = sortValue1(a) - sortValue1(b);
        const sort2 = sortValue2(a) - sortValue2(b);
        const sort3 = sortValue3(a) - sortValue3(b);

        if (sort1 != 0) return sort1;
        else if (sort2 != 0) return sort2;
        else return sort3;
    });

console.log (
    builds
        .slice(-20)
        .map(build => (
            "\n" + build.name
            + "\n" + "Sort 1: " + sortValue1(build)
            + "\n" + "Sort 2: " + sortValue2(build)
            + "\n" + "Sort 3: " + sortValue3(build)
        ))
        .join("\n")
    + "\n" + "Time: " + (Date.now() - timeStart)/1000 + " seconds"
    + "\n" + "Results: " + builds.length + " builds"
)