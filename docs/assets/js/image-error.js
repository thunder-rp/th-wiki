const notyf = new Notyf({
    duration: 5000,
    position: {
        x: 'right',
        y: 'top',
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('error', function(e) {
        if (e.target.tagName.toLowerCase() === 'img') {
            notyf.error("L'image n'a pas pu être chargée.");
            e.target.src = './assets/img/blank.png'; // Optional: replace with error image
        }
    }, true);
});