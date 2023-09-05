$(document).ready(function () {

    $(function () {
        $('.jim').datetimepicker({
            viewMode: 'years',
            format: 'MM/YYYY',
            toolbarPlacement: 'bottom',
            showTodayButton: true,
            showClose: true,
            viewDate: false
        });


        $('#datetimepicker').james({
            format: 'MM/DD/YYYY HH:mm',
            shortTime: false,
            //minDate: $dateMin,
            //maxDate: null,
            //currentDate: $now,
            //disabledDays: [],
            date: true,
            time: true,
            monthPicker: false,
            year: true,
            clearButton: false,
            nowButton: false,
            switchOnClick: true,
            //cancelText: 'Cancel',
            //okText: 'VALIDER',
            //clearText: 'EFFACER',
            //nowText: 'MAINTENANT',
            //triggerEvent: 'focus',
            //lang: 'en',
            //weekStart: 1,
        });
    });

    $('.dt').james({
        format: 'DD/MM/YYYY',
        shortTime: true,
        clearButton: false,
        nowButton: false,
        date: true,
        time: false,
        maxDate: moment(),

        nowText: 'maintenant',
        lang: 'fr',
        weekStart: 1,
    });


    $(".dtj").james({
        format: 'DD/MM/YYYY HH:mm',
        shortTime: true,
        clearButton: false,
        nowButton: false,
        year: true,
        date: true,
        time: false,
        minDate: moment(),
        maxDate: moment(),
        cancelText: 'annuler',
        //okText: 'valider',
        //clearText: 'effacer',
        nowText: 'maintenant',
        lang: 'en',
        weekStart: 1,
    });

    $(".year").james({
        format: 'YYYY',
        shortTime: false,
        clearButton: false,
        nowButton: false,
        year: true,
        date: true,
        time: false,
        maxDate: moment(),
        cancelText: 'annuler',
        //okText: 'valider',
        //clearText: 'effacer',
        nowText: 'maintenant',
        lang: 'fr',
        weekStart: 1,
    });


    $('.dts').james({
        format: 'DD/MM/YYYY HH:mm',
        shortTime: false,
        clearButton: false,
        nowButton: false,
        date: false,
        cancelText: 'annuler',
        //okText: 'valider',
        //clearText: 'effacer',
        nowText: 'maintenant',
        lang: 'en',
        weekStart: 1,
    });

    $(".bts").james({
        format: 'DD/MM/YYYY HH:mm',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
        },
        shortTime: false,
        clearButton: false,
        nowButton: false,
        date: true,
        time: false,
        minDate: new Date(),
        cancelText: 'annuler',
        //okText: 'valider',
        //clearText: 'effacer',
        nowText: 'maintenant',
        lang: 'en',
        weekStart: 1,
    });

    $(".dh").james({
        format: 'DD/MM/YYYY HH:mm',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
        },
        shortTime: false,
        clearButton: false,
        //nowButton: true,
        date: true,
        time: true,
        //minDate : new Date(),
        cancelText: 'annuler',
        //okText: 'valider',
        //clearText: 'effacer',
        nowText: 'maintenant',
        lang: 'fr',
        weekStart: 1,
    });

});