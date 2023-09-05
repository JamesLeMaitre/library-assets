$(document).ready(function () {
    const log = console.log;

    document.getElementById("pageCourant").innerHTML = "Liste des livres ";


    const sw = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-outline-success btn-round",
            cancelButton: "btn btn-outline-danger btn-round",
        },
        buttonsStyling: false,
    });

    $(() => {
        $("#id_nature").change(function (e) {
            $(".s").hide();
            id_nature = $("#id_nature").val();
            let v = e.target.nextSibling.title;
            log(v);

            /* log(id_nature); */
            if (v === "MÉMOIRES") {
                log($(this));

                $(".s").show();
                /*$("#" + $(this).val()).show();
                    $("." + $(this).val()).show();*/
            } else {
            }
        });
    });

        let state = {
            value: "new",
        };

       let getData = () => {
            switch (state.value) {
                case "new":
                    let dt = {
                        annee_soutenance: $("#annee_soutenance").val(),
                        auteur: $("#auteur").val(),
                        prenom: $("#prenom").val(),
                        date_arrivee: $("#date_arrivee").val(),
                        directeur_memoire: $("#directeur_memoire").val(),
                        quantite: $("#quantite").val(),

                        referencement: $("#referencement").val(),
                        theme: $("#theme").val(),
                        id_filiere: $("#id_filiere").val(),
                        id_nature: $("#id_nature").val(),
                        id_grade: $("#id_grade").val(),
                        nomatricule: $("#nomatricule").val(),
                        statebook: $("#statebook").val(),
                        rayon_id: $("#rayon_id").val(),
                    };
                    return dt;

                // log(datas);
                //  return datas;

                case "edit":
                    let dats = {
                        id_Livre: $("#idl").text(),
                        annee_soutenance: $("#annee_soutenance").val(),
                        auteur: $("#auteur").val(),
                        prenom: $("#prenom").val(),
                        date_arrivee: $("#date_arrivee").val(),
                        directeur_memoire: $("#directeur_memoire").val(),
                        quantite: $("#quantite").val(),
                        referencement: $("#referencement").val(),
                        theme: $("#theme").val(),
                        id_filiere: $("#id_filiere").val(),

                        id_nature: $("#id_nature").val(),
                        id_grade: $("#id_grade").val(),
                        rayon_id: $("#rayon_id").val(),
                        nomatricule: $("#nomatricule").val(),
                        statebook: $("#statebook").val(),
                    };
                    // log(dats);
                    return dats;
                default:
                    break;
            }
        };

     let   nbrePositif = (from, align) => {
            $.notify(
                {
                    icon: "info",
                    message: "<b>La quantité doit etre positif</b>",
                },
                {
                    type: "danger",
                    timer: 2500,
                    placement: {
                        from: from,
                        align: align,
                    },
                }
            );
        };

       let champVide = (from, align) => {
            $("#book").modal("hide");
            $.notify(
                {
                    icon: "add_alert",
                    message: "<b>Veuillez remplir tous les champs!!</b>",
                },
                {
                    type: "warning",
                    timer: 1500,
                    animate: {
                        enter: "animated bounceInDown",
                        exit: "animated bounceOutUp",
                    },
                    placement: {
                        from: from,
                        align: align,
                    },
                }
            );
        };

       let saveInDB = (g) => {
            g = getData();
            log(g);
            $.ajax({
                type: "POST",
                url:
                    "/addBook/" +
                    g.id_filiere +
                    "/" +
                    g.id_grade +
                    "/" +
                    g.id_nature +
                    "/" +
                    g.rayon_id,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(g),
                success: (r) => {
                    if (r) {
                        Swal.fire({
                            position: "top-end",
                            toast: true,
                            icon: "success",
                            title: "Livre enregistré avec succès !",
                            showConfirmButton: false,
                            timer: 1500,
                            onOpen: () => {
                                const sound = new Audio("/sound/ok.ogg");
                                sound.play();
                            },
                        }).then(() => {
                            window.location.href = window.location.href;
                        });
                    }
                },
                error: (e) => {
                    log(e);
                },
            });
        };
        let onOpenInfo = () => {
            const sound = new Audio("/sound/base.ogg");
            sound.play();
        };
        let onOpenDelete = () => {
            const sound = new Audio("/sound/ko.wav");
            sound.play();
        };
       let onOpenAbort = () => {
            const sound = new Audio("/sound/ab.ogg");
            sound.play();
        };
       let supLivre = (i) => {
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
                        url: "/deleteBook/" + i,
                        success: (p) => {
                            if (p) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Livre supprimé avec succès!!",
                                    toast: true,
                                    showConfirmButton: false,
                                    timer: 1500,
                                    position: "top-end",
                                   
                                }).then(() => {
                                    window.location.href = window.location.href;
                                });
                            } else {
                                liaison();
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
                    sw.fire({
                        icon: "error",
                        title: "Suppression annulée !",
                        showCancelButton: false,
                        onOpen: onOpenAbort(),
                    });
                }
            });
        };

       let updateSatutBook = (p) => {
            sw.fire({
                title: "Disponibilité",
                text: "Voulez-vous rendre disponible ou non cette livre ?",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Valider",
                cancelButtonText: "Annuler",
                reverseButtons: true,
                onOpen: onOpenInfo(),
            }).then((result) => {
                if (result.value) {
                    $.ajax({
                        type: "GET",
                        url: "/updateStatut/" + p,
                        success: (p) => {
                            if (p) {
                                var notify = $.notify(
                                    "<strong>Processus</strong> en cours...",
                                    {
                                        allow_dismiss: false,
                                        showProgressbar: false,
                                    }
                                );

                                setTimeout(() => {
                                    notify.update({
                                        type: "warning",
                                        message:
                                            "<strong>Opération </strong> effectuée avec succès !",
                                        progress: 75,
                                    });
                                }, 4500);
                                setTimeout(() => {
                                    window.location.href = window.location.href;
                                }, 6500);
                            } else {
                                liaison();
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
                    sw.fire({
                        icon: "warning",
                        title: "Disponibilité non validée !",
                        showCancelButton: false,
                        onOpen: onOpenAbort(),
                    });
                }
            });
        };
      let  goBack = () => {
            state.value = "new";
        };

      let  goEdit = () => {
            state.value = "edit";
        };

        function injector(t) {
            $("#idl").text(t.id_Livre);
            $("#annee_soutenance").val(t.annee_soutenance);
            $("#auteur").val(t.auteur);
            $("#prenom").val(t.prenom);
            $("#rayons").val(t.rayons);
            $("#date_arrivee").val(t.date_arrivee);
            $("#directeur_memoire").val(t.directeur_memoire);
            $("#quantite").val(t.quantite);
            $("#referencement").val(t.referencement);
            $("#theme").val(t.theme);
            $("#nomatricule").val(t.nomatricule);
            $("#id_filiere").val(t.filiere.idFiliere);
            $("#id_nature").val(t.nature.idNature);
            $("#id_grade").val(t.grade.idGrade);
            $("#rayon_id").val(t.rayon.idRayon);
            goEdit();
        }

       let updateLivre = (k) => {
            $.ajax({
                type: "GET",
                url: "/updatebook/" + k,
                success: (r) => {
                        injector(r);
                },
                error: (e) => {
                    log("error", e);
                },
            });
        };
       let modalh = () => {
            let valeur = $("#book").modal("hide");
            return valeur;
        };

        $(".adLivre").click((e) => {
            e.preventDefault();

            if (
                getData().auteur === "" ||
                getData().nomatricule === "" ||
                getData().date_arrivee === "" ||
                getData().theme === "" ||
                getData().referencement === "" ||
                getData().rayon_id === null
            ) {
            champVide();
                // window.location.href = window.location.href;
            } else if (getData().quantite < 0 || getData().quantite === "") {
                nbrePositif();
                // window.location.href = window.location.href;
            } else {
               // log(getData());
                saveInDB();

            }

        });

        $(".delBook").click(function (e) {
            e.preventDefault();
            let fg = $(this).attr("title");
            supLivre(fg);
        });

        $(".editBook").click(function (e) {
            e.preventDefault();
            let gh = $(this).attr("title");
            log(gh);
            updateLivre(gh);
        });
        $(".info").click(function (e) {
            e.preventDefault();
            let f = $(this).attr("title");
            injector(f);
        });
        $(".statutB").click((e) => {
            e.preventDefault();
            let g = e.currentTarget.title;
            // log(g);
            updateSatutBook(g);
        });

        $("#annee_soutenance").datetimepicker({
            format: "MM/YYYY",
            toolbarPlacement: "bottom",
            showTodayButton: true,
            showClose: true,
            viewDate: false,
        });
        //$("#annee_soutenance").datetimepicker.setLocale('fr');

        $("#row-details").DataTable();

        $("#date_arrivee").james({
            format: "DD/MM/YYYY",
            shortTime: true,
            clearButton: false,
            nowButton: false,
            date: true,
            time: false,
            maxDate: moment(),
            nowText: "maintenant",
            lang: "fr",
            weekStart: 1,
        });
   
});
