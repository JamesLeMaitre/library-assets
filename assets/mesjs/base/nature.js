$(document).ready(function () {

    const log = console.log;
    const sw = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success btn-round",
            cancelButton: "btn btn-danger btn-round"
        },
        buttonsStyling: false
    });

    /* La variable de changement d'etat */
    let state = {
        value: "new"
    };
    /* Functions permettant l'édition */
    goEdit = () => {
        state.value = "edit";
    };

    goBack = () => {
        state.value = "new";
    };

    jailesDonne = () => {
        switch (state.value) {
            case "new":
                let dn = {
                    type_document: $("#type_document").val()
                };
                return dn;

            case "edit":
                let dk = {
                    idNature: $("#mID").text(),
                    type_document: $("#type_document").val()
                };
                return dk;
            default:
                break;
        }
    };

    bootstraping = b => {
        $("#mID").text(b.idNature),
            $("#type_document").val(b.type_document),
            goEdit();
    };

    jenvoiDansLaBase = j => {
        j = jailesDonne();
        $.ajax({
            type: "POST",
            url: "/addNature",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(j),
            success: s => {
                if (s) {
                    Swal.fire({
                      	position: "top-right",
						toast: true,
                        icon: "success",
                        title: "Nature enregistrée avec succès !",
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

    updateNat = n => {
        $.ajax({
            type: "GET",
            url: "/updateNature/" + n,
            success: r => {
                bootstraping(r);
            },
            error: e => {
                log(e);
            }
        });
    };


    champVide = (from, align) => {
        $.notify(
            {
                icon: "add_alert",
                message: "<b>Veuillez sélectionner le type de document!!</b>"
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
    };

    deleteNat = l => {
        sw.fire({
            title: "Êtes-vous certain(e)?",
            text: "Cette action est irréversible!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Supprimer",
            cancelButtonText: "Annuler",
            reverseButtons: true
        }).then(result => {
            if (result.value) {
                $.ajax({
                    type: "GET",
                    url: "/deleteNature/" + l,
                    success: r => {
                        if (r) {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Nature de document supprimé avec succès!!",
                                showConfirmButton: false,
                                timer: 1500,
                                onOpen: () => {
                                    const sound = new Audio("/sound/ok.wav");
                                    sound.play();
                                }
                            }).then(() => {
                                window.location.href = window.location.href;
                            });
                        } else {
                            liaison();
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
    };
    $("#adNature").click(function (e) {
        e.preventDefault();
        if (jailesDonne().type_document === "") {
            champVide();
        } else {
            // log(jailesDonne().type_document);
            jenvoiDansLaBase();
        }
    });
    $("#mTable").DataTable();
    $(".delN").click(function (e) {
        e.preventDefault();
        let b = $(this).attr("title");
        deleteNat(b);
    });
    $(".editN").click(function (e) {
        e.preventDefault();
        let n = $(this).attr("title");
        updateNat(n);
    });

    


});
