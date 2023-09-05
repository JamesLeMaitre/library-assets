const pg = "Liste des retours effectuées";
document.getElementById("pageCourant").innerHTML = pg;

const log = console.log;
const sw = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-outline-success btn-round",
        cancelButton: "btn btn-outline-danger btn-round",
    },
    buttonsStyling: false,
});

$("#myTable").DataTable();


let validUserReturn =(id)=>{
    sw.fire({
        title: "Validation retour",
        text: "L'étudiant a respecté les dates retours, je procède à ",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "La validation ",
       cancelButtonText: "la pénalisation",
        reverseButtons: true,
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: "GET",
                url: "/validerleRetourUtilisateur/" + id,
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
                title: "Option pénalité en maintenance !",
                showCancelButton: false,
                
            });
        }
    });
}




$(".validR").on('click',(e)=>{
    e.preventDefault();
    let id = e.currentTarget.title;
    log(id);
   validUserReturn(id);
})