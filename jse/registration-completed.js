
var btn = document.querySelector('#redirect_url');

function startTimer(duration, display) {
    var timer = duration, seconds;
    setInterval(function () {
        seconds = parseInt(timer % 60, 10);
        display.textContent = seconds;
        if (--timer < 0) {
            window.location.href =  btn.getAttribute('href')
        }
    }, 1000);
}

window.onload = function () {
    var display = document.querySelector('#time');
    startTimer(15, display);
};

function copyToClipboard() {
    var tick = document.querySelector('.tick');
    copy = document.querySelector('.copy');
    loginPassword = document.querySelector('#loginPassword')
    range = document.createRange();
    range.selectNode(loginPassword);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    tick.classList.add('tick_show')
    copy.classList.add('copy_show')
}


