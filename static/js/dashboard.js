let liveTimer = null;

const $ = id => document.getElementById(id);

function updateMetrics(d) {
    $('mVehicles').textContent = d.vehicles;
    $('mDensity').textContent = d.occupancy + '%';
    $('mSpeed').textContent = d.speed;
    $('mCongestion').textContent = d.congestion.toUpperCase();
}


/* PHASE IV — visual response */
function updateEmergencyScenario(priority) {
    const panel = document.querySelector('.emergency-panel');
    const route = document.querySelector('.emergency-panel .route');
    const ambulance = document.querySelector('.emergency-panel .ambulance');
    const label = document.querySelector('.emergency-panel .route-label');
    const steps = document.querySelectorAll('.emergency-panel .walkthrough > div');

    if (!panel || !route || !ambulance || !label) return;

    if (priority) {

        /* Emergency mode ON */
        panel.style.borderColor = '#ff5252';
        panel.style.boxShadow = '0 0 28px rgba(255,82,82,0.18)';

        route.style.background = '#39e69a';
        route.style.boxShadow =
            '0 0 18px #39e69a, 0 0 38px rgba(57,230,154,0.7)';

        ambulance.style.boxShadow =
            '0 0 18px #ff5252, 0 0 38px rgba(255,82,82,0.75)';

        label.textContent =
            'PREEMPTIVE GREEN CORRIDOR · ACTIVE';

        label.style.color = '#39e69a';

        /* Highlight the four emergency actions */
        steps.forEach((step, index) => {
            step.style.borderColor = '#ff5252';
            step.style.background = 'rgba(255,82,82,0.06)';
            step.style.boxShadow = 'inset 3px 0 #ff5252';
            step.style.transition = 'all 0.3s ease';

            const number = step.querySelector('b');
            if (number) {
                number.style.color = '#ff5252';
            }
        });

    } else {

        /* Normal traffic mode */
        panel.style.borderColor = '';
        panel.style.boxShadow = '';

        route.style.background = '';
        route.style.boxShadow = '';

        ambulance.style.boxShadow = '';

        label.textContent =
            'PREEMPTIVE GREEN CORRIDOR';

        label.style.color = '';

        steps.forEach(step => {
            step.style.borderColor = '';
            step.style.background = '';
            step.style.boxShadow = '';

            const number = step.querySelector('b');
            if (number) {
                number.style.color = '';
            }
        });
    }
}


async function analyzeTraffic() {

    $('state').textContent =
        'DECISION ENGINE · ANALYZING SENSOR STATE...';

    const payload = {
        location: $('loc').value,
        vehicles: Number($('veh').value),
        speed: Number($('spd').value),
        emergency: $('em').checked
    };

    try {

        const r = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const d = await r.json();

        updateMetrics(d);

        $('oc').textContent =
            d.congestion.toUpperCase();

        $('od').textContent =
            d.decision;

        $('oa').textContent =
            d.action;

        $('og').textContent =
            d.green_time + ' seconds';

        $('ot').textContent =
            d.target;

        $('conf').textContent =
            'MODEL CONFIDENCE: ' + d.confidence + '%';

        $('state').textContent =
            (d.priority
                ? 'EMERGENCY PRIORITY ACTIVE · '
                : ''
            ) +
            'DECISION CYCLE COMPLETE · ' +
            d.location.toUpperCase();

        /* THIS IS THE IMPORTANT PART */
        updateEmergencyScenario(d.priority);

    } catch (e) {

        $('state').textContent =
            'ERROR · CHECK FLASK SERVER';
    }
}


async function getLiveTelemetry() {

    try {

        const r = await fetch('/api/live');

        const d = await r.json();

        updateMetrics(d);

        $('state').textContent =
            'LIVE TELEMETRY · SENSOR STREAM ACTIVE · AI CLASSIFICATION UPDATING';

    } catch (e) {

        $('state').textContent =
            'LIVE TELEMETRY ERROR · CHECK FLASK SERVER';
    }
}


function toggleLiveTelemetry() {

    const b = $('liveButton');

    if (liveTimer !== null) {

        clearInterval(liveTimer);

        liveTimer = null;

        b.classList.remove('running');

        b.innerHTML =
            'START LIVE TELEMETRY <span>●</span>';

        $('state').textContent =
            'LIVE TELEMETRY STOPPED · SYSTEM READY';

        return;
    }

    getLiveTelemetry();

    liveTimer =
        setInterval(getLiveTelemetry, 1800);

    b.classList.add('running');

    b.innerHTML =
        'STOP LIVE TELEMETRY <span>●</span>';
}


$('analyze').addEventListener(
    'click',
    analyzeTraffic
);

$('liveButton').addEventListener(
    'click',
    toggleLiveTelemetry
);