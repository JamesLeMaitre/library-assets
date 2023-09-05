$(document).ready(function () {
  document.getElementById("pageCourant").innerHTML =
    "Formulaire d'ajout de catégorie numérique ";
  const log = console.log;
  const sw = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success btn-round",
      cancelButton: "btn btn-danger btn-round",
    },
    buttonsStyling: false,
  });
  let state = {
    value: "new",
  };

  function getData() {
    switch (state.value) {
      case "new":
        let data = {
          categorie: $("#categorie").val(),
        };

        return data;

      case "edit":
        let datas = {
          idCnumerique: $("#monId").text(),
          categorie: $("#categorie").val(),
        };
        // log(datas);
        return datas;
      default:
        break;
    }
  }

  info = (from, align) => {
    $.notify(
      {
        icon: "add_alert",
        message: "<b>Veuillez renseigner le champ catégorie !!</b>",
      },
      {
        type: "danger",
        timer: 10,
        placement: {
          from: from,
          align: align,
        },
      }
    );
  };

  function pushInDB(e) {
    e = getData();

    $.ajax({
      type: "POST",
      url: "/ajouterCategorie",
      contentType: "application/json",
      dataType: "JSON",
      data: JSON.stringify(e),
      success: (r) => {
        if (r) {
          Swal.fire({
            position: "center",

            icon: "success",
            title: "Catégorie ajoutée avec succès !",
            showConfirmButton: false,
            timer: 1500,
            onOpen: () => {
              const sound = new Audio("/sound/ok.ogg");
              sound.play();
            },
          }).then((result) => {
            window.location.href = window.location.href;
          });
        }
      },
      error: (e) => {
        log(e);
      },
    });
  }

  function delCatogorie(i) {
    sw.fire({
      title: "Etes-vous sùr?",
      text: "Cette action est irréversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      cancelButtonText: "Ignorer",
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        $.ajax({
          type: "GET",
          url: "/deleteCategorie/" + i,
          success: (r) => {
            if (r) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "<b>Catégorie supprimée avec succès!!</b>",
                showConfirmButton: false,
                timer: 1500,
                backdrop: true,
                onOpen: () => {
                  const sound = new Audio("/sound/ko.ogg");
                  sound.play();
                },
              }).then((result) => {
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
        sw.fire("Annuler", "Suppression annulée!", "error");
      }
    });
  }

  function goEdit() {
    state.value = "edit";
  }

  function Injector(i) {
    $("#categorie").val(i.categorie);
    $("#monId").text(i.idCnumerique);
    goEdit();
  }

  function updateInsCatogorie(k) {
    $.ajax({
      type: "GET",
      url: "/updateCategorie/" + k,
      success: (r) => {
        Injector(r);
      },
      error: (e) => {
        log(e);
      },
    });
  }

  $(".addCategorie").click(function (e) {
    e.preventDefault();
    if (getData().categorie == '') {
    
      info();
    } else {
    //log(getData().categorie);
      
     pushInDB();
    }
  });

  $(".delCategorie").click((e) => {
    e.preventDefault();
    let valeur = e.delegateTarget.attributes.titre.nodeValue;
    // log(valeur);
    delCatogorie(valeur);
  });
  $(".editCategorie").click((e) => {
    e.preventDefault();
    let value = e.delegateTarget.attributes.titre.nodeValue;
    //log(value);
    updateInsCatogorie(value);
  });
});
