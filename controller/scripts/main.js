var left_stick = document.getElementById('left-stick');
var left_nub = document.getElementById('left-nub');

left_stick.addEventListener('touchend', function(event) {
    left_nub.style.left = touch.pageX + 'px';
    left_nub.style.top = touch.pageY + 'px';
}, false);

left_stick.addEventListener('touchmove', function(event) {
    if (event.targetTouches.length == 1) {
        var touch = event.targetTouches[0];
        left_nub.style.left = touch.pageX + 'px';
        left_nub.style.top = touch.pageY + 'px';
    }
}, false);
