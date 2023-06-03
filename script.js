document.addEventListener('DOMContentLoaded', function() {
    var modelViewer = document.querySelector('#cubo3D model-viewer');

    modelViewer.addEventListener('load', function() {
        var model = modelViewer.model;
        model.setScale(2); // Ajusta el valor según tus necesidades
    });
});
