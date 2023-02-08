$(document).ready(function() {
    const elem = document.getElementsByClassName("progressBar")[0];
    let width = 1;
    let id = setInterval(frame, 1000);
    setTimeout(function() { window.location.href = '/home' }, 30);

    function frame() {
        console.log('entre');
        if (width >= 1000) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + "%";
        }
    }
});