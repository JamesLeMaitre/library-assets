$(document).ready(function () {
    const sw = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success btn-round",
            cancelButton: "btn btn-danger btn-round"
        },
        buttonsStyling: false
    });
    const log = console.log;
    let state = {
        value: "new"
    };

    recupData = () => {
        switch (state.value) {
            case "new":
                let ds = {
                    copie_etudiant: $("#copie_etudiant").val(),
                    copie_forma: $("#copie_forma").val(),
                    copie_ratee: $("#copie_ratee").val(),
                    date_jour: $("#date_jour").val(),
                    total_copies: somme()
                };
                return ds;
                break;

            case "edit":
                let fg = {
                    idPhotocopie: $("#idPhoto").text(),
                    copie_etudiant: $("#copie_etudiant").val(),
                    copie_forma: $("#copie_forma").val(),
                    copie_ratee: $("#copie_ratee").val(),
                    date_jour: $("#date_jour").val(),
                    total_copies: somme()
                };
                /*     log(fg); */
                return fg;


            default:
                break;
        }
    }
    pushInDB = f => {
        f = recupData();
        log(f);
        $.ajax({
            type: "POST",
            url: "/addPh",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(f),
            success: s => {
                if (s) {
                    Swal.fire({
                        position: "top-right",
                        toast: true,
                        icon: "success",
                        title: "OPÉRATION ENREGISTRÉE AVEC SUCCÈS !",
                        showConfirmButton: false,
                        timer: 1500,
                        onOpen: () => {
                            const sound = new Audio("/sound/ok.ogg");
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
    };

    somme = (x, y, z) => {
        let somme = 0;
        x = $("#copie_etudiant").val();
        y = $("#copie_forma").val();
        z = $("#copie_ratee").val();
        somme = parseInt(x) + parseInt(y) + parseInt(z);
        return somme;
    };


    function supPh(f) {
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
                    url: "/deletePh/" + f,
                    success: r => {
                        if (r) {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "OPÉRATION  supprimée avec succès!!",
                                showConfirmButton: false,
                                timer: 1500,
                                backdrop: true,
                                onOpen: () => {
                                    const sound = new Audio("/sound/ko.wav");
                                    sound.play();
                                }
                            }).then(() => {
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

    goBack = () => {
        state.value = "new";
    };
    goEdit = () => {
        state.value = "edit";
    };
    injector = p => {
        $("#idPhoto").text(p.idPhotocopie);
        $("#copie_etudiant").val(p.copie_etudiant);
        $("#copie_forma").val(p.copie_forma);
        $("#copie_ratee").val(p.copie_ratee);
        $("#total_copies").val(p.total_copies);
        $("#date_jour").val(p.date_jour);
        goEdit();
    };
    updatP = p => {
        $.ajax({
            type: "GET",
            url: "/updatePh/" + p,
            success: r => {
                injector(r);
            },
            error: e => {
                log(e);
            }
        });
    };

    function nbrePos(from, align) {
        $.notify(
            {
                icon: "add_alert",
                message: "<b>Veuillez saisir un nombre positif!</b>"
            },
            {
                type: "danger",
                timer: 1500,
                animate: {
                    enter: 'animated flipInY',
                    exit: 'animated flipOutX'
                },
                placement: {
                    from: from,
                    align: align
                }
            }
        );
    }

    $("#datatables").DataTable();
    $('#date_jour').datetimepicker({
        format: 'LL',
        // From Today
        minDate: moment(),
        // To 10 days
        maxDate: moment().add(0, 'days'),
        //format: 'MM/YYYY',
        toolbarPlacement: 'bottom',
        showTodayButton: true,
        showClose: true,

    });

    $("#adP").click(function (e) {
        e.preventDefault();
        somme();

        if (recupData().copie_etudiant < 0 || recupData().copie_etudiant == "") {
            nbrePos();
        } else if (recupData().copie_forma < 0 || recupData().copie_forma == "") {
            nbrePos();
        } else if (recupData().copie_ratee < 0 || recupData().copie_ratee == "") {
            nbrePos();
        } else {
            pushInDB();
        }
    });
    $(".editP").click(function (e) {
        e.preventDefault();
        let val = $(this).attr("title");
        updatP(val);
    });
    $(".delP").click(function (e) {
        e.preventDefault();
        let val = $(this).attr("title");
        supPh(val);
    });
});
