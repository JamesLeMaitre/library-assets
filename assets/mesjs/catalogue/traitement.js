

document.getElementById("pageCourant").innerHTML = "Liste de demande de réservations ";

const log = console.log;
const sw = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-outline-success btn-round",
        cancelButton: "btn btn-outline-danger btn-round",
    },
    buttonsStyling: false,
});
$("#listeNoV").DataTable();
$("#listeV").DataTable();
$("#listeR").DataTable();
let updateSatutRes= (p) => {
    sw.fire({
        title: "Validation de la demande",
        text: "Procédez à la validation de la demande !",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "J'accepte",
        cancelButtonText: "Je refuse",
        reverseButtons: true,
      
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: "GET",
                url: "/acceptReservation/" + p,
                success: (p) => {
                    if (p) {
                       log("Oups ça n'a pas marché !")
                    } else {
                        let timerInterval
                        Swal.fire({
                          title: 'Alerte progression',
                          html: 'Veuillez patientez quelques <b></b> milliseconds.',
                          timer: 2000,
                          timerProgressBar: true,
                           showConfirmButton: false,
                          willOpen: () => {
                            Swal.showLoading()
                            timerInterval = setInterval(() => {
                              const content = Swal.getContent()
                              if (content) {
                                const b = content.querySelector('b')
                                if (b) {
                                  b.textContent = Swal.getTimerLeft()
                                }
                              }
                            }, 100)
                          },
                          onClose: () => {
                            clearInterval(timerInterval)
                          }
                        }).then((result) => {
                          /* Read more about handling dismissals below */
                          if (result.dismiss === Swal.DismissReason.timer) {
                           window.location.href = window.location.href;
                          }
                        })
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
                title: "Annulation du processus !",
                showCancelButton: false,
                
            });
        }
    });
};
let rejectReservation = (s) => {
    sw.fire({
        title: "Rejet de la demande",
        text: "Procédez au rejet de la demande !",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "J'accepte",
        cancelButtonText: "Je refuse",
        reverseButtons: true,
      
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: "GET",
                url: "/rejectReservation/" + s,
                success: (p) => {
                    if (p) {
                      let timerInterval
                      Swal.fire({
                        title: 'Alerte progression',
                        html: 'Veuillez patientez quelques <b></b> milliseconds.',
                        timer: 2000,
                        timerProgressBar: true,
                         showConfirmButton: false,
                        willOpen: () => {
                          Swal.showLoading()
                          timerInterval = setInterval(() => {
                            const content = Swal.getContent()
                            if (content) {
                              const b = content.querySelector('b')
                              if (b) {
                                b.textContent = Swal.getTimerLeft()
                              }
                            }
                          }, 100)
                        },
                        onClose: () => {
                          clearInterval(timerInterval)
                        }
                      }).then((result) => {
                        /* Read more about handling dismissals below */
                        if (result.dismiss === Swal.DismissReason.timer) {
                         window.location.href =  window.location.href;
                        }
                      })
                       
                    } else {
                      log("Oups ça n'a pas marché !")
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
                title: "Processus annulé !",
                showCancelButton: false,
                
            });
        }
    });
};
let deleteRes = (d) => {
    sw.fire({
        title: "VALIDATION",
        text: "Procédez au rejet de la demande !",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "J'accepte",
        cancelButtonText: "Je refuse",
        reverseButtons: true,
      
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: "GET",
                url: "/deleteReservation/" + d,
                success: (p) => {
                    if (p) {
                        let timerInterval
                        Swal.fire({
                          title: 'Alerte progression de suppression',
                          html: 'Veuillez patientez quelques <b></b> milliseconds.',
                          timer: 2000,
                          timerProgressBar: true,
                           showConfirmButton: false,
                          willOpen: () => {
                            Swal.showLoading()
                            timerInterval = setInterval(() => {
                              const content = Swal.getContent()
                              if (content) {
                                const b = content.querySelector('b')
                                if (b) {
                                  b.textContent = Swal.getTimerLeft()
                                }
                              }
                            }, 100)
                          },
                          onClose: () => {
                            clearInterval(timerInterval)
                          }
                        }).then((result) => {
                          /* Read more about handling dismissals below */
                          if (result.dismiss === Swal.DismissReason.timer) {
                           window.location.href =  window.location.href;
                          }
                        })
                      
                    } else {
                        log("Oups ça n'a pas marché !")
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
                title: "Annulation du processus !",
                showCancelButton: false,
                
            });
        }
    });
};

$(".statusR").click((e) => {
    e.preventDefault();
    let g = e.currentTarget.title;
    // log(g);
    updateSatutRes(g);
});

$(".rejectR").click((e) => {
    e.preventDefault();
    let h = e.currentTarget.title;
    // log(g);
    rejectReservation(h);
});

$(".delRes").click((e) => {
    e.preventDefault();
    let d = e.currentTarget.title;
    deleteRes(d);
});

