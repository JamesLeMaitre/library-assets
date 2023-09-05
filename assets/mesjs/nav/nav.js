$(document).ready(function () {
    var pathname = window.location.pathname;
    $('ul > li > a[href="' + pathname + '"]').parents().addClass('active');


});