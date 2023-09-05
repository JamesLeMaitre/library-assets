$(document).ready(function () {
    
    document.getElementById("pageCourant").innerHTML = "Formulaire d'ajout de livre numérique ";
    const log = console.log;
    const sw = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-outline-success btn-round",
            cancelButton: "btn btn-outline-danger btn-round"
        },
        buttonsStyling: false
    });

    new Lightpick({
    minDate: moment(),
        field: document.getElementById("datejour"),
        onSelect: function (date) {
            document.getElementById("datejour").innerHTML = date.format(
                "Do MMMM YYYY"
            );
        },
    });


    champVide = (from, align) => {
        $("#book").modal("hide");
        $.notify({
            icon: "add_alert",
            message: "<b>Veuillez remplir tous les champs !</b>"
        }, {
            type: "danger",
            timer: 1500,
            animate: {
                enter: 'animated bounceIn',
                exit: 'animated bounceOut'
            },
            placement: {
                from: from,
                align: align
            }
        });
    };

    let state = {
        value: "new"
    };

    function getInfo() {
        switch (state.value) {
            case "new":
                let data = {
                    nomatricule: $("#nomatricule").val(),
                    auteur: $("#auteur").val(),
                    id_grade: $("#id_grade").val(),
                    chacces: $("#chacces").val(),
                    id_filiere: $("#id_filiere").val(),
                    id_categorie: $("#id_categorie").val(),
                    datejour: $("#datejour").val()
                };
                // log(data);
                return data;
            case "edit":
                let daa = {
                    idNumerique: $("#idN").text(),
                    nomatricule: $("#nomatricule").val(),
                    auteur: $("#auteur").val(),
                    id_grade: $("#id_grade").val(),
                    id_filiere: $("#id_filiere").val(),
                    id_categorie: $("#id_categorie").val(),
                    chacces: $("#chacces").val(),
                    datejour: $("#datejour").val()
                };
                // log(daa);
                return daa;

            default:
                break;
        }
    }

    function pushInDB(z) {
        z = getInfo();
        $.ajax({
            type: "POST",
            url: "/addNumerique/" + z.id_grade + "/" + z.id_filiere + "/" + z.id_categorie,
            contentType: "application/json",
            dataType: "JSON",
            data: JSON.stringify(z),
            success: r => {
                if (r) {
                    Swal.fire({
                        position: "top-end",
                        toast: true,
                        icon: "success",
                        title: "Enregistrement effectué avec succès!!",
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
    }

    function goEdit() {
        state.value = "edit";
    }


    function deleteN(l) {
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
                    url: "/deleteNumerique/" + l,
                    success: r => {
                        if (r) {
                            Swal.fire({
                                position: "top",
                                toast: true,
                                icon: "success",
                                title: "Support numérique supprimée avec succès!!",
                                showConfirmButton: false,
                                timer: 1500,
                                backdrop: true,
                                onOpen: () => {
                                    const sound = new Audio('/sound/ko.wav')
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

    function injector(t) {
        $("#idN").text(t.idNumerique);
        $("#auteur").val(t.auteur);
        $("#chacces").val(t.chacces);
        $("#datejour").val(t.datejour);
        $("#nomatricule").val(t.nomatricule);
        $("#id_filiere").val(t.filiere.idFiliere);
        $("#id_grade").val(t.grade.idGrade);
        //	log($("#id_categorie").val(t.cnumerique.idCnumerique));
        $("#id_categorie").val(t.cnumerique.idCnumerique);
        goEdit();
    }

    function updateNum(i) {
        $.ajax({
            type: "GET",
            url: "/updateNumerique/" + i,
            success: r => {
                //	log(injector(r));
                injector(r);
            },
            error: e => {
                log(e);
            }
        });
    }

    $(".addNum").click(function (e) {
        e.preventDefault();
        if (
            getInfo().auteur === "" ||
            getInfo().datejour === "" ||
            getInfo().nomatricule === ""
        ) {
            champVide();
        } else if (
            getInfo().idCategorie === null ||
            getInfo().idFiliere === null ||
            getInfo().idGrade === null
        ) {
            champVide();
        } else {
            //	log(getInfo());
            pushInDB();
        }
    });

    $(".editNum").click(function (e) {
        e.preventDefault();
        let value = $(this).attr("title");
        //	log(value);

        updateNum(value);
    });
    $(".delNum").click(function (e) {
        e.preventDefault();
        let value = $(this).attr("isp");
        log(value);
        deleteN(value);
    });
    $("#myTable").DataTable( {
        stateSave: true
    } );
});