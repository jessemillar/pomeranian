// Modified from "Node.js PID Controller" (https://github.com/Philmod/node-pid-controller)

var PID = function(kp, ki, kd, dt) {
    this.kp = ki || 1;
    this.ki = ki || 0;
    this.kd = kd || 0;

    this.dt = dt || 0;

    this.sumError = 0;
    this.lastError = 0;
    this.lastTime = 0;

    this.target = 0;
};

PID.prototype.setTarget = function(target) {
    this.target = target;
};

PID.prototype.update = function(currentValue) {
    this.currentValue = currentValue;

    var dt = this.dt;

    if (!dt) {
        var currentTime = Date.now();
        if (this.lastTime === 0) { // First time update() is called
            dt = 0;
        } else {
            dt = (currentTime - this.lastTime) / 1000;
        }
        this.lastTime = currentTime;
    }

    if (dt === 0) {
        dt = 1;
    }

    var error = (this.target - this.currentValue);
    this.sumError = this.sumError + error * dt;
    var dError = (error - this.lastError) / dt;
    this.lastError = error;

    return (this.kp * error) + (this.ki * this.sumError) + (this.kd * dError);
};

PID.prototype.reset = function() {
    this.sumError = 0;
    this.lastError = 0;
    this.lastTime = 0;
};
