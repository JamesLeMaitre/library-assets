const x =document.getElementById("stateDemande").textContent;

document.getElementById("pageCourant").innerHTML = "Chronologie de suivi de la demande de réservation";

window.onload =  setTimeout(() => {
  if(x === true){
    let dv = function myFunction() {
      var x = document.getElementById("valide");
      var set = document.getElementById("settings");
      var rot = document.getElementById("rotate");
      if (x.style.display === "none" || rot.style.display==="block"|| set.style.display==="none") {
        x.style.display = "block";
        rot.style.display = "none";
        set.style.display = "block";
      } else {
        x.style.display = "none";
      }
    };
    dv(); 
  }else{
    let dr = function myFunction() {
    var x = document.getElementById("reject");
    var set = document.getElementById("settings");
    var rot = document.getElementById("rotate");
    if (x.style.display === "none"|| rot.style.display==="block"|| set.style.display==="none") {
      x.style.display = "block";
      rot.style.display = "none";
        set.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };
  dr(); 
  }
  
}, 3000);

//259200000