$(document).ready(function () {
  const log = console.log;
  const pg =
    "Formulaire d'enregistrement de Grade | Spécialité | Rayons | Nature document";
  document.getElementById("pageCourant").innerHTML = pg;

  /* Constante pour le swal */
  const sw = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-outline-success btn-round",
      cancelButton: "btn btn-outline-danger btn-round",
      background: "rgb(255, 255, 255)",
    },
    buttonsStyling: false,
  });

  let state = {
    value: "new",
  };

  function receiveData() {
    if (state.value !== "new") {
      if (state.value === "edit") {
        let datas;
        datas = {
          idFiliere: +$("#idF").text(),
          filiere: $("#filiere").val(),
          acronyme: $("#acronyme").val(),
        };
        log(datas);
        return datas;
      }
    } else {
      let data;
      data = {
        filiere: $("#filiere").val(),
        acronyme: $("#acronyme").val(),
      };
      log(data);
      return data;
    }
  }

  function putInDB(f) {
    f = receiveData();
    debugger
    log(f);
    $.ajax({
      type: "POST",
      url: "/addFiliere",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(f),
      success: (s) => {
        if (s) {
          Swal.fire({
           	position: "top-right",
						toast: true,
            icon: "success",
            title: "Spécialité enregistrée avec succès !",
            showConfirmButton: false,
            timer: 1500,
            onOpen: () => {
              const sound = new Audio("/sound/ok.ogg");
              sound.play();
            },
          }).then(() => {
            window.location.href = window.location.href;
            // window.location.reload();
          });
        }
      },
      error: (e) => {
        log(e);
      },
    });
  }

  function champVide(from, align) {
    $.notify(
      {
        icon: "add_alert",
        message: "<b>Veuillez renseigner tous les champs!!</b>",
      },
      {
        type: "warning",
        timer: 2500,
        placement: {
          from: from,
          align: align,
        },
        animate: {
          enter: "animated flipInY",
          exit: "animated flipOutX",
        },
      }
    );
  }

  deleteF = (id) => {
    sw.fire({
      title: "Etes-vous sûr(e)?",
      text: "Cette action est irréversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
      onOpen: () => {
        const sound = new Audio("/sound/ok.wav");
        sound.play();
      },
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        $.ajax({
          type: "GET",
          url: "/deleteFiliere/" + id,
          success: (r) => {
            if (r) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Filière supprimée avec succès!!",
                showConfirmButton: false,
                timer: 1500,
                backdrop: true,
                onOpen: () => {
                  const sound = new Audio("/sound/ko.wav");
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
        sw.fire("Annuler", "Suppression annulée!", "error");
      }
    });
  };

  function goEdit() {
    state.value = "edit";
  }

  function injector(m) {
    $("#idF").text(m.idFiliere);
    $("#filiere").val(m.filiere);
    $("#acronyme").val(m.acronyme);
    /* $("#id_grad").val(m.grade.idGrade); */
    goEdit();
  }

  function updateFil(f) {
    $.ajax({
      type: "GET",
      url: "/updateFiliere/" + f,
      success: (r) => {
          injector(r);
      },
      error: (e) => {
        log(e);
      },
    });
  }

  $("#adFil").click((e) => {
    e.preventDefault();
    if (receiveData().filiere === "" || receiveData().acronyme === "") {
      champVide();
    } else {
      /* log(receiveData().filiere); */
      //alert("Hop");
      putInDB();
    }
  });
  $(".delF").click(function (e) {
    e.preventDefault();
    let v = $(this).attr("title");
    deleteF(v);
  });

  $(".editF").click(function (e) {
    e.preventDefault();
    let f = $(this).attr("title");
    updateFil(f);
  });
  $("#tablef").DataTable({saveState:true});
});
