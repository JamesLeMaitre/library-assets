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
					nomrayon: $("#nomrayon").val()
				};
				return data;


			case "edit":
				let dat = {
					idRayon: $("#idR").text(),
					nomrayon: $("#nomrayon").val()
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
			url: "/addRayons",
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify(d),
			success: s => {
				if (s) {
					Swal.fire({
						position: "top-right",
						toast: true,
						icon: "success",
						title: "Rayon ajouté avec succès!!",
						showConfirmButton: false,
						timer: 1500,
						onOpen: () => {
                            const sound = new Audio("/sound/ok.ogg");
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
			message: "<b>Veuillez renseigner le champ nom du rayon !!</b>"
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
			cancelButtonText: "Annuler",
			reverseButtons: true
		}).then(result => {
			if (result.value) {
				$.ajax({
					type: "GET",
					url: "/deleteRayons/" + id,
					success: r => {
						if (r) {
							Swal.fire({
								position: "center",
								icon: "success",
								title: "Rayon supprimé avec succès!!",
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
				sw.fire("Annuler", "Opération annulée!", "error");
			}
		});
	}

	function goEdit() {
		state.value = "edit";
	}

	function injector(r) {
		$("#idR").text(r.idRayon);
		$("#nomrayon").val(r.nomrayon);
		goEdit();
	}

	function updateRayon(d) {
		$.ajax({
			type: "GET",
			url: "/updateRayons/" + d,
			success: r => {
				injector(r);
			},

			error: e => {
				log(e);
			}
		});
	}

	$("#adRayon").click(function(e) {
		e.preventDefault();
		if (recupInfo().nomrayon == "") {
			champVide();
		} else {
			//log(recupInfo().niveau);
			pushInDB();
		}
	});
	$(".delN").click(function(e) {
		e.preventDefault();
		let value = $(this).attr("title");
		deleteG(value);
	});

	$("#editR").click(function(e) {
		e.preventDefault();
		let value = $(this).attr("title");
		updateRayon(value);
	});
	$("#mTable12").DataTable();
});