export const game = (
    "mhwi"
)

export const minimumBuild = {
    skills: { //this should be easy to work with for figuring out decorations
        focus: 3,
        artillery: 3,
        powerProlonger: 3,
        offensiveGuard: 3,
        slingerCapacity: 1,
        stunResistance: 3,
        flinchFree: 1,
        earplugs: 5
    },
    sets: {
        fatalisLegend: 4
    }
}
export const maximumBuild = {

}

export const sortValue1 = (build) => { return (
    Math.min(...Object.values(build.resistances))
);}
export const sortValue2 = (build) => { return (
    build.defense
);}

export const meetsConditions = (build) => { return (
    true
)}

export const getHighStats = (component) => { return [
    component.slots //is a given
    ,component.skills.focus //the rest of these can be implied from minimumBuild and maximumBuild
    ,component.skills.artillery //anything else can be manually input based on the more complex special conditions
    ,component.skills.powerProlonger
    ,component.skills.offensiveGuard
    ,component.skills.slingerCapacity
    ,component.skills.stunResistance
    ,component.skills.flinchFree
    ,component.skills.guts
    ,component.skills.earplugs
    ,component.sets?.fatalisLegend
].map(x => x || 0);}
export const getLowStats = (component) => { return [
    component.level //is a given
].map(x => x || 0);}