var left_stick = document.getElementById('left-stick'),
    left_nub = document.getElementById('left-nub'),
    stick_width = document.getElementById('left-stick').offsetWidth,
    stick_height = document.getElementById('left-stick').offsetHeight,
    nub_width = document.getElementById('left-nub').offsetWidth,
    nub_height = document.getElementById('left-nub').offsetHeight;

console.log(stick_width);

left_stick.addEventListener('touchend', function(event) {
    left_nub.style.left = touch.pageX + 'px';
    left_nub.style.top = touch.pageY + 'px';
}, false);

left_stick.addEventListener('touchmove', function(event) {
    if (event.targetTouches.length == 1) {
        var touch = event.targetTouches[0];
        left_nub.style.left = touch.pageX - nub_width / 2 + 'px';
        left_nub.style.top = touch.pageY - nub_height / 2 + 'px';
    }
}, false);
