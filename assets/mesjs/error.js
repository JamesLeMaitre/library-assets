let page = 1,
    pagelimit = 3,
    totalrecord = 0;
$(".prev-btn").on("Click", () => {
    if (page > 0) {
        page--;
        log("Prev Page:" + page);
    }
});

$(".next-btn").on("Click", () => {
    if (page * pagelimit < totalrecord) {
        page++;
        log("Next Page:" + page);
    }
});
let f = {
    page: 1,
    pagelimit: 3
};
$.ajax({
    url: "http://localhost:9000/api/livres",
    type: "GET",
    data: f,
    success: r => {
        if (r) {
            let dataArr = r;
            log(dataArr);
            totalrecord = r.length;
            log(totalrecord);

            let html = "";
            for (let i = 0; i < dataArr.length; i++) {
                // log(dataArr[i].nature.type_document);
                html += "<tr>" +
                    "<td>" + dataArr[i].nature.type_document + "</td>" +
                    "<td>" + dataArr[i].auteur + "</td>" +
                    "<td>" + dataArr[i].quantite + "</td>" +

                    "</tr>";

            }
            $("#result").html(html);

        }
    },
    error: (jqXHR, textStatus, errorThrown) => {
        log(jqXHR);
        log(textStatus);
        log(errorThrown);
    }
});

format = d => {
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        '<tr>' +
        '<td>Full name:</td>' +
        '<td>' + d.name + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Extension number:</td>' +
        '<td>' + d.extn + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Extra info:</td>' +
        '<td>And any further details here (images etc)...</td>' +
        '</tr>' +
        '</table>'
}
/*********************************************************/
