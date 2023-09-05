$(document).ready(function() {
	const log = console.log;
	const sw = Swal.mixin({
		customClass: {
			confirmButton: "btn btn-outline-success btn-round",
			cancelButton: "btn btn-outline-danger btn-round"
		},
		buttonsStyling: false
	});

	let state = {
		value: "new"
	};
	/* Functions permettant l'édition */

	/* Functions pour le grade */


	function recupInfo() {
		switch (state.value) {
			case "new":
				let data = {
					niveau: $("#niveau").val()
				};
				return data;


			case "edit":
				let dat = {
					idGrade: $("#myID").text(),
					niveau: $("#niveau").val()
				};
				return dat;

			default:
				break;
		}
	}

	function pushInDB(d) {
		d = recupInfo();
		$.ajax({
			type: "POST",
			url: "/addGrade",
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify(d),
			success: s => {
				if (s) {
					Swal.fire({
						position: "top-right",
						toast: true,
						icon: "success",
						title: "Grade enregistré avec succès!!",
						showConfirmButton: false,
						timer: 1500,
						onOpen: () => {
							const sound = new Audio('/sound/ok.ogg')
							sound.play();
						}
					}).then(() => {
						window.location.href = window.location.href;
						// window.location.reload();
					});
				}
			},
			error: e => {
				log(e);
			}
		});
	}



	function champVide(from, align) {
		$.notify({
			icon: "add_alert",
			message: "<b>Veuillez renseigner tous les champs!!</b>"
		}, {
			type: "warning",
			timer: 1500,
			animate: {
				enter: 'animated rollIn',
				exit: 'animated rollOut'
			},
			placement: {
				from: from,
				align: align
			}
		});
	}

	function deleteG(id) {
		sw.fire({
			title: "Etes-vous sûr(e)?",
			text: "Cette action est irréversible!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Supprimer",
			cancelButtonText: "Ignorer",
			reverseButtons: true
		}).then(result => {
			if (result.value) {
				$.ajax({
					type: "GET",
					url: "/deleteGrade/" + id,
					success: r => {
						if (r) {
							Swal.fire({
								position: "center",
								icon: "success",
								title: "Grade supprimé avec succès!!",
								showConfirmButton: false,
								timer: 1500,
								backdrop: true,
								onOpen: () => {
									const sound = new Audio('/sound/ko.wav')
									sound.play();
								}
							}).then(() => {
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
	}

	function goEdit() {
		state.value = "edit";
	}

	function injector(r) {
		$("#myID").text(r.idGrade);
		$("#niveau").val(r.niveau);
		goEdit();
	}

	function updateGrade(d) {
		$.ajax({
			type: "GET",
			url: "/updateGrade/" + d,
			success: r => {
				injector(r);
			},

			error: e => {
				log(e);
			}
		});
	}

	$(".btns").click(function(e) {
		e.preventDefault();
		if (recupInfo().niveau == "") {
			champVide();
		} else {
			//log(recupInfo().niveau);
			pushInDB();
		}
	});
	$(".delG").click(function(e) {
		e.preventDefault();
		let value = $(this).attr("title");
		deleteG(value);
	});

	$(".editG").click(function(e) {
		e.preventDefault();
		let value = $(this).attr("title");
		updateGrade(value);
	});
	$("#tableGrade").DataTable();
});