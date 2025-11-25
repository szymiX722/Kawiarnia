    let currentImageIndex = 0;
    const lightbox = document.getElementById('ciastaLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    // Zbieramy wszystkie ścieżki do zdjęć i opisy ALT
    const galleryItems = Array.from(document.querySelectorAll('.galeria-ciast img')).map((img) => ({
        src: img.src,
        alt: img.alt
    }));

    function openLightbox(index) {
        currentImageIndex = index;
        updateLightbox();
        lightbox.style.display = "block";
    }

    function closeLightbox() {
        lightbox.style.display = "none";
    }

    function closeLightboxOnOuterClick(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    }

    function changeSlide(n) {
        currentImageIndex += n;

        // Zapętlanie galerii
        if (currentImageIndex >= galleryItems.length) {
            currentImageIndex = 0;
        }
        if (currentImageIndex < 0) {
            currentImageIndex = galleryItems.length - 1;
        }

        updateLightbox();
    }

    function updateLightbox() {
        const item = galleryItems[currentImageIndex];
        lightboxImage.src = item.src;
        // Dodajemy numerację i opis
        lightboxCaption.textContent = `${item.alt} (${currentImageIndex + 1} z ${galleryItems.length})`;
    }

    // Zamykanie Modala klawiszem ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && lightbox.style.display === "block") {
            closeLightbox();
        }
        // Obsługa strzałek na klawiaturze do nawigacji
        if (lightbox.style.display === "block") {
            if (event.key === "ArrowLeft") {
                changeSlide(-1);
            } else if (event.key === "ArrowRight") {
                changeSlide(1);
            }
        }
    });

// --- FUNKCJE KALENDARZA CIEM ---

