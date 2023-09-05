$(document).ready(() => {
    document.getElementById("pageCourant").innerHTML = "Formulaire d'enregistrement d'incidence";
    const log = console.log;
    /* Constante pour le swal */
    const sw = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-outline-success btn-round",
            cancelButton: "btn btn-outline-danger btn-round",
        },
        buttonsStyling: false,
    });

    new Lightpick({
        field: document.getElementById('daterapport'),
        minDate: moment(),
        onSelect: function (date) {
            document.getElementById('daterapport').innerHTML =
                date.format(
                    "Do MMMM YYYY"
                );
        },
    });

    let state = {
        value: "new",
    };
    let liaison = (from, align) => {
        $.notify(
            {
                icon: "notifications_active",
                message: "<b>Remplir ou sélectionner tous les champs!</b>",
            },
            {
                type: "danger",
                timer: 1000,
                animate: {
                    enter: "animated rollIn",
                    exit: "animated rollOut",
                },
                placement: {
                    from: from,
                    align: align,
                },
            }
        );
    };
    let getData = () => {
        switch (state.value) {
            case "new":
                let data = {
                    filiere_id: $("#filiere_id").val(),
                    resumerapport: $("#resumerapport").val(),
                    grade_id: $("#grade_id").val(),
                    objetrapport: $("#objetrapport").val(),
                    daterapport: $("#daterapport").val(),
                    livre_id: $("#livre_id").val(),
                    nometu: $("#nometu").val(),
                };
                // log(data);
                return data;

            case "edit":
                let dts = {
                    idIncident: $("#idr").text(),
                    filiere_id: $("#filiere_id").val(),
                    grade_id: $("#grade_id").val(),
                    livre_id: $("#livre_id").val(),
                    objetrapport: $("#objetrapport").val(),
                    nometu: $("#nometu").val(),
                    daterapport: $("#daterapport").val(),
                    resumerapport: $("#resumerapport").val(),
                };
              //  log(dts);
                return dts;

            default:
                break;
        }
    };

    let sendInDb = (e) => {
        e = getData();
        //log(e);
        $.ajax({
            type: "POST",
            url: "/adincidence/" + e.filiere_id + "/" + e.grade_id + "/" + e.livre_id,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(e),
            success: (r) => {
                if (r) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Incident rapporté avec succès !",
                        showConfirmButton: false,
                        timer: 1500,
                        onOpen: () => {
                            const sound = new Audio("/sound/ok.ogg");
                            sound.play();
                        },
                    }).then(() => {
                        window.location.href = "/listedestincidences";
                    });
                }
            },
        });
    };
    let deleteIncid = (i) => {
        sw.fire({
            title: "Êtes-vous certain(e)?",
            text: "Cette action est irréversible!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Supprimer",
            cancelButtonText: "Annuler",
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: "GET",
                    url: "/deleteincidence/" + i,
                    success: (r) => {
                        if (r) {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Incident supprimé avec succès!!",
                                showConfirmButton: false,
                                timer: 1500,
                                backdrop: true,
                                onOpen: () => {
                                const sound = new Audio("/sound/ok.ogg");
                                sound.play();
                            },
                            }).then(() => {
                                window.location.href = window.location.href;
                            });
                        } else {
                            showNotification();
                        }
                    },
                    error: (e) => {
                        log(e);
                    },
                });
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                sw.fire("Annuler", "Opération annulée!", "error");
            }
        });
    };
    let updateInc = (r) => {
        $.ajax({
            type: "GET",
            url: "/updateincidence/" + r,
            success: (r) => {
                bootstrap(r);
            },
        });
    };
    let goEdit = () => {
        state.value = "edit";
    };

    let bootstrap = (t) => {
        $("#idr").text(t.idIncident);
        $("#resumerapport").val(t.resumerapport);
        $("#objetrapport").val(t.objetrapport);
        $("#daterapport").val(t.daterapport);
        $("#nometu").val(t.nometu);
        $("#livre_id").val(t.livre.id_Livre);
        $("#filiere_id").val(t.filiere.idFiliere);
        $("#grade_id").val(t.grade.idGrade);

        goEdit();
    };

    $("#rp").on('click', (e) => {
        e.preventDefault();
        if (
            getData().objetrapport === "" ||
            getData().daterapport === "" ||
            getData().rapport === ""

        ) {
            liaison();
        } else if (
            getData().filiere_id === null ||
            getData().grade_id === null ||
            getData().nometu === "" ||
            getData().livre_id === null
        ) {
            liaison();
        } else {
            // getData();
            sendInDb();
        }
        //log(getData());
    });

    $(".delInc").on('click', (e) => {
        e.preventDefault();
        let c = e.target.id;
        deleteIncid(c);
    });

    $(".updIn").click((e) => {
        e.preventDefault();
        let c = e.currentTarget.title;
        //log(c);
      	updateInc(c);
    });
    $("#myTable").DataTable({saveState :true});
});
