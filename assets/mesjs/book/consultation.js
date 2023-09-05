$(document).ready(function () {
    const log = console.log;
    const sw = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success btn-round",
            cancelButton: "btn btn-danger btn-round"
        },
        buttonsStyling: false
    });

    // $("#consultationForm").validate({
    // rules: {
    // type_support: "required",
    // id_book: "required",
    // maison_edition: "required",
    // annee_edition: "required",
    // nom: "required",
    // prenom: "required",
    // service: "required",
    // telephone: "required",
    // sexe: "required",
    // date_jour: "required",
    // observation: "required"
    // },
    // messages: {
    // type_support: "Sélectionnez le type de support",
    // id_book: "Choisir le thème",
    // maison_edition: "Saisissez la maison d'édition",
    // annee_edition: "Veuillez choisir la maison d'édition",
    // nom: "Inserez le nom de l'étudiant",
    // prenom: "Inserez le prénom de l'étudiant",
    // service: "Ce champ est requis! ",
    // telephone: "Le telephone est important!",
    // sexe: "Le sexe de l'étudiant",
    // date_jour: "Quel est la date d'aujourdhui!",
    // observation: "Quel est ton point de vue!"
    // }
    // });

    function recupInfo() {
        let data = {
            nom: $("#nom").val(),
            prenom: $("#prenom").val(),
            annee_edition: $("#annee_edition").val(),
            /* auteur: $("#auteur").val(), */
            code: $("#code").val(),
            maison_edition: $("#maison_edition").val(),
            date_jour: $("#date_jour").val(),
            observation: $("#observation").val(),
            service: $("#service").val(),
            sexe: $("#sexe").val(),
            profession: $("#profession").val(),
            /* specialite: $("#specialite").val(), */
            telephone: $("#telephone").val(),
            /* titre_doc: $("#titre_doc"), */
            type_support: $("#type_support").val(),
            /* niveau: $("#niveau"), */
            id_book: $("#id_book").val(),
            grade_id: $("#grade_id").val(),
            filiere_id: $("#filiere_id").val()
        };

        return data;
    }


    function show(from, align) {
        $.notify(
            {
                icon: "add_alert",
                message: "Donnée enrégistrées avec succès!!"
            },
            {
                type: "success",
                timer: 72000,
                placement: {
                    from: from,
                    align: align
                }
            }
        );
    }

    function champTelephone(from, align) {
        $.notify(
            {
                icon: "add_alert",
                message: "Le téléphone doit etre 8 caractères et positif"
            },
            {
                type: "warning",
                timer: 1500,
                placement: {
                    from: from,
                    align: align
                }
            }
        );
    }

    function champDateJ(from, align) {
        $.notify(
            {
                icon: "add_alert",
                message: "La date jour est omise !!"
            },
            {
                type: "warning",
                timer: 1500,
                placement: {
                    from: from,
                    align: align
                }
            }
        );
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


    function deleteArchive(k) {
        $.ajax({
            type: "GET",
            url: "/supprimerConsul/" + k,
            success: r => {
                if (r) {
                    alert("45");
                    window.location.href = window.location.href;
                }
            },
            error: e => {
                log(e);
            }
        });
    }

    /* Script pour l'affichage des label */
    /*
     * $(function() { $("#type_support").change(function() { $(".1").hide();
     * $("#" + $(this).val()).show(); $(".ph").hide(); }); });
     */

    $("#consultation").click(function (e) {
        e.preventDefault();
        if (recupInfo().date_jour === "") {

            champDateJ();
        } else {
            pushInDB();
        }
    });
    $(".supC").click(function (e) {
        e.preventDefault();
        alert("45");
        //let c = $(this).attr("title");
        log("45");

    });

    $("#supC").click(function (e) {
        e.preventDefault();
        log("45");
    })
});
