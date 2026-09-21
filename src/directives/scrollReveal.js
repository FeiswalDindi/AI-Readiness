// src/directives/scrollReveal.js

const animatedScrollObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Element is visible -> Animate IN
                entry.target.classList.add('enter');
            } else {
                // Element is NOT visible -> Reset (Animate OUT)
                // This makes it ready to animate again next time you scroll to it
                entry.target.classList.remove('enter');
            }
        });
    },
    { 
        threshold: 0.15, 
        rootMargin: "0px 0px -50px 0px" 
    }
);

export default {
    mounted(el) {
        el.classList.add('before-enter');
        animatedScrollObserver.observe(el);
    }
};