var socket = io.connect(window.location.protocol + "//" + document.domain + ":" + location.port);

socket.on("connect", function () {
    console.log("Connected...!", socket.connected);
});

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
const video = document.querySelector("#videoElement");

video.onloadedmetadata = function(e) {
    video.width = video.videoWidth;
    video.height = video.videoHeight;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
};

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
        .getUserMedia({video: true})
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (error) {
            console.error("Error accessing media devices.", error);
        });
}

const FPS = 10;
setInterval(() => {
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    var data = canvas.toDataURL("image/jpeg", 0.5);
    context.clearRect(0, 0, video.videoWidth, video.videoHeight);

    // Emit the video frame to both sockets
    socket.emit("image_gray", data);
    socket.emit("image_blur", data);
}, 1000 / FPS);

// Receive processed images for both feeds and set them to corresponding image elements
socket.on("processed_image_gray", function (image) {
    document.getElementById("photo").setAttribute("src", image);
});

socket.on("processed_image_blur", function (image) {
    document.getElementById("photo-blur").setAttribute("src", image);
});