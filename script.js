const startButton = document.getElementById('startTest');
const speedDisplay = document.getElementById('speed');
const statusDisplay = document.getElementById('status');
const speedIndicator = document.getElementById('needle');
const gaugeFill = document.querySelector('.gauge-fill');
const gaugeText = document.querySelector('.gauge-text');

startButton.addEventListener('click', startSpeedTest);

function startSpeedTest()
{
    startButton.disabled = true;
    speedDisplay.textContent = '-- Mbps';
    statusDisplay.textContent = 'Testing...';
    speedDisplay.classList.add('pulse');
    
    const startTime = new Date().getTime();
    const fileSize = 10 * 1024 * 1024; // 10 MB file size
    const downloadUrl = `https://speed.cloudflare.com/__down?bytes=${fileSize}`;

    fetch(downloadUrl)
        .then(response => response.blob())
        .then(blob => {
            const endTime = new Date().getTime();
            const duration = (endTime - startTime) / 1000; // Duration in milli seconds
            const speedMbps = ((fileSize * 8) / duration / 1000000).toFixed(2);

            updateSpeedDisplay(speedMbps);
            statusDisplay.textContent = 'Test completed';
            startButton.disabled = false;
        })
        .catch(error => {
            console.error('Error during speed test:', error);
            statusDisplay.textContent = 'Error occurred during test';
            startButton.disabled = false;
            speedDisplay.classList.remove('pulse');
        });
}

function updateSpeedDisplay(speed)
{
    speedDisplay.textContent = `${speed} Mbps`;
    speedDisplay.classList.remove('pulse');

    // Update color based on speed
    if (speed < 10)
        speedDisplay.style.color = '#ef4444'; // Red for slow
    else if (speed < 25)
        speedDisplay.style.color = '#f59e0b'; // Orange for medium
    else if (speed < 75)
        speedDisplay.style.color = '#10b981'; // Green for fast
    else
        speedDisplay.style.color = '#6366f1'; // Violet for super fast

    // Update gauge
    const angle = Math.min(speed, 100) * 1.8 - 90; // Max 100 Mbps, 180 degree rotation
    speedIndicator.style.transform = `rotate(${angle - 90}deg)`;

    // Update gauge fill
    const fillPercentage = Math.min(speed, 100) / 100;
    const dashArray = fillPercentage * 251.2;
    gaugeFill.style.strokeDasharray = `${dashArray} 251.2`;

    // Update gauge text
    gaugeText.textContent = Math.round(speed);
}