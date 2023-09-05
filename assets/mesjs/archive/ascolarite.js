$(document).ready(function () {

    document.getElementById("pageCourant").innerHTML = "Formulaire d'enregistrement ";
    /* Constante pour le swal */
    const sw = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-outline-success btn-round",
            cancelButton: "btn btn-outline-danger btn-round"
        },
        buttonsStyling: false
    });
    const log = console.log;
    let state = {
        value: "new"
    };

    function recupData() {
        switch (state.value) {
            case "new":
                let data = {

                    emplacement: $("#emplacement").val(),
                    nomarchive: $("#nomarchive").val(),
                    contenu: $("#contenu").val(),
                    datejour: $("#datejour").val()
                };

                return data;

            case "edit":
                let dat = {
                    idAScolarite: $("#ID").text(),

                    emplacement: $("#emplacement").val(),
                    nomarchive: $("#nomarchive").val(),
                    contenu: $("#contenu").val(),
                    datejour: $("#datejour").val()
                };

                return dat;
            default:
                break;
        }
    }

    let pushInDB = r => {
        r = recupData();

        $.ajax({
            type: "POST",
            url: "/addAScolarite",
            contentType: "application/json",
            dataType: "JSON",
            data: JSON.stringify(r),
            success: s => {
                if (s) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "ARCHIVE ENREGISTRÉE AVEC SUCCÈS!!",
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

    /*
     * function putInDB(){ $.ajax({ type: "POST", url: "/addArchive/"+
     * r.idService, dataType: "JSON", data: new FormData(this), contentType:
     * false, cache: false, processData: false, success: function(data){
     *  } }); }
     */
    function deleteArchive(k) {
        sw.fire({
            title: "Êtes-vous certain(e)?",
            text: "Cette action est irréversible!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Supprimer",
            cancelButtonText: "Annuler",
            onOpen: () => {
                const sound = new Audio("/sound/ok.wav");
                sound.play();
            },
            reverseButtons: true
        }).then(result => {
            if (result.value) {
                $.ajax({
                    type: "GET",
                    url: "/deleteAScolarite/" + k,
                    success: r => {
                        if (r) {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Archive supprimée avec succès!!",
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
                sw.fire("J'AI COMPRIS!", "VEUILLEZ REMPLIR TOUS LES CHAMPS!!!", "error");
            }
        });
    }

    function goEdit() {
        state.value = "edit";
    }

    let injector = r => {
        $("#ID").text(r.idAScolarite);
        $("#emplacement").val(r.emplacement);
        $("#datejour").val(r.datejour);
        $("#contenu").val(r.contenu);
        $("#nomarchive").val(r.nomarchive);

        goEdit();
    };

    function updateArchive(k) {
        $.ajax({
            type: "GET",
            url: "/updateAScolarite/" + k,
            success: r => {
                injector(r);
            },
            error: e => {
                log(e);
            }
        });
    }

    $(".adAr").click((e) => {
        e.preventDefault();
        if (
            recupData().nomarchive === "" ||
            recupData().emplacement === "" ||
            recupData().datejour === "" ||
            recupData().contenu === ""
        ) {
            sw.fire("J'AI COMPRIS!", "VEUILLEZ REMPLIR TOUS LES CHAMPS!!!", "error");
        } else {
            pushInDB();
        }
    });
    $(".delA").click(function (e) {
        e.preventDefault();
        let value = $(this).attr("title");
        deleteArchive(value);
    });
    $(".editArB").click(function (e) {
        e.preventDefault();
        let value = $(this).attr("title");

        updateArchive(value);
    });
    $("#mTable").DataTable();
    new Lightpick({
        field: document.getElementById("datejour"),
        minDate: moment(),
        onSelect: function (date) {
            document.getElementById("datejour").innerHTML = date.format(
                "Do MMMM YYYY"
            );
        },
    });
});
