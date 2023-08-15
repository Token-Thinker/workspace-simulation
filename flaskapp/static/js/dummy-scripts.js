// dummy-scripts.js

let totalScripts = 10;
let completedScripts = 0;

// Simulate the completion of a script
function simulateScriptCompletion() {
    completedScripts++;
    updateProgress(completedScripts / totalScripts);
    console.log(`Completed script ${completedScripts} of ${totalScripts}`);
}

// Simulate the running of scripts with some delay
for (let i = 0; i < totalScripts; i++) {
    setTimeout(simulateScriptCompletion, i * 2000); // Delay of 2 seconds between each script
}
