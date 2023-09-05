$(() => {
    const log = console.log;
    const pg = "Tableau de Bord";
    document.getElementById("pageCourant").innerHTML = pg;

    let etudiants = document.getElementById("etudiants").textContent;
    let teachers = document.getElementById("enseignants").textContent;
    let personnel = document.getElementById("personnel").textContent;
    let others = document.getElementById('autresprofs').textContent;
    let total = document.getElementById("total").textContent;
    

    const student = (etudiants * 100) / total;
    const teacher = (teachers * 100) / total;
    const personnels = (personnel * 100) / total;
    const other = (others * 100) / total;

    let examens = document.getElementById("examen").textContent;
    let autre = document.getElementById("autres").textContent;
    let asmsss = document.getElementById("asmss").textContent;
    let asgaaa = document.getElementById("asgaa").textContent;
    let ascoo = document.getElementById("asco").textContent;
    let aress = document.getElementById("ares").textContent;
    let acomptafinn = document.getElementById("acomptafin").textContent;
    let biblioo = document.getElementById("biblio").textContent;

    /* 182,5 jours = 1 semestre*/

    const t = (examens / 183) * 100;
    const a = (autre / 183) * 100;
    const b = (biblioo / 183) * 100;
    const as = (asmsss / 183) * 100;
    const ag = (asgaaa / 183) * 100;
    const sc = (ascoo / 183) * 100;
    const rh = (aress / 183) * 100;
    const finance = (acomptafinn / 183) * 100;

    am4core.ready(function () {
        am4core.ready(function () {
            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv", am4charts.RadarChart);

            // Add data
            chart.data = [
                {
                    category: "Service Examen",
                    value: t,
                    full: 100,
                },
                {
                    category: "Service Scolarité",
                    value: sc,
                    full: 100,
                },
                {
                    category: "Service Bibliothèque",
                    value: b,
                    full: 100,
                },
                {
                    category: "Service Comptabilité Finance",
                    value: finance,
                    full: 100,
                },
                {
                    category: "Service RH",
                    value: rh,
                    full: 100,
                },
                {
                    category: "Service Médico-Social",
                    value: as,
                    full: 100,
                },
                {
                    category: "Service Gestion Académique",
                    value: ag,
                    full: 100,
                },
                {
                    category: "Autre Service",
                    value: a,
                    full: 100,
                },
            ];

            // Make chart not full circle
            chart.startAngle = -90;
            chart.endAngle = 180;
            chart.innerRadius = am4core.percent(20);

            // Set number format
            chart.numberFormatter.numberFormat = "#.#'%'";

            // Create axes
            var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "category";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.grid.template.strokeOpacity = 0;
            categoryAxis.renderer.labels.template.horizontalCenter = "right";
            categoryAxis.renderer.labels.template.fontWeight = 500;
            categoryAxis.renderer.labels.template.adapter.add("fill", function (
                fill,
                target
            ) {
                return target.dataItem.index >= 0
                    ? chart.colors.getIndex(target.dataItem.index)
                    : fill;
            });
            categoryAxis.renderer.minGridDistance = 10;

            var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
            valueAxis.renderer.grid.template.strokeOpacity = 0;
            valueAxis.min = 0;
            valueAxis.max = 100;
            valueAxis.strictMinMax = true;

            // Create series
            var series1 = chart.series.push(new am4charts.RadarColumnSeries());
            series1.dataFields.valueX = "full";
            series1.dataFields.categoryY = "category";
            series1.clustered = false;
            series1.columns.template.fill = new am4core.InterfaceColorSet().getFor(
                "alternativeBackground"
            );
            series1.columns.template.fillOpacity = 0.08;
            series1.columns.template.cornerRadiusTopLeft = 20;
            series1.columns.template.strokeWidth = 0;
            series1.columns.template.radarColumn.cornerRadius = 20;

            var series2 = chart.series.push(new am4charts.RadarColumnSeries());
            series2.dataFields.valueX = "value";
            series2.dataFields.categoryY = "category";
            series2.clustered = false;
            series2.columns.template.strokeWidth = 0;
            series2.columns.template.tooltipText = "{category}: [bold]{value}[/]";
            series2.columns.template.radarColumn.cornerRadius = 20;

            series2.columns.template.adapter.add("fill", function (fill, target) {
                return chart.colors.getIndex(target.dataItem.index);
            });

            // Add cursor
            chart.cursor = new am4charts.RadarCursor();

           

            /********************************/

            var chart = am4core.create("chartdiv3", am4charts.PieChart3D);
            chart.hiddenState.properties.opacity = 100; // this creates initial fade-in

            chart.data = [
                {
                    profession: "Etudiants",
                    value: student,
                },
                {
                    profession: "Personnels",
                    value: personnels,
                },
                {
                    profession: "Enseignants",
                    value: teacher,
                },
                {
                    profession: "Autres",
                    value: other,
                },
            ];
            /* Chart.depth la consistance du graphique // Le innerradius permet de faire un creux à l'interieur  '*/
            chart.innerRadius = am4core.percent(40);
            chart.depth = 120;

            chart.legend = new am4charts.Legend();

            var series = chart.series.push(new am4charts.PieSeries3D());
            series.dataFields.value = "value";
            series.dataFields.depthValue = "value";
            series.dataFields.category = "profession";
            series.slices.template.cornerRadius = 100;
            /*Ajout des couleurs pour le graphe*/
            series.colors.step = 4;

            /* Graphe du peronnel consultant
            var iconPath =
              "M53.5,476c0,14,6.833,21,20.5,21s20.5-7,20.5-21V287h21v189c0,14,6.834,21,20.5,21 c13.667,0,20.5-7,20.5-21V154h10v116c0,7.334,2.5,12.667,7.5,16s10.167,3.333,15.5,0s8-8.667,8-16V145c0-13.334-4.5-23.667-13.5-31 s-21.5-11-37.5-11h-82c-15.333,0-27.833,3.333-37.5,10s-14.5,17-14.5,31v133c0,6,2.667,10.333,8,13s10.5,2.667,15.5,0s7.5-7,7.5-13 V154h10V476 M61.5,42.5c0,11.667,4.167,21.667,12.5,30S92.333,85,104,85s21.667-4.167,30-12.5S146.5,54,146.5,42 c0-11.335-4.167-21.168-12.5-29.5C125.667,4.167,115.667,0,104,0S82.333,4.167,74,12.5S61.5,30.833,61.5,42.5z";
      */
           
        }); // end am4core.ready()
    });
});
