Dropzone.autoDiscover = false;

const dropZone = document.querySelector('.drop-zone');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drop-zone--over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drop-zone--over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drop-zone--over');

    let files = e.dataTransfer.files;
    handleFiles(files);
});

dropZone.addEventListener('click', () => {
    dropZone.querySelector('input[type="file"]').click();
});

dropZone.querySelector('input[type="file"]').addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    // You can call the Dropzone's upload function here or whatever you want to do with the files
}


$(function() {
    var dropzone = new Dropzone('.drop-zone__input', {
        url: '/upload_file',
        paramName: 'file', // The name that will be used to transfer the file
        maxFilesize: 2, // MB
        acceptedFiles: '.stl',
        addRemoveLinks: true,
        dictDefaultMessage: 'Drop files here to upload, or click to select files',

        init: function() {
            this.on('error', function(file, response) {
                console.error(response);
                $('#terminal').append('\nError occurred while uploading the file.');
            });
            this.on('success', function(file, response) {
                console.log(response);
                $('#terminal').append('\nFile uploaded successfully.');
            });
        }
    });
});