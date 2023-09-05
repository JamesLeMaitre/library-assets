log = console.log;

const pg = "Formulaire de demande de réservation";
document.getElementById("pageCourant").innerHTML = pg;

const url = "http://localhost:9000/api/onBook";

let dropdown = $("#id_book");
let quantite = $("#quantite");

dropdown.empty();

dropdown.append(
  '<option  selected="true" disabled>Choisir le document</option>'
);
dropdown.prop("selectedIndex", 0);

$.getJSON(url, function (data) {
  $.each(data, function (key, entry) {
    dropdown.append(
      $("<option></option>")
        .attr("value", entry.id_Livre)
        .text(entry.nomatricule)
    );
    $(".selectpicker").selectpicker("refresh");
  });
});

$("#id_book").on("change", (e) => {
  let x = document.getElementById("info");
  const c = e.target.options.length;
  // log(c);
  const idB = $("#id_book option:selected").val();
  // const nature = $("#nature");
  log(idB);
  $.get(url, (data) => {
    let d = idB - 1;
    log(data);
    let qt = data[d].quantite;
    let nt = data[d].nature.type_document;
    let at = data[d].auteur;
    let th = data[d].theme;
    //log(qt);
    $("#quantite").val(qt);
    $("#auteur").val(at);
    $("#nature").val(nt);
    $("#theme").val(th);
  });

  if (c != null) {
    x.style.display = "flex";
  }
});

$("#myTable").DataTable();

/****************************** */
// Fonction d'extraction de chiffre une variable string
function extraitNbre(str) {
  return Number(str.replace(/[^\d]/g, ""));
}


var rangeText = function (start, end) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  var str = "";
  str += start ? start.format("Do MMMM YYYY") + " to " : "";
  str += end ? end.format("Do MMMM YYYY") : "...";

  new Lightpick({
    field: document.getElementById("date_retour"),
    onSelect: function (date) {
      document.getElementById("date_retour").innerHTML = date.format(
        "Do MMMM YYYY"
      );
    },
  });
  /*
  setTimeout(() => {
    const dateretour = $("#date_retour").val();
    log(dateretour);
  }, 3000);*/
  /* Ici je recupère le nombre de jour démandé pour la réservation*/
  const daysSelect = $(".lightpick__tooltip").text();
  const resDays = extraitNbre(daysSelect);
  if (daysSelect /* log(extraitNbre(daysSelect))*/);
  /* Fonction qui va pré-vérifier le champ retour*/
  addDaysReturn = (date, days) => {
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    // log("New Date " + copy);
    return copy;
  };

  return str;
};

let date = new Date();
let options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
//options.timeZone = 'UTC';
//options.timeZoneName = 'short';
const utc = date.toLocaleString("fr-FR", options);
$("#date_jour").val(utc);
$("#date_reservation").val(utc);

//alert("Controler la durée d'emprunt j'ai commenté ca")
//$("#date_reservation").val(utc);

new Lightpick({
  field: document.getElementById("duree_reservation"),
  singleDate: false,
  minDate: moment(),
  //maxDate: moment(14),
  minDays: 2,
  autoclose: true,
  footer: true,
  maxDays: 7,
  onSelect: function (start, end) {
    document.getElementById("duree_reservation").innerHTML = rangeText(
      start,
      end
    );
  },
});

//////////////////////// Setter le value de la date retour en fonction du nobre de jour choisie

// extraitNbre(daysSelect)

/*************************************************** */

//document.getElementById("userna").setAttribute("value", x);
let getData = () => {
  let data = {
    id_book: $("#id_book").val(),
    date_jour: $("#date_jour").val(),
    duree_reservation: $("#duree_reservation").val(),
    date_retour: $("#date_retour").val(),
    username: $("#username").val(),
    motif: $("#motif").val(),
    resQte: $("#resQte").val(),

  };
  //log(data);
  return data;
};

let checkDateRetour = () => {
  const selctDuree = getData().duree_reservation;
  const dateRetur = getData().date_retour;
  let v = selctDuree.indexOf(dateRetur) !== -1 ? true : false;
  return v; /*
  if(selctDuree.indexOf(dateRetur) !== -1){
    return  log("La date correspond  pafaitement !");
  } else{
  return  log("La date ne correspond pas");
  }*/
};
let BounceIn = (icon, message, type) => {
  $.notify(
    {
      icon: icon,
      message: message,
    },
    {
      type: type,
      timer: 1000,
      animate: {
        enter: "animated bounceIn",
        exit: "animated bounceOut",
      },
    }
  );
};

let saveInDb = (s) => {
  s = getData();
  $.ajax({
    type: "POST",
    url: "/makeReservation" + "/" + s.id_book + "/" + s.username,
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(s),
    success: (r) => {
      if (r) {
        BounceIn("star_outline", "<strong>Demande de réservation effectuée</strong>","success");
        setTimeout(() => {
          window.location.href = "/userReservation";
        }, 2500);

      }
    },
  });
};

$(".r").on("click", (e) => {
  e.preventDefault();

  if (getData().id_book === null) {
    BounceIn("notifications_active", "<strong>Veuillez choisir le livre </strong>", "danger");
  } else if (getData().duree_reservation === "") {
    BounceIn("notifications_active", "<strong>Sélectionnez la durée (max: 07jours) </strong>", "danger");
  } else if (getData().duree_reservation.length < 17) {
    BounceIn("notifications_active", "<strong>Choisir la date retour du livre</strong>", "danger");
  } else if (getData().motif === "") {
    BounceIn("notifications_active", "<strong>Donner votre motif de réservation</strong>", "danger");
  } else if (getData().date_jour === "") {
    BounceIn("notifications_active", "<strong>Choisir la date retour conforme à la duréé</strong>", "danger");
  } else if (checkDateRetour() === false) {
    BounceIn("notifications_active", "<strong>Dates retours non conforme</strong>", "danger");
  } else {
    saveInDb();
  }
});