document.addEventListener('DOMContentLoaded', async function() {
    const kalendarzDiv = document.getElementById('kalendarzCiasta');
    const wybranaDataInput = document.getElementById('wybranaDataCiasta');
    
    // Ustawiamy minimalny czas na 3 dni (3 * 24h)
    const MIN_DNI = 3;
    let zablokowaneDaty = [];

    // 1. Pobieranie zablokowanych dat
    async function pobierzZablokowaneDaty() {
        try {
            // W realnym projekcie: używasz Fetch API do pobrania pliku z serwera
            const response = await fetch('zablokowane_daty_ciasta.json'); // Możesz użyć innego pliku dla ciast
            if (response.ok) {
                const data = await response.json();
                zablokowaneDaty = data.zablokowane;
            }
        } catch (error) {
            console.error('Błąd ładowania zablokowanych dat. Używam pustej listy.');
            zablokowaneDaty = []; 
        }
    }

    // 2. Generowanie kalendarza (tylko bieżący i następny miesiąc)
    function generujKalendarz() {
        const dzisiaj = new Date();
        // Ustawienie minimalnej daty odbioru na dzisiaj + 3 dni
        const minDataTimestamp = dzisiaj.getTime() + (MIN_DNI * 24 * 60 * 60 * 1000);
        const minData = new Date(minDataTimestamp);
        
        const biezacyMiesiac = dzisiaj.getMonth();
        const biezacyRok = dzisiaj.getFullYear();
        
        kalendarzDiv.innerHTML = ''; // Czyścimy

        for (let m = 0; m < 2; m++) { // Generujemy 2 miesiące
            const dataMiesiac = new Date(biezacyRok, biezacyMiesiac + m, 1);
            const nazwaMiesiaca = dataMiesiac.toLocaleString('pl-PL', { month: 'long', year: 'numeric' });
            
            let html = `<div class="miesiac-kalendarz"><p class="nazwa-miesiaca">${nazwaMiesiaca}</p><div class="dni-tygodnia"><span>Pon</span><span>Wt</span><span>Śr</span><span>Czw</span><span>Pt</span><span>Sob</span><span>Ndz</span></div><div class="dni">`;
            
            // Wypychamy puste dni na początek (Poniedziałek jako 0)
            let pierwszyDzienMiesiaca = (dataMiesiac.getDay() + 6) % 7; 
            for (let i = 0; i < pierwszyDzienMiesiaca; i++) {
                html += '<span></span>';
            }

            let dzien = 1;
            while (new Date(biezacyRok, biezacyMiesiac + m, dzien).getMonth() === biezacyMiesiac + m) {
                const dataPelna = new Date(biezacyRok, biezacyMiesiac + m, dzien);
                const dataString = `${dataPelna.getFullYear()}-${String(dataPelna.getMonth() + 1).padStart(2, '0')}-${String(dzien).padStart(2, '0')}`;
                
                let klasa = 'dzien';
                
                // Blokowanie dat
                const dataDoPorownania = new Date(dataString);
                dataDoPorownania.setHours(0, 0, 0, 0); 
                minData.setHours(0, 0, 0, 0); // Reset godzin dla poprawnego porównania
                
                if (zablokowaneDaty.includes(dataString) || dataDoPorownania < minData) {
                    klasa += ' zablokowany';
                }
                
                // Oznaczenie, że jest to dzisiaj, ale tylko jeśli jest dostępny
                if (dataDoPorownania.getTime() === minData.getTime() && klasa.indexOf('zablokowany') === -1) {
                    klasa += ' min-data-ciasta';
                }
                
                html += `<span class="${klasa}" data-data="${dataString}">${dzien}</span>`;
                dzien++;
            }
            html += '</div></div>';
            kalendarzDiv.innerHTML += html;
        }
        
        dodajListeneryDoDni();
    }

    // 3. Obsługa kliknięć i stylizacja aktywnego dnia
    function dodajListeneryDoDni() {
        // KLUCZOWA ZMIANA: Dodajemy .nieaktywny do selektora, aby dni przeszłe nie były klikalne
        document.querySelectorAll('.dzien:not(.zablokowany):not(.nieaktywny)').forEach(dzienElement => {
            dzienElement.addEventListener('click', function() {
                document.querySelectorAll('.dzien.wybrany-ciasta').forEach(el => el.classList.remove('wybrany-ciasta'));
                this.classList.add('wybrany-ciasta');
                wybranaDataInput.value = this.getAttribute('data-data');
            });
        });
    }
    
    // --- STYLIZACJA CSS DLA KALENDARZA (Wstrzyknięta, aby była dostępna) ---
    // Używamy stylów z tortów, ale dodajemy unikalną klasę dla wybranego dnia
    const style = document.createElement('style');
    style.textContent = `
        .miesiac-kalendarz { margin-bottom: 20px; border: 1px solid #ddd; border-radius: 5px; padding: 10px; }
        .nazwa-miesiaca { text-align: center; font-weight: bold; margin-bottom: 10px; color: #0c113d; }
        .dni-tygodnia, .dni { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; }
        .dni-tygodnia span { font-weight: bold; color: #555; }
        .dzien { padding: 8px 0; cursor: pointer; transition: background-color 0.2s; border-radius: 4px; }
        .dzien:hover:not(.zablokowany) { background-color: #eee; }
        .dzien.zablokowany { background-color: #fdd; color: #c00; text-decoration: line-through; cursor: not-allowed; }
        /* Nowa, unikalna klasa dla wybranego dnia w formularzu ciast */
        .dzien.wybrany-ciasta { background-color: #0c113d; color: white; font-weight: bold; }
        .dzien.min-data-ciasta { border: 2px solid #0c113d; } /* Wyróżnienie minimalnej dostępnej daty */
    `;
    document.head.appendChild(style);

    // --- URUCHOMIENIE ---
    await pobierzZablokowaneDaty();
    generujKalendarz();

    // Możesz tutaj dodać logikę do generowania wiadomości e-mail przy submit
    // np. formularz.addEventListener('submit', function(e) { e.preventDefault(); utworzWiadomosc(); });
});