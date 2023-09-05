$(document).ready(() => {
    const pg = "Affichage de tous les sauvegardes";
    document.getElementById("pageCourant").innerHTML = pg;
    const sw = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-outline-success btn-round",
            cancelButton: "btn btn-outline-danger btn-round",
            background: "rgb(255, 255, 255)"
        },
        buttonsStyling: false
    });
    log = console.log
    $("#myTable").DataTable({ stateSave: true});
    $("#myTable1").DataTable({ stateSave: true});
    $("#myTable2").DataTable({ stateSave: true});
    $("#myTable3").DataTable({ stateSave: true});
    $("#myTable4").DataTable({ stateSave: true});

    $("#myTable7").DataTable({ stateSave: true});
    $("#myTable8").DataTable({ stateSave: true});

    $.getJSON("http://localhost:9000/api/livres", fill = (data) => {
       // log(data);
        let table = $('#myTable5').DataTable({
            "data": data,

            "scrollCollapse": true,
            "paging": true,

            "columns": [{
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": '',
                "render": function () {
                    return '<i class="fa fa-plus-square" aria-hidden="true"></i>';
                },
                width: "15px"
            },

                {
                    "data": "auteur"
                },

                {
                    "data": "nature.type_document"
                },
                {
                    "data": "grade.niveau"
                },
                {
                    "data": "filiere.acronyme"
                },
                {
                    "data": "quantite"
                },
                {
                    "data": "rayons.nomrayon"
                }

            ],
            "order": [
                [1, 'asc']
            ]

        });
        // Add event listener for opening and closing details
        $('#myTable5 tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var tdi = tr.find("i.fa");
            var row = table.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
                tdi.first().removeClass('fa-minus-square');
                tdi.first().addClass('fa-plus-square');
            } else {
                // Open this row
                row.child(format(row.data())).show();
                tr.addClass('shown');
                tdi.first().removeClass('fa-plus-square');
                tdi.first().addClass('fa-minus-square');
            }
        });

        table.on("user-select", function (e, dt, type, cell, originalEvent) {
            if ($(cell.node()).hasClass("details-control")) {
                e.preventDefault();
            }
        });

    })


    function format(jlm) {

        let value = jlm.nature.type_document;

        let trueFunc = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td>N° Matricule:</td>' +
            '<td>' + jlm.nomatricule + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Prénoms:</td>' +
            '<td>' + jlm.prenom + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Directeur Mémoire:</td>' +
            '<td>' + jlm.directeur_memoire + '</td>' +
            '</tr>' +
            '<tr>' +
            '<tr>' +
            '<td>Année de soutenance:</td>' +
            '<td>' + jlm.annee_soutenance + '</td>' +
            '</tr>' +
            '<tr>' +
            '<tr>' +
            "<td>Date d'arrivée:</td>" +
            '<td>' + jlm.date_arrivee + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Thème:</td>' +
            '<td>' + jlm.theme + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Réferencement:</td>' +
            '<td>' + jlm.referencement + '</td>' +
            '</tr>' +

            '</table>';
        ;
        let falseFunc = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td>N° Matricule:</td>' +
            '<td>' + jlm.nomatricule + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Prénoms:</td>' +
            '<td>' + jlm.prenom + '</td>' +
            '</tr>' +

            '<tr>' +
            '<tr>' +
            "<td>Date d'arrivée:</td>" +
            '<td>' + jlm.date_arrivee + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Thème:</td>' +
            '<td>' + jlm.theme + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Réferencement:</td>' +
            '<td>' + jlm.referencement + '</td>' +
            '</tr>' +

            '</table>';
        return (value === "MÉMOIRE" ? trueFunc : falseFunc);


        // `d` is the original data object for the row

    }

    function alertInfo(from, align) {
        $.notify({
            icon: "add_alert",
            message: "Le téléphone doit etre 8 caractères et positif"
        }, {
            type: "warning",
            timer: 1500,
            placement: {
                from: from,
                align: align
            }
        });
    }


    let deleteConsultationPhysique = (id) => {
        sw.fire({
            title: "Etes-vous sûr(e)?",
            text: "Cette action est irréversible !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Supprimer",
            cancelButtonText: "Annuler",
            reverseButtons: true
        }).then(result => {
            if (result.value) {
                $.ajax({
                    type: "GET",
                    url: "/supprimerConsul/" + id,
                    success: r => {
                        if (r) {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Consnultation Physique supprimée avec succès!!",
                                showConfirmButton: false,
                                timer: 1500,
                                backdrop: true,
                                onOpen: () => {
                                    const sound = new Audio('/sound/ko.wav')
                                    sound.play();
                                }
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
    };

    $("#supC").click(function (e) {
        e.preventDefault();
        let v = e.currentTarget.title;
        log(v);
        deleteConsultationPhysique(v);
    });
    /***********************************************Consultation Numérique******************************/


    deleteArchiveNum = (id) => {
        sw.fire({
            title: "Etes-vous sûr(e)?",
            text: "Cette action est irréversible!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Supprimer",
            cancelButtonText: "Annuler",
            onOpen: () => {
                const sound = new Audio('/sound/ok.wav')
                sound.play();
            },
            reverseButtons: true,

        }).then(result => {
            if (result.value) {
                $.ajax({
                    type: "GET",
                    url: "/supprimerConsulNum/" + id,
                    success: r => {
                        if (r) {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Consnultation Physique supprimée avec succès!!",
                                showConfirmButton: false,
                                timer: 1500,
                                backdrop: true,
                                onOpen: () => {
                                    const sound = new Audio('/sound/ko.wav')
                                    sound.play();
                                },

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
    };

    $("#suppNum").click(function (e) {
        e.preventDefault();
        let v = $(this).attr("title");

        deleteArchiveNum(v);
    })

})