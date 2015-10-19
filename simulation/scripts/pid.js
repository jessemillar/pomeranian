var PID = function(kp, ki, kd, direction) {
    // Constructor functionality at bottom of file

    this.update = function(processVariable) {
        var now = this.millis();
        var deltaMillis = now - this.lastTime;

        if (deltaMillis >= this.sampleTime) {
            var deltaSeconds = deltaMillis / 1000;

            // Compute the current error
            var error = this.setPoint - processVariable;

            // Compute the proportional term
            // http://en.wikipedia.org/wiki/PID_controller#Proportional_term
            var proportionalTerm = kp * error;

            // Accumulate the "integral" term
            // http://en.wikipedia.org/wiki/PID_controller#Integral_term
            this.integralTerm += ki * deltaSeconds * error;

            // Ensure "integral" term is within output range to aintegral windup:
            // http://en.wikipedia.org/wiki/PID_controller#Integral_windup
            if (this.integralTerm > this.outMax) {
                this.integralTerm = this.outMax;
            } else if (this.integralTerm < this.outMin) {
                this.integralTerm = this.outMin;
            }

            // Compute the derivative term
            // http://en.wikipedia.org/wiki/PID_controller#Derivative_term

            // Use the process variable derivative here instead of error derivative.
            // This avoids excessive output movement when the setpoint changes:
            // http://en.wikipedia.org/wiki/PID_controller#Set_Point_step_change
            var derivativeTerm = -1 * kd * (processVariable - this.lastProcessVariable) / deltaSeconds;

            // Compute PID output
            var output = proportionalTerm + this.integralTerm + derivativeTerm;

            // Ensure output is within output range
            if (output > this.outMax) {
                output = this.outMax;
            } else if (output < this.outMin) {
                output = this.outMin;
            }

            // Remember working variables
            this.lastProcessVariable = processVariable;
            lastError = error;
            this.lastTime = now;
        }

        return output;
    };

    this.setSetpoint = function(setPoint) {
        this.setPoint = setPoint;
    };

    this.setTunings = function(kp, ki, kd) {
        // Don't allow negative tunings
        if (kp < 0 || ki < 0 || kd < 0) {
            return;
        }

        // // Reverse PID factors if required
        // if (direction == PID_DIRECTION_REVERSE) {
        //     kp = 0 - kp;
        //     ki = 0 - ki;
        //     kd = 0 - kd;
        // }

        // Store new tunings
        this.kp = kp;
        this.ki = ki;
        this.kd = kd;
    };

    this.setDirection = function(direction) {
        // Adjust PID factors if direction has changed
        if (direction != this.direction) {
            kp = 0 - kp;
            ki = 0 - ki;
            kd = 0 - kd;
        }

        // Store new direction
        this.direction = direction;
    };

    this.setSampleTime = function(sampleTime) {
        if (sampleTime <= 0) {
            return;
        }

        // Store new sample time
        this.sampleTime = sampleTime;
    };

    this.setOutputLimits = function(outMin, outMax) {
        if (this.outMin >= this.outMax) {
            return;
        }

        // Ensure "integral" term is within output range to aintegral windup:
        // http://en.wikipedia.org/wiki/PID_controller#Integral_windup
        if (this.integralTerm > this.outMax) {
            this.integralTerm = this.outMax;
        } else if (this.integralTerm < this.outMin) {
            this.integralTerm = this.outMin;
        }

        // Store new output limits
        this.outMin = outMin;
        this.outMax = outMax;
    };

    this.millis = function() {
        return new Date().getTime();
    };

    // Constructor functionality
    this.setTunings(kp, ki, kd);
    this.setDirection(direction);
    this.integralTerm = 0;
    this.lastProcessVariable = 0;

    this.sampleTime = 1;
    this.lastTime = this.millis() - this.sampleTime;
};
