const galleryData = {
    "nowosc1": [
        { 
            src: "../img/IMG_6303.JPG", 
            caption: "Zapraszamy do zamawiania ciast na podstronie CIASTA" 
        },
        { 
            src: "../img/IMG_6304.JPG", 
            caption: "Zapraszamy do zamawiania ciast na podstronie CIASTA" 
        },
        { 
            src: "../img/IMG_6305.JPG", 
            caption: "Zapraszamy do zamawiania ciast na podstronie CIASTA" 
        },
        { 
            src: "../img/IMG_6306.JPG", 
            caption: "Zapraszamy do zamawiania ciast na podstronie CIASTA" 
        },
        { 
            src: "../img/IMG_6307.JPG", 
            caption: "Zapraszamy do zamawiania ciast na podstronie CIASTA" 
        },
        { 
            src: "../img/IMG_6308.JPG", 
            caption: "Zapraszamy do zamawiania ciast na podstronie CIASTA" 
        },
        { 
            src: "../img/IMG_6309.JPG", 
            caption: "Zapraszamy do zamawiania ciast na podstronie CIASTA" 
        },

    ],
};

let currentGalleryId = null;
let currentSlideIndex = 0;

const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');

function openModal(galleryId, slideIndex) {
    currentGalleryId = galleryId;
    currentSlideIndex = slideIndex;
    showSlide(slideIndex);
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

function closeModalOnOuterClick(event) {
    if (event.target === modal) {
        closeModal();
    }
}

function changeSlide(n) {
    const gallery = galleryData[currentGalleryId];
    currentSlideIndex += n;

    if (currentSlideIndex >= gallery.length) {
        currentSlideIndex = 0;
    }
    if (currentSlideIndex < 0) {
        currentSlideIndex = gallery.length - 1;
    }

    showSlide(currentSlideIndex);
}

function showSlide(index) {
    const gallery = galleryData[currentGalleryId];
    if (!gallery) return;

    modalImage.src = gallery[index].src;
    modalCaption.textContent = gallery[index].caption;
    
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (gallery.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape" && modal.style.display === "block") {
        closeModal();
    }
});