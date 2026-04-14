document.addEventListener("DOMContentLoaded", function () {
    let slides = document.querySelectorAll(".slide");
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? "flex" : "none"; // Show only the current slide
            slide.style.opacity = i === index ? "1" : "0";
        });
    }

    function nextSlide() {
        slides[currentSlide].style.opacity = "0";
        setTimeout(() => {
            slides[currentSlide].style.display = "none"; // Hide previous slide
            currentSlide++;

            if (currentSlide < slides.length) {
                slides[currentSlide].style.display = "flex";
                setTimeout(() => {
                    slides[currentSlide].style.opacity = "1";
                }, 100);
            } else {
                // After the last slide, redirect to login.HTML
                setTimeout(() => {
                    window.location.href = "instruction.html";
                }, 1000);
            }
        }, 1000);

        if (currentSlide < slides.length - 1) {
            setTimeout(nextSlide, 3000); // Move to the next slide after 3 seconds
        }
    }

    showSlide(currentSlide);
    setTimeout(nextSlide, 3000); // Start slideshow after 3 seconds
});
