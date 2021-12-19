export const game = (
    "mk8d"
)

export const minimumBuild = {
    
}
export const maximumBuild = {

}

export const sortValue1 = (build) => { return (
    build.miniTurbo - build.handling.ground
);}
export const sortValue2 = (build) => { return (
    build.speed.ground * build.miniTurbo
);}
export const sortValue3 = (build) => { return (
    build.acceleration
);}

export const meetsConditions = (build) => { return (
    build.sportBike == false
)}

export const getHighStats = (component) => { return [
    
].map(x => x || 0);}
export const getLowStats = (component) => { return [
    
].map(x => x || 0);}