    document.addEventListener('DOMContentLoaded', () => {
        const progressBarFill = document.getElementById('progressBarFill');
        const progressMessage = document.getElementById('progressMessage');
        let progress = 0;

        // Symulacja ładowania
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 10) + 5; // Losowy wzrost
            if (progress > 100) {
                progress = 100;
            }
            progressBarFill.style.width = `${progress}%`;
            progressMessage.querySelector('span').textContent = `${progress}%`;

            if (progress === 100) {
                clearInterval(interval);
                progressMessage.innerHTML = 'Prawie gotowe! Jeszcze chwila...';
            }
        }, 800); // Co 0.8 sekundy
    });