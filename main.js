let version = 5;
let xSum = 0;
let ySum = 0;
let xDoubleSum = 0;
let yDoubleSum = 0;
let lastTimestamp;
let lastAcceleration;
let gyroThreshold = 0.02;
let moving = false;
let lifted = false;

let maxCalibrationPoints = 100
let calibrationPoints = [];
let calibrating = false;
let accelerationOffset = {
    x: 0,
    y: 0
}

let data = {
    a: [],
    v: [],
    p: []
}

let maxPos = 0.25;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    fill(255, 0, 0);
    background(100);
    ellipse(width / 2, height / 2, 50, 50);
}

function draw() {
    background(100);

    // if (abs(xDoubleSum) > maxPos) {
    //     xSum = 0;
    //     ySum = 0;
    //     xDoubleSum = 0;
    //     yDoubleSum = 0;
    // }

    // if (abs(yDoubleSum) > maxPos) {
    //     xSum = 0;
    //     ySum = 0;
    //     xDoubleSum = 0;
    //     yDoubleSum = 0;
    // }

    fill(255, 0, 0);
    ellipse(
        (width / 2) +
        map(
            xDoubleSum,
            -1 * maxPos,
            maxPos,
            (-1 * width) / 2 + 50 / 2,
            width / 2 - 50 / 2
        ),
        (height / 2) +
        map(yDoubleSum, -1 * maxPos,
            maxPos,
            height / 2 - 50 / 2,
            (-1 * height) / 2 + 50 / 2
        ),
        50,
        50
    );

    fill(000)
    rect(0, (height / 2) / 3, width, 1);


    let clone = Array.from(data.a)
    let accelerationData = clone.splice(-200);

    var maxAcceleration = 2

    for (var i = 0; i < accelerationData.length; i++) {
        if (abs(accelerationData[i].x) > maxAcceleration) {
            maxAcceleration = abs(accelerationData[i].x);
        }
        if (abs(accelerationData[i].y) > maxAcceleration) {
            maxAcceleration = abs(accelerationData[i].y);
        }
    }

    if (accelerationData.length >= 2)
        for (var i = 1; i < accelerationData.length; i++) {
            fill(255, 0, 0);
            stroke(255, 0, 0);
            ellipse(map(i, 0, 200 - 1, 0, width), map(-accelerationData[i].x, -maxAcceleration, maxAcceleration, 0, height) / 3, 2, 2);
            line(map(i - 1, 0, 200 - 1, 0, width), map(-accelerationData[i - 1].x, -maxAcceleration, maxAcceleration, 0, height) / 3, map(i, 0, 200 - 1, 0, width), map(-accelerationData[i].x, -maxAcceleration, maxAcceleration, 0, height) / 3);
            noStroke();
            fill(0, 0, 255)
            stroke(0, 0, 255);
            ellipse(map(i, 0, 200 - 1, 0, width), map(-accelerationData[i].y, -maxAcceleration, maxAcceleration, 0, height) / 3, 2, 2);
            line(map(i - 1, 0, 200 - 1, 0, width), map(-accelerationData[i - 1].y, -maxAcceleration, maxAcceleration, 0, height) / 3, map(i, 0, 200 - 1, 0, width), map(-accelerationData[i].y, -maxAcceleration, maxAcceleration, 0, height) / 3);
            noStroke();
        }
    fill(000)
    rect(0, (height / 2) / 3 + height / 3, width, 1);

    clone = Array.from(data.v)
    let velocityData = clone.splice(-200);

    var maxVelocity = 2

    for (var i = 0; i < velocityData.length; i++) {
        if (abs(velocityData[i].x) > maxVelocity) {
            maxVelocity = abs(velocityData[i].x);
        }
        if (abs(velocityData[i].y) > maxVelocity) {
            maxVelocity = abs(velocityData[i].y);
        }
    }

    if (velocityData.length >= 2)
        for (var i = 1; i < velocityData.length; i++) {
            fill(255, 255, 0);
            stroke(255, 255, 0);
            ellipse(map(i, 0, 200 - 1, 0, width), map(-velocityData[i].x, -maxVelocity, maxVelocity, 0, height) / 3 + height / 3, 2, 2);
            line(map(i - 1, 0, 200 - 1, 0, width), map(-velocityData[i - 1].x, -maxVelocity, maxVelocity, 0, height) / 3 + height / 3, map(i, 0, 200 - 1, 0, width), map(-velocityData[i].x, -maxVelocity, maxVelocity, 0, height) / 3 + height / 3);
            noStroke();
            fill(255, 0, 255)
            stroke(255, 0, 255);
            ellipse(map(i, 0, 200 - 1, 0, width), map(-velocityData[i].y, -maxVelocity, maxVelocity, 0, height) / 3 + height / 3, 2, 2);
            line(map(i - 1, 0, 200 - 1, 0, width), map(-velocityData[i - 1].y, -maxVelocity, maxVelocity, 0, height) / 3 + height / 3, map(i, 0, 200 - 1, 0, width), map(-velocityData[i].y, -maxVelocity, maxVelocity, 0, height) / 3 + height / 3);
            noStroke();
        }
    fill(000)
    rect(0, (height / 2) / 3 + (2 * height) / 3, width, 1);

    clone = Array.from(data.p)
    let positionData = clone.splice(-200);

    var maxPosition = 2

    for (var i = 0; i < positionData.length; i++) {
        if (abs(positionData[i].x) > maxPosition) {
            maxPosition = abs(positionData[i].x);
        }
        if (abs(positionData[i].y) > maxPosition) {
            maxPosition = abs(positionData[i].y);
        }
    }

    if (positionData.length >= 2)
        for (var i = 1; i < positionData.length; i++) {
            fill(0, 255, 0);
            stroke(0, 255, 0);
            ellipse(map(i, 0, 200 - 1, 0, width), map(-positionData[i].x, -maxPosition, maxPosition, 0, height) / 3 + (2 * height) / 3, 2, 2);
            line(map(i - 1, 0, 200 - 1, 0, width), map(-positionData[i - 1].x, -maxPosition, maxPosition, 0, height) / 3 + (2 * height) / 3, map(i, 0, 200 - 1, 0, width), map(-positionData[i].x, -maxPosition, maxPosition, 0, height) / 3 + (2 * height) / 3);
            noStroke();
            fill(0, 255, 255)
            stroke(0, 255, 255);
            ellipse(map(i, 0, 200 - 1, 0, width), map(-positionData[i].y, -maxPosition, maxPosition, 0, height) / 3 + (2 * height) / 3, 2, 2);
            line(map(i - 1, 0, 200 - 1, 0, width), map(-positionData[i - 1].y, -maxPosition, maxPosition, 0, height) / 3 + (2 * height) / 3, map(i, 0, 200 - 1, 0, width), map(-positionData[i].y, -maxPosition, maxPosition, 0, height) / 3 + (2 * height) / 3);
            noStroke();
        }

    text("Moving : " + moving, 10, 10);
    text("Lifted : " + lifted, 10, 30);
    text("Offset : " + JSON.stringify(accelerationOffset), 10, 50);
    text("Version : " + version, 10, 70);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function load() {
    linAccelerometerSetup();
    gyroscopeSetup();
}

function gyroscopeSetup() {
    let sensor = new Gyroscope({
        frequency: 60
    });
    sensor.start();

    sensor.addEventListener('reading', e => {
        let checkedValues = [sensor.x, sensor.y];
        moving = !checkThreshold(sensor.z, gyroThreshold);
        //moving = true
        lifted = false;
        for (var i = 0; i < checkedValues.length; i++) {
            if (!checkThreshold(checkedValues[i], .04))
                lifted = true;
        }
        if (!moving || lifted) {
            xSum = 0;
            ySum = 0;
        }
        // console.log("moving: " + moving);
        // console.log("lifted: " + lifted);
    });
}

function checkThreshold(input, threshold, center = 0) {
    return input <= center + threshold && input >= center - threshold;
}


function linAccelerometerSetup() {
    let sensor = new LinearAccelerationSensor({
        frequency: 60
    });
    sensor.start();

    sensor.onreading = () => {
        if (lastTimestamp) {
            let interval = sensor.timestamp - lastTimestamp;
            let deltaAcceleration = {
                x: lastAcceleration.x - sensor.x,
                y: lastAcceleration.y - sensor.y,
                z: lastAcceleration.z - sensor.z
            }

            //console.log(deltaAcceleration);
            if (!moving && !lifted) {
                calibrating = true;
                calibrationPoints.push({
                    x: sensor.x,
                    y: sensor.y
                });
                if (calibrationPoints.length > maxCalibrationPoints) {
                    calibrationPoints.shift();
                }

                accelerationOffset.x = 0;
                accelerationOffset.y = 0;
                for (let i = 0; i < calibrationPoints.length; i++) {
                    accelerationOffset.x += calibrationPoints[i].x;
                    accelerationOffset.y += calibrationPoints[i].y;
                }
                if (calibrationPoints.length > 0) {
                    accelerationOffset.x /= calibrationPoints.length;
                    accelerationOffset.y /= calibrationPoints.length;
                }
            } else {
                if (calibrating) {
                    calibrating = false;
                    calibratingPoints = [];
                }
            }

            if (moving && !lifted) {
                xSum += ((Math.round((sensor.x - accelerationOffset.x) * 100) / 100) + (Math.round(lastAcceleration.x * 100) / 100)) / 2 * (interval / 1000);
                ySum += ((Math.round((sensor.y - accelerationOffset.y) * 100) / 100) + (Math.round(lastAcceleration.y * 100) / 100)) / 2 * (interval / 1000);

                // console.log('A:\nx: ' + sensor.x + '\ny: ' + sensor.y);
                // console.log('V:\nx: ' + xSum + '\ny: ' + ySum);
                // console.log("P:\nx: " + xDoubleSum + xSum * (interval / 1000), "\ny: " + yDoubleSum + ySum * (interval / 1000));

            }

            xDoubleSum += xSum * (interval / 1000);
            yDoubleSum += ySum * (interval / 1000);
            data.a.push({
                x: sensor.x - accelerationOffset.x,
                y: sensor.y - accelerationOffset.y,
                interval: interval,
                moving: moving,
                lifted: lifted
            })

            data.v.push({
                x: xSum,
                y: ySum,
                interval: interval,
                moving: moving,
                lifted: lifted
            })

            data.p.push({
                x: xDoubleSum,
                y: yDoubleSum,
                interval: interval,
                moving: moving,
                lifted: lifted
            })
        }
        lastTimestamp = sensor.timestamp;
        lastAcceleration = {
            x: sensor.x - accelerationOffset.x,
            y: sensor.y - accelerationOffset.y,
            z: sensor.z
        }
    }
}