import { minimumBuild, maximumBuild, getHighStats, getLowStats } from "../config.js";

export default function filterByStats(components) {
    return components.filter(component => {
        const highStats = getHighStats(component);
        const lowStats = getLowStats(component);

        if (!highStats.length && !lowStats.length) return true;
        else return (
            !components.some(otherComponent => {
                const otherHighStats = getHighStats(otherComponent);
                const otherLowStats = getLowStats(otherComponent);

                const otherHighStatsHigher = otherHighStats.every((highStat, i) => isGreaterThan(highStat, highStats[i]))
                const otherHighStatsEqual = otherHighStats.every((highStat, i) => isEqualTo(highStat, highStats[i]))
                const otherLowStatsLower = otherLowStats.every((lowStat, i) => isLessThan(lowStat, lowStats[i]))
                const otherLowStatsEqual = otherLowStats.every((lowStat, i) => isEqualTo(lowStat, lowStats[i]))

                const otherHighStatsBetter = highStats.length ? (otherHighStatsHigher && !otherHighStatsEqual) : false;
                const otherLowStatsBetter = lowStats.length ? (otherLowStatsLower && !otherLowStatsEqual) : false

                return (
                    (otherHighStatsBetter && otherLowStatsBetter)
                    || (otherHighStatsBetter && otherLowStatsEqual)
                    || (otherHighStatsEqual && otherLowStatsBetter)
                )
            })
        )
    })
}

function isGreaterThan(a, b) {
    return Array.isArray(a)
        ? a.every((x, i) => x >= b[i])
        : a >= b;
}
function isEqualTo(a, b) {
    return Array.isArray(a)
        ? a.every((x, i) => x == b[i])
        : a == b;
}
function isLessThan(a, b) {
    return Array.isArray(a)
        ? a.every((x, i) => x <= b[i])
        : a <= b;
}