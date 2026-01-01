// Select our two main sections
const writingSection = document.getElementById('writing-section');
const lockedSection = document.getElementById('locked-section');

// Select UI elements
const textarea = document.getElementById('resolution');
const submitBtn = document.getElementById('submit-btn');
const timerDisplay = document.getElementById('timer');

window.onload = () => {
    const activeYear = localStorage.getItem('activeYear');

    if (activeYear) {
        const capsuleData = JSON.parse(localStorage.getItem(`capsule_${activeYear}`));
        const now = new Date().getTime();

        // Check if the time has already passed
        if (now >= capsuleData.unlockDate) {
            unlockCapsule(activeYear);
        } else {
            showTimerUI();
        }
    }
};

submitBtn.addEventListener('click', () => {
    const currentYear = new Date().getFullYear();

    // Create the "Capsule" Object
    const capsuleData = {
        text: textarea.value.trim(),
        unlockDate: new Date().getTime() + 1000,
        isLocked: true,
        dateCreated: new Date().toISOString()
    };
    // unlockDate: new Date(`January 1, ${currentYear + 1} 00:00:00`).getTime(),
    // Save it as a single string
    localStorage.setItem(`capsule_${currentYear}`, JSON.stringify(capsuleData));

    // Also save a 'pointer' to know which one is currently active
    localStorage.setItem('activeYear', currentYear);

    showTimerUI();
});

function showTimerUI() {
    const activeYear = localStorage.getItem('activeYear');
    if (!activeYear) return;

    const capsuleData = JSON.parse(localStorage.getItem(`capsule_${activeYear}`));

    writingSection.classList.add('d-none');
    lockedSection.classList.remove('d-none');

    // 1. Create a named function for the update logic
    const update = () => {
        const now = new Date().getTime();
        const distance = capsuleData.unlockDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            unlockCapsule(activeYear);
            return; // Exit the function early
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerDisplay.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    // 2. Run once
    update();

    // 3. Then start the interval to keep it updated
    const countdownInterval = setInterval(update, 1000);
}

function unlockCapsule(year) {
    const capsuleData = JSON.parse(localStorage.getItem(`capsule_${year}`));

    // Hide timer, show a "Reveal" state
    lockedSection.innerHTML = `
        <div class="reveal-container text-center">
            <h2>Your ${year} Resolutions:</h2>
            <div class="past-resolution-box p-4 bg-white border shadow-sm my-4">
                ${capsuleData.text}
            </div>
            <button class="btn btn-success" onclick="resetForNewYear()">Write New Resolutions</button>
        </div>
    `;
}

function resetForNewYear() {
    // We keep the old capsule in storage, but remove the 'active' pointer
    // so the user can start fresh for the next year.
    localStorage.removeItem('activeYear');
    location.reload();
}