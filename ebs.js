let balance = 0;
let progressBalance = 1000; // Start with 1000 points for progress

document.addEventListener('DOMContentLoaded', () => {
    const user = window.Telegram.WebApp.initDataUnsafe.user;

    if (user) {
        let username = user.username || user.first_name || 'Unknown';
        if (username.length > 10) {
            username = username.substring(0, 10) + '...';
        }
        document.getElementById('username-value').innerText = username;

        // Retrieve stored balance from localStorage
        const storedBalance = localStorage.getItem(`balance_${user.id}`);

        if (storedBalance !== null) {
            balance = parseFloat(storedBalance);
        }

        document.getElementById('balance').innerText = `Balance: ${balance}`;
        
        updateProgressBar(); // Ensure the progress bar is updated

        // Set up touch event listener for multi-touch
        document.getElementById('tap-photo').addEventListener('touchstart', (event) => {
            event.preventDefault(); // Prevent the default touch action
            const touches = event.touches.length;
            for (let i = 0; i < touches; i++) {
                incrementBalance();
            }
        });
    } else {
        alert("Unable to get Telegram user info.");
    }
});

function incrementBalance() {
    if (progressBalance > 0) {
        balance += 1; // Increase the main balance
        progressBalance -= 1; // Decrease progress by 1 point on each tap
        updateProgressBar();

        // Update balance and save it to localStorage
        document.getElementById('balance').innerText = `Balance: ${balance}`;
        localStorage.setItem(`balance_${window.Telegram.WebApp.initDataUnsafe.user.id}`, balance);
    }
}

function updateProgressBar() {
    let progressWidth = (progressBalance / 1000) * 100; // Progress width as a percentage of 1000
    document.getElementById('progress-bar').style.width = `${progressWidth}%`;
    document.getElementById('progress-number').innerText = `${progressBalance}`; // Display progress number below the bar
}

// Automatically add +1 to the progress balance every second
setInterval(() => {
    if (progressBalance < 1000) { // Ensure it doesn't exceed 1090
        progressBalance += 1;
        updateProgressBar();
    }
}, 1000); // 1000 milliseconds = 1 second