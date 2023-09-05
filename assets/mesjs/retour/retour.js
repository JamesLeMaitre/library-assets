const pg = "Formulaire d'enregistrment de retours d'emprunt";
document.getElementById("pageCourant").innerHTML = pg;

const log = console.log;


new Lightpick({
    field: document.getElementById("dateRetour"),
    minDate: moment(),
    onSelect: function (date) {
        document.getElementById("dateRetour").innerHTML = date.format(
            "Do MMMM YYYY"
        );
    },
});

let date = new Date(),
    options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
//options.timeZone = 'UTC';
//options.timeZoneName = 'short';
const utc = date.toLocaleString("fr-FR", options);
$("#dateJour").val(utc);


/* Recupérer les données*/

let getDataRetour = () => {
    let data = {
        dateJour: $("#dateJour").val(),
        dateRetour: $("#dateRetour").val(),
        respectdate: $("#respectdate:checked").val(),
        reservation_id: $("#reservation_id").val(),
        username: $("#username").val(),
        nomuser: $("#nomuser").val()
    }
    // log(data);
    return data;
}

let sendDataInDB = (data) => {
    data = getDataRetour();

    log(data);
    $.ajax({
        type: "POST",
        url: "/makeReturns" + "/" + data.reservation_id + "/" + data.username,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: (r) => {
            if (r) {
                var notify = $.notify('<strong>Enregistrement</strong> en cours...', {
                    allow_dismiss: false,
                    showProgressbar: false
                });

                setTimeout(function () {
                    notify.update({ 'type': 'success', 'message': '<strong>Success</strong> Formulaire en enregistré!', 'progress': 25 });
                }, 4500);

                setTimeout(() => {
                    window.location.href = window.location.href;
                }, 5500);

            }
        },
        error: e => {
            log("Erreur : " + e.status)
        }
    });
}
$("#sendReturn").on('click', (e) => {
    e.preventDefault();
    if (getDataRetour().respectdate === undefined ||
        getDataRetour().dateJour === '' ||
        getDataRetour().reservation_id === "") {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Veuillez remplir avec soin les champs!",
            showConfirmButton: false,
            timer: 1500,
        })
    } else {

        sendDataInDB();
    }
})