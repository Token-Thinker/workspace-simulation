// progress-bar.js

function updateProgress(percentage) {
    var progressBar = document.getElementById('progress');
    var progressLabel = document.getElementById('progress-label'); // Get the label element

    progressBar.style.width = percentage * 100 + '%';

    // Update the label text
    if (percentage == 0) {
        progressLabel.textContent = 'Starting...';
    } else if (percentage < 1) {
        progressLabel.textContent = 'Running scripts... ' + Math.floor(percentage * 100) + '% completed';
    } else {
        progressLabel.textContent = 'Finished!';
    }
}