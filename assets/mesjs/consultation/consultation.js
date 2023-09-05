$(document).ready(function () {
    const log = console.log;

    const pg = "Formulaire d'enregistrement de consultation";
    document.getElementById("pageCourant").innerHTML = pg;
    $("#telephone").inputmask({
        mask: '(+228) 99 999 999',

        showMaskOnHover: false,
        showMaskOnFocus: false,

    });

    $(() => {
        $("form[name='consultationph']").validate({
            rules: {
                type_support: "required",
                id_book: "required",
                maison_edition: "required",
                annee_edition: "required",
                grade_id: "required",
                filiere_id: "required",
                nom: "required",
                prenom: "required",
                service: "required",
                telephone: "required",

                profession: "required",
                date_jour: "required",
                observation: "required",
                sexe: "required"

            },
            messages: {
                type_support: "Sélectionnez le type de support",
                id_book: "Sélectionnez le livre consulté",
                maison_edition: "Saisir la maison d'édition",
                annee_edition: "Saisir l'énnée d'édition",
                grade_id: "Sélectionnez le grade du consultant",
                filiere_id: "Sélectionnez la filière du consultant",
                nom: "Saisir le nom du consultant",
                prenom: "Saisir le prénom du consultant",
                service: "Saisir le service d'appartenance du consultant",
                telephone: "Saisir le numéro de téléphone",
                sexe: "Le sexe",
                profession: "Profession du consultant",
                date_jour: "Quel est la date d'aujourd'hui?",
                observation: "Votre point de vue !"
            },
            submitHandler: (form) => {
                form.submit();
            }
        })
    })

    /*---------------------Consultation physique---------------------------------*/

    function recupInfo() {
        var radios = document.getElementsByName('sexe');
        for (let i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                let sexeValue = radios[i].value;
                let data = {
                    type_support: $("#type_support").val(),
                    id_book: $("#id_book").val(),
                    maison_edition: $("#maison_edition").val(),
                    annee_edition: $("#annee_edition").val(),
                    grade_id: $("#grade_id").val(),
                    filiere_id: $("#filiere_id").val(),
                    nom: $("#nom").val(),
                    prenom: $("#prenom").val(),
                    service: $("#service").val(),
                    telephone: $("#telephone").val(),

                    profession: $("#profession").val(),
                    date_jour: $("#date_jour").val(),
                    observation: $("#observation").val(),
                    sexe: sexeValue

                };

                return data;
            }


        }


    }


    function pushInDB(l) {
        l = recupInfo();
        log(l);
        $.ajax({
            type: "POST",
            url: "/addConsultation/" + l.id_book + "/" + l.grade_id + "/" + l.filiere_id,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(l),
            success: r => {

                if (r) {
                    Swal.fire({
                        position: "top-right",
                        toast: true,
                        icon: "success",
                        title: "Consultation ajoutée avec succès!!",
                        showConfirmButton: false,
                        timer: 1500,
                        onOpen: () => {
                            const sound = new Audio('/sound/ok.ogg')
                            sound.play();
                        }
                    }).then(() => {
                        window.location.href = window.location.href;
                    });
                }
            },
            error: e => {
                log(e);
            }
        });
    }

    alertEmpty = () => {
        $.notify({
            'icon': 'error',
            'message': '<strong>Veuillez remplir tous les champs!</strong>',

        }, {
            'type': 'danger',
            animate: {
                enter: 'animated bounceIn',
                exit: 'animated bounceOut'
            }
        });
    }


    $(".addConsultation").click((e) => {
        e.preventDefault();
        if (recupInfo() === undefined) {
            alertEmpty();
        } else if (
            recupInfo().annee_edition === "" ||
            recupInfo().nom === "" ||
            recupInfo().prenom === "" ||
            recupInfo().date_jour === "" ||
            recupInfo().service === "" ||
            recupInfo().sexe === "" ||
            recupInfo().observation === "" ||
            recupInfo().type_support === "" ||
            recupInfo().profession === "" ||
            recupInfo().service === "" ||
            recupInfo().telephone === "") {
            alertEmpty();

        } else if (recupInfo().filiere_id === null ||
            recupInfo().grade_id === null ||
            recupInfo().numerique_id === null) {
            alertEmpty();
        } else {
            pushInDB();
        }

    });

    new Lightpick({
    minDate: moment(),
        field: document.getElementById("date_jour"),
        onSelect: function (date) {
            document.getElementById("date_jour").innerHTML = date.format(
                "Do MMMM YYYY"
            );
        },
    });

    /*-----------------------------------Consultation Numérique------------------*/

    function recupererData() {
        var radios = document.getElementsByName('sexe');
        for (let i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                let sexeValue = radios[i].value;
                let data = {
                    type_support: $("#type_support").val(),
                    numerique_id: $("#numerique_id").val(),

                    annee_edition: $("#annee_edition").val(),
                    grade_id: $("#grade_id").val(),
                    filiere_id: $("#filiere_id").val(),
                    nom: $("#nom").val(),
                    prenom: $("#prenom").val(),
                    service: $("#service").val(),
                    telephone: $("#telephone").val(),
                    sexe: $("#sexe").val(),
                    profession: $("#profession").val(),
                    date_jour: $("#date_jour").val(),
                    observation: $("#observation").val(),
                    sexe: sexeValue

                };

                return data;
            }


        }


    }

    sendInDB = s => {
        s = recupererData();
        $.ajax({
            type: "POST",
            url: "/addConsultationNumerique/" + s.numerique_id + "/" + s.grade_id + "/" + s.filiere_id,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(s),
            success: r => {

                if (r) {
                    Swal.fire({
                        position: "top-right",
                        toast: true,
                        icon: "success",
                        title: "Consultation ajoutée avec succès!!",
                        showConfirmButton: false,
                        timer: 1500,
                        onOpen: () => {
                            const sound = new Audio('/sound/ok.ogg')
                            sound.play();
                        }
                    }).then(() => {
                        window.location.href = window.location.href;
                    });
                }
            },
            error: e => {
                log(e);
            }
        });
    }


    $(".addConsultationNum").click((e) => {
        e.preventDefault();
        log(recupererData());
        if (recupererData() === undefined) {
            $.notify({
                'icon': 'error',
                'message': '<strong>Veuillez remplir tous les champs!</strong>',

            }, {
                'type': 'danger',
                animate: {
                    enter: 'animated bounceIn',
                    exit: 'animated bounceOut'
                }
            });
        } else if (
            recupererData().annee_edition === "" ||
            recupererData().nom === "" ||
            recupererData().prenom === "" ||
            recupererData().date_jour === "" ||
            recupererData().service === "" ||
            recupererData().sexe === "" ||
            recupererData().observation === "" ||
            recupererData().type_support === "" ||
            recupererData().profession === "" ||
            recupererData().service === "" ||
            recupererData().telephone === "") {
            $.notify({
                'icon': 'error',
                'message': '<strong>Veuillez remplir tous les champs!</strong>',
                'progress': 15
            }, {
                'type': 'danger',
                animate: {
                    enter: 'animated bounceIn',
                    exit: 'animated bounceOut'
                }
            });
        } else if (recupererData().filiere_id === null ||
            recupererData().grade_id === null ||
            recupererData().numerique_id === null) {
            $.notify({
                'icon': 'error',
                'message': '<strong>Veuillez remplir tous les champs!</strong>',
                'progress': 15
            }, {
                'type': 'danger',
                animate: {
                    enter: 'animated bounceIn',
                    exit: 'animated bounceOut'
                }
            });
        } else {
            sendInDB();
        }

    });
    $("#supC").click((e) => {
        e.preventDefault();
    })
});