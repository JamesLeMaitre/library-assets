const pg = "Etat de mes réservations";
document.getElementById("pageCourant").innerHTML = pg;

const log= console.log;
const sw = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-outline-success btn-round",
        cancelButton: "btn btn-outline-danger btn-round",
    },
    buttonsStyling: false,
});


$("#myTable").DataTable();


    let valid = $("#valid").text();
    let reject= $("#reject").text();

    let vrai = true,
        faux = false;

//log(valid);
//log(reject)
 
/* setTimeout(() => {
    if(valid === faux){
     
        log(valid)
        if(reject === faux){
            
            log(reject)
            alert("Demande en cours de traitement")
        }else{
          
            log(reject)
            log(valid)
            alert("Demande rejeté avec succès !")
        }
    }else{
    
        log(valid)
       if(reject === faux){
           
           log(reject)
           alert("Demande validée")
       }else{

           log(reject)
           log(valid)
           alert("Demande non traitée...")
       }
    }
}, 1000);
 */
userDeleteReservation = (s) => {
    sw.fire({
        title: "Suppression réservation",
        text: "Procédez à suppression de réservation !",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Non, annuler",
        reverseButtons: true,
      
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: "GET",
                url: "/userDelete/" + s,
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
                    }else{
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

$(".userDel").on("click",(e)=>{
    e.preventDefault();
    let id = e.currentTarget.title;
    //log(id);
    userDeleteReservation(id);


})

