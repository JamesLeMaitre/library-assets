$(document).ready(function () {
    const pg = "Gestion du papier : Photocopies & Impressions";
    document.getElementById("pageCourant").innerHTML = pg;
    const log = console.log;
    const sw = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success btn-round",
            cancelButton: "btn btn-danger btn-round"
        },
        buttonsStyling: false
    });
    let state = {
        value: "new"
    };

    function recupinfo() {
        const D = new Date();
        let date_en = D.getFullYear() + '-' + (D.getMonth() + 1) + '-' + D.getDate();
        switch (state.value) {
            case "new":
                let dt = {
                    niveau: $("#niveau").val(),
                    designation: $("#designation").val(),
                    nbre_copie: $("#nbre_copie").val(),
                    observation: $("#observation").val(),
                    date_jour: date_en,
                };
                return dt;

            case "edit":
                let dat = {
                    idImpression: $("#idF").text(),
                    niveau: $("#niveau").val(),
                    designation: $("#designation").val(),
                    nbre_copie: $("#nbre_copie").val(),
                    observation: $("#observation").val(),
                    date_jour: date_en,
                };
                return dat;
                break;

            default:
                break;
        }
    }

    $("#dataT").DataTable();

    function addIm(i) {
        i = recupinfo();
        log(i);
        $.ajax({
            type: "POST",
            url: "/addImpression",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(i),
            success: r => {
                if (r) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "OPÉRATION AJOUTÉE AVEC SUCCÉS !!",
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

    function showNotification(from, align) {
        $.notify(
            {
                icon: "add_alert",
                message: "Donnée enrégistrées avec succès!!"
            },
            {
                type: "danger",
                timer: 10000,
                placement: {
                    from: from,
                    align: align
                }
            }
        );
    }

    function paVide(from, align) {
        $.notify(
            {
                icon: "add_alert",
                message: "Saisir tous les champs!"
            },
            {
                type: "danger",
                timer: 1500,
                placement: {
                    from: from,
                    align: align
                }
            }
        );
    }

    function nbrePos(from, align) {
        $.notify(
            {
                icon: "add_alert",
                message: "Saisir un nombre positif!"
            },
            {
                type: "danger",
                timer: 1500,
                placement: {
                    from: from,
                    align: align
                }
            }
        );
    }

    function deleteNotif(from, align) {
        $.notify(
            {
                icon: "add_alert",
                message: "Donnée supprimée avec succès!!"
            },
            {
                type: "danger",
                timer: 10000,
                placement: {
                    from: from,
                    align: align
                }
            }
        );
    }

    function supIm(o) {
        sw.fire({
            title: "Etes-vous sùr?",
            text: "Cette action est irréversible!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Supprimer",
            cancelButtonText: "Ignorer",
            reverseButtons: true
        }).then(result => {
            if (result.value) {
                $.ajax({
                    type: "GET",
                    url: "/deleteImp/" + o,
                    success: r => {
                        if (r) {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Opération supprimée avec succès!!",
                                showConfirmButton: false,
                                timer: 1500,
                                backdrop: true
                            }).then(result => {
                                window.location.href = window.location.href;
                            });
                        } else {
                            showNotification();
                        }
                    },
                    error: e => {
                        log(e);
                    }
                });
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                sw.fire("Annuler", "Suppression annulée!", "error");
            }
        });
    }

    function goBack() {
        state.value = "new";
    }

    function goEdit() {
        state.value = "edit";
    }

    function injector(i) {
        $("#idF").text(i.idImpression);
        $("#niveau").val(i.niveau);
        $("#nbre_copie").val(i.nbre_copie);
        $("#designation").val(i.designation);
        $("#observation").val(i.observation);
        goEdit();
    }

    function misajourImp(g) {
        $.ajax({
            type: "GET",
            url: "/updateImpression/" + g,
            success: r => {
                if (r) {
                    injector(r);
                }
            },
            error: r => {
                log(r);
            }
        });
    }

    $("#adImp").click(function (e) {
        e.preventDefault();
        // log(recupinfo().nbre_copie);
        if (recupinfo().nbre_copie < 0) {
            nbrePos();
        } else if (
            recupinfo().designation === "" ||
            recupinfo().observation === ""
        ) {
            paVide();
        } else {
            addIm();
        }
    });
    $(".delImp").click(function (e) {
        e.preventDefault();
        let b = $(this).attr("title");
        supIm(b);
    });
    $(".editImp").click(function (e) {
        e.preventDefault();
        let b = $(this).attr("title");
        misajourImp(b);
    });
});
