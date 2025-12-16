// --- Auto-focus & Input Logic ---
const inputDay = document.getElementById('day');
const inputMonth = document.getElementById('month');
const inputYear = document.getElementById('year');

inputDay.addEventListener('input', function() {
    // Limit to 2 digits and auto-focus
    if (this.value.length > 2) this.value = this.value.slice(0, 2);
    if (this.value.length === 2) inputMonth.focus();
});

inputMonth.addEventListener('input', function() {
    // Limit to 2 digits and auto-focus
    if (this.value.length > 2) this.value = this.value.slice(0, 2);
    if (this.value.length === 2) inputYear.focus();
});

// Add Backspace navigation for Month
inputMonth.addEventListener('keydown', function(e) {
    if (e.key === 'Backspace' && this.value === '') {
        inputDay.focus();
    }
});

inputYear.addEventListener('input', function() {
    // Limit to 4 digits
    if (this.value.length > 4) this.value = this.value.slice(0, 4);
});

// Allow pressing "Enter" to calculate, and Backspace to navigate back
inputYear.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') calculateAge();
    if (e.key === 'Backspace' && this.value === '') {
        inputMonth.focus();
    }
});

function calculateAge() {
    const dayInput = document.getElementById('day').value;
    const monthInput = document.getElementById('month').value;
    const yearInput = document.getElementById('year').value;
    
    const errorMsg = document.getElementById('error-msg');
    const resultContainer = document.getElementById('result-container');

    // 1. Check if fields are empty
    if (!dayInput || !monthInput || !yearInput) {
        showError("Please fill in all fields (DD, MM, YYYY).");
        return;
    }

    const d = parseInt(dayInput);
    const m = parseInt(monthInput);
    const y = parseInt(yearInput);

    // 2. Validate ranges
    if (m < 1 || m > 12) {
        showError("Month must be between 1 and 12.");
        return;
    }
    if (d < 1 || d > 31) {
        showError("Day must be between 1 and 31.");
        return;
    }
    if (y < 1900 || y > new Date().getFullYear()) {
        showError("Please enter a valid year.");
        return;
    }

    // 3. Strict Date Check
    const dob = new Date(y, m - 1, d);
    if (dob.getDate() !== d || dob.getMonth() + 1 !== m || dob.getFullYear() !== y) {
        showError("Invalid date provided (e.g., 30th Feb).");
        return;
    }

    // 4. Future Date Check
    const today = new Date();
    if (dob > today) {
        showError("Date of birth cannot be in the future.");
        return;
    }

    // If valid:
    errorMsg.classList.add('hidden');
    
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
    }

    if (days < 0) {
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
    }

    // Show container
    resultContainer.classList.remove('hidden');
    
    // Animate Numbers
    animateValue(document.getElementById('res-years'), 0, years, 1500);
    animateValue(document.getElementById('res-months'), 0, months, 1500);
    animateValue(document.getElementById('res-days'), 0, days, 1500);

    // Extra flair: Day of birth
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const birthDayName = daysOfWeek[dob.getDay()];
    document.getElementById('extra-info').innerText = `You were born on a ${birthDayName}!`;
}

function showError(message) {
    const errorMsg = document.getElementById('error-msg');
    const resultContainer = document.getElementById('result-container');
    
    errorMsg.innerText = message;
    errorMsg.classList.remove('hidden');
    resultContainer.classList.add('hidden');
}

// Counting Animation Function
function animateValue(obj, start, end, duration) {
    if (start === end) {
        obj.innerHTML = end;
        return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Ease Out Quart function for smooth slowdown at end
        const ease = 1 - Math.pow(1 - progress, 4);
        
        obj.innerHTML = Math.floor(ease * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end;
        }
    };
    window.requestAnimationFrame(step);
}