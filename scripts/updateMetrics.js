function updateOverallStats(pathMetrics, depthMetrics) {
    var avgPathMetric = 0
    for (var i = 0; i < pathMetrics.length; i++) {
        avgPathMetric += pathMetrics[i];
    }
    
    avgPathMetric /= pathMetrics.length;
    avgPathMetric = Math.round(avgPathMetric);
    
    updatePathCard(avgPathMetric);
    updateDepthCard(depthMetrics);
    updateAggregateCard(avgPathMetric, depthMetrics);
}

function updateAggregateCard(avgPathMetric, depthMetrics) {
    var badReps = extractDepthData(depthMetrics);

    var aggregateMetric = 10 * (avgPathMetric / 100 + (depthMetrics.length - badReps.length) / depthMetrics.length) / 2
    document.getElementById('aggregate-metric').innerHTML = Math.round(aggregateMetric) + "/10";

    var emoji = "🤨";
    if (aggregateMetric > 9) {
        emoji = "🤩";
    } else if (aggregateMetric > 5) {
        emoji = "😀";
    } else if (aggregateMetric > 3) {
        emoji = "🤔";
    }
    document.getElementById('aggregate-description').innerHTML = emoji + " final score!";
}

function updatePathCard(avgPathMetric) {
    document.getElementById('bar-path-metric').innerHTML = "<b>" + avgPathMetric + "%</b>";
}

function updateDepthCard(depthMetrics) {
    var badReps = extractDepthData(depthMetrics);
    document.getElementById('depth-metric').innerHTML = "<b>" + (depthMetrics.length - badReps.length) + "/" + depthMetrics.length + "</b>";

    var depthDescription = "Astounding! All your reps hit depth."
    if (badReps.length == 1) {
        depthDescription = "Rep number " + badReps[0] + " did not hit depth. Scroll down for more.";
    } else if (badReps.length > 1) {
        depthDescription = "Reps number ";
        for (var i in badReps) {
            depthDescription += badReps[i] + ", ";
        }

        // take off the trailing comma
        depthDescription = depthDescription.substr(0, depthDescription.length - 2);

        depthDescription += " did not hit depth. Scroll down for more.";
    }

    document.getElementById('depth-description').innerHTML = depthDescription;
}

function extractDepthData(depthMetrics) {
    var badReps = [];
    for (var i = 0; i < depthMetrics.length; i++) {
        if (!depthMetrics[i]) {
            badReps.push(i + 1);
        }
    }
    return badReps;
}

//updateOverallStats(80, [false, true, false, true, true]);
