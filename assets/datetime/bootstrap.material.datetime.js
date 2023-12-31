!(function ($, moment) {
    var pluginName = "james",
        pluginDataName = "plugin_" + pluginName;

    function Plugin(element, options) {
        (this.currentView = 0),
            this.minDate,
            this.maxDate,
            (this._attachedEvents = []),
            (this.element = element),
            (this.$element = $(element)),
            (this.params = {
                date: !0,
                time: !0,
                format: "YYYY-MM-DD",
                minDate: null,
                maxDate: null,
                currentDate: null,
                lang: "fr",
                weekStart: 0,
                disabledDays: [],
                shortTime: !1,
                clearButton: !1,
                nowButton: !1,
                cancelText: "Annuler",
                okText: "OK",
                clearText: "Clear",
                nowText: "Now",
                switchOnClick: !1,
                triggerEvent: "focus",
                monthPicker: !1,
                year: !0
            }),
            (this.params = $.fn.extend(this.params, options)),
            (this.name = "dtp_" + this.setName()),
            this.$element.attr("data-dtp", this.name),
            moment.locale(this.params.lang),
            this.init();
    }

    moment.locale("fr"),
        ($.fn[pluginName] = function (options, p) {
            return (
                this.each(function () {
                    $.data(this, pluginDataName)
                        ? ("function" == typeof $.data(this, pluginDataName)[options] &&
                        $.data(this, pluginDataName)[options](p),
                        "destroy" === options && $.data(this, pluginDataName))
                        : $.data(this, pluginDataName, new Plugin(this, options));
                }),
                    this
            );
        }),
        (Plugin.prototype = {
            init: function () {
                this.initDays(),
                    this.initDates(),
                    this.initTemplate(),
                    this.initButtons(),
                    this._attachEvent($(window), "resize", this._centerBox.bind(this)),
                    this._attachEvent(
                        this.$dtpElement.find(".dtp-content"),
                        "click",
                        this._onElementClick.bind(this)
                    ),
                    this._attachEvent(
                        this.$dtpElement,
                        "click",
                        this._onBackgroundClick.bind(this)
                    ),
                    this._attachEvent(
                        this.$element,
                        this.params.triggerEvent,
                        this._fireCalendar.bind(this)
                    );
            },
            initDays: function () {
                this.days = [];
                for (var i = this.params.weekStart; this.days.length < 7; i++)
                    i > 6 && (i = 0), this.days.push(i.toString());
            },
            initDates: function () {
                if (this.$element.val().length > 0)
                    void 0 !== this.params.format && null !== this.params.format
                        ? (this.currentDate = moment(
                        this.$element.val(),
                        this.params.format
                        ).locale(this.params.lang))
                        : (this.currentDate = moment(this.$element.val()).locale(
                        this.params.lang
                        ));
                else if (
                    void 0 !== this.$element.attr("value") &&
                    null !== this.$element.attr("value") &&
                    "" !== this.$element.attr("value")
                )
                    "string" == typeof this.$element.attr("value") &&
                    (void 0 !== this.params.format && null !== this.params.format
                        ? (this.currentDate = moment(
                            this.$element.attr("value"),
                            this.params.format
                        ).locale(this.params.lang))
                        : (this.currentDate = moment(this.$element.attr("value")).locale(
                            this.params.lang
                        )));
                else if (
                    void 0 !== this.params.currentDate &&
                    null !== this.params.currentDate
                ) {
                    if ("string" == typeof this.params.currentDate)
                        void 0 !== this.params.format && null !== this.params.format
                            ? (this.currentDate = moment(
                            this.params.currentDate,
                            this.params.format
                            ).locale(this.params.lang))
                            : (this.currentDate = moment(this.params.currentDate).locale(
                            this.params.lang
                            ));
                    else if (
                        void 0 === this.params.currentDate.isValid ||
                        "function" != typeof this.params.currentDate.isValid
                    ) {
                        var x = this.params.currentDate.getTime();
                        this.currentDate = moment(x, "x").locale(this.params.lang);
                    } else this.currentDate = this.params.currentDate;
                    this.$element.val(this.currentDate.format(this.params.format));
                } else this.currentDate = moment();
                if (void 0 !== this.params.minDate && null !== this.params.minDate)
                    if ("string" == typeof this.params.minDate)
                        void 0 !== this.params.format && null !== this.params.format
                            ? (this.minDate = moment(
                            this.params.minDate,
                            this.params.format
                            ).locale(this.params.lang))
                            : (this.minDate = moment(this.params.minDate).locale(
                            this.params.lang
                            ));
                    else if (
                        void 0 === this.params.minDate.isValid ||
                        "function" != typeof this.params.minDate.isValid
                    ) {
                        var x = this.params.minDate.getTime();
                        this.minDate = moment(x, "x").locale(this.params.lang);
                    } else this.minDate = this.params.minDate;
                else null === this.params.minDate && (this.minDate = null);
                if (void 0 !== this.params.maxDate && null !== this.params.maxDate)
                    if ("string" == typeof this.params.maxDate)
                        void 0 !== this.params.format && null !== this.params.format
                            ? (this.maxDate = moment(
                            this.params.maxDate,
                            this.params.format
                            ).locale(this.params.lang))
                            : (this.maxDate = moment(this.params.maxDate).locale(
                            this.params.lang
                            ));
                    else if (
                        void 0 === this.params.maxDate.isValid ||
                        "function" != typeof this.params.maxDate.isValid
                    ) {
                        var x = this.params.maxDate.getTime();
                        this.maxDate = moment(x, "x").locale(this.params.lang);
                    } else this.maxDate = this.params.maxDate;
                else null === this.params.maxDate && (this.maxDate = null);
                this.isAfterMinDate(this.currentDate) ||
                (this.currentDate = moment(this.minDate)),
                this.isBeforeMaxDate(this.currentDate) ||
                (this.currentDate = moment(this.maxDate));
            },
            initTemplate: function () {
                for (
                    var yearPicker = "", y = this.currentDate.year(), i = y - 3;
                    i < y + 4;
                    i++
                )
                    yearPicker +=
                        '<div class="year-picker-item" data-year="' +
                        i +
                        '">' +
                        i +
                        "</div>";
                this.midYear = y;
                var yearHtml =
                    '<div class="dtp-picker-year d-none" ><div><a href="javascript:void(0);" class="btn btn-sm btn-outline-dark btn-block dtp-select-year-range before m-0"><i class="material-icons">keyboard_arrow_up</i></a></div>' +
                    yearPicker +
                    '<div><a href="javascript:void(0);" class="btn btn-sm btn-outline-dark btn-block dtp-select-year-range after m-0"><i class="material-icons">keyboard_arrow_down</i></a></div></div>';
                (this.template =
                    '<div class="dtp d-none" id="' +
                    this.name +
                    '"><div class="dtp-content"><div class="dtp-date-view"><header class="dtp-header"><div class="dtp-actual-day">Monday</div></header><div class="dtp-date d-none"><div><div class="left center p10"><a href="javascript:void(0);" class="dtp-select-month-before"><i class="material-icons">chevron_left</i></a></div><div class="dtp-actual-month p80">MAR</div><div class="right center p10"><a href="javascript:void(0);" class="dtp-select-month-after"><i class="material-icons">chevron_right</i></a></div><div class="clearfix"></div></div><div class="dtp-actual-num">13</div><div><div class="left center p10"><a href="javascript:void(0);" class="dtp-select-year-before"><i class="material-icons">chevron_left</i></a></div><div class="dtp-actual-year p80' +
                    (this.params.year ? "" : " disabled") +
                    '">2018</div><div class="right center p10"><a href="javascript:void(0);" class="dtp-select-year-after"><i class="material-icons">chevron_right</i></a></div><div class="clearfix"></div></div></div><div class="dtp-time d-none"><div class="dtp-actual-maxtime">23:55</div></div><div class="dtp-picker"><div class="dtp-picker-calendar"></div><div class="dtp-picker-datetime d-none"><div class="dtp-actual-meridien"><div class="left p20"><a class="dtp-meridien-am" href="javascript:void(0);">AM</a></div><div class="dtp-actual-time p60"></div><div class="right p20"><a class="dtp-meridien-pm" href="javascript:void(0);">PM</a></div><div class="clearfix"></div></div><div id="dtp-svg-clock"></div></div>' +
                    yearHtml +
                    '</div></div><div class="dtp-buttons"><button class="dtp-btn-now btn btn-sm btn-outline-primary d-none">' +
                    this.params.nowText +
                    '</button><button class="dtp-btn-clear btn btn-sm btn-outline-primary d-none">' +
                    this.params.clearText +
                    '</button><button class="dtp-btn-cancel btn btn-sm btn-outline-primary">' +
                    this.params.cancelText +
                    '</button><button class="dtp-btn-ok btn btn-sm btn-outline-primary">' +
                    this.params.okText +
                    '</button><div class="clearfix"></div></div></div></div>'),
                $("body").find("#" + this.name).length <= 0 &&
                ($("body").append(this.template),
                this && (this.dtpElement = $("body").find("#" + this.name)),
                    (this.$dtpElement = $(this.dtpElement)));
            },
            initButtons: function () {
                this._attachEvent(
                    this.$dtpElement.find(".dtp-btn-cancel"),
                    "click",
                    this._onCancelClick.bind(this)
                ),
                    this._attachEvent(
                        this.$dtpElement.find(".dtp-btn-ok"),
                        "click",
                        this._onOKClick.bind(this)
                    ),
                    this._attachEvent(
                        this.$dtpElement.find("a.dtp-select-month-before"),
                        "click",
                        this._onMonthBeforeClick.bind(this)
                    ),
                    this._attachEvent(
                        this.$dtpElement.find("a.dtp-select-month-after"),
                        "click",
                        this._onMonthAfterClick.bind(this)
                    ),
                    this._attachEvent(
                        this.$dtpElement.find("a.dtp-select-year-before"),
                        "click",
                        this._onYearBeforeClick.bind(this)
                    ),
                    this._attachEvent(
                        this.$dtpElement.find("a.dtp-select-year-after"),
                        "click",
                        this._onYearAfterClick.bind(this)
                    ),
                    this._attachEvent(
                        this.$dtpElement.find(".dtp-actual-year"),
                        "click",
                        this._onActualYearClick.bind(this)
                    ),
                    this._attachEvent(
                        this.$dtpElement.find("a.dtp-select-year-range.before"),
                        "click",
                        this._onYearRangeBeforeClick.bind(this)
                    ),
                    this._attachEvent(
                        this.$dtpElement.find("a.dtp-select-year-range.after"),
                        "click",
                        this._onYearRangeAfterClick.bind(this)
                    ),
                    this._attachEvent(
                        this.$dtpElement.find("div.year-picker-item"),
                        "click",
                        this._onYearItemClick.bind(this)
                    ),
                !0 === this.params.clearButton &&
                (this._attachEvent(
                    this.$dtpElement.find(".dtp-btn-clear"),
                    "click",
                    this._onClearClick.bind(this)
                ),
                    this.$dtpElement.find(".dtp-btn-clear").removeClass("d-none")),
                !0 === this.params.nowButton &&
                (this._attachEvent(
                    this.$dtpElement.find(".dtp-btn-now"),
                    "click",
                    this._onNowClick.bind(this)
                ),
                    this.$dtpElement.find(".dtp-btn-now").removeClass("d-none")),
                    !0 === this.params.nowButton && !0 === this.params.clearButton
                        ? this.$dtpElement
                            .find(
                                ".dtp-btn-clear, .dtp-btn-now, .dtp-btn-cancel, .dtp-btn-ok"
                            )
                            .addClass("btn-sm")
                        : (!0 !== this.params.nowButton &&
                        !0 !== this.params.clearButton) ||
                        this.$dtpElement
                            .find(
                                ".dtp-btn-clear, .dtp-btn-now, .dtp-btn-cancel, .dtp-btn-ok"
                            )
                            .addClass("btn-sm");
            },
            initMeridienButtons: function () {
                this.$dtpElement
                    .find("a.dtp-meridien-am")
                    .off("click")
                    .on("click", this._onSelectAM.bind(this)),
                    this.$dtpElement
                        .find("a.dtp-meridien-pm")
                        .off("click")
                        .on("click", this._onSelectPM.bind(this));
            },
            initDate: function (d) {
                (this.currentView = 0),
                !1 === this.params.monthPicker &&
                this.$dtpElement.find(".dtp-picker-calendar").removeClass("d-none"),
                    this.$dtpElement.find(".dtp-picker-datetime").addClass("d-none"),
                    this.$dtpElement.find(".dtp-picker-year").addClass("d-none");
                var _date =
                        void 0 !== this.currentDate && null !== this.currentDate
                            ? this.currentDate
                            : null,
                    _calendar = this.generateCalendar(this.currentDate);
                if (void 0 !== _calendar.week && void 0 !== _calendar.days) {
                    var _template = this.constructHTMLCalendar(_date, _calendar);
                    this.$dtpElement.find("a.dtp-select-day").off("click"),
                        this.$dtpElement.find(".dtp-picker-calendar").html(_template),
                        this.$dtpElement
                            .find("a.dtp-select-day")
                            .on("click", this._onSelectDate.bind(this)),
                        this.toggleButtons(_date);
                }
                this._centerBox(), this.showDate(_date);
            },
            initHours: function () {
                (this.currentView = 1),
                    this.showTime(this.currentDate),
                    this.initMeridienButtons(),
                    this.currentDate.hour() < 12
                        ? this.$dtpElement.find("a.dtp-meridien-am").click()
                        : this.$dtpElement.find("a.dtp-meridien-pm").click();
                var hFormat = this.params.shortTime ? "h" : "H";
                this.$dtpElement.find(".dtp-picker-datetime").removeClass("d-none"),
                    this.$dtpElement.find(".dtp-picker-calendar").addClass("d-none"),
                    this.$dtpElement.find(".dtp-picker-year").addClass("d-none");
                for (
                    var svgClockElement = this.createSVGClock(!0), i = 0;
                    i < 12;
                    i++
                ) {
                    var x = -162 * Math.sin(2 * -Math.PI * (i / 12)),
                        y = -162 * Math.cos(2 * -Math.PI * (i / 12)),
                        fill =
                            this.currentDate.format(hFormat) == i
                                ? "var(--primary)"
                                : "transparent",
                        color = this.currentDate.format(hFormat) == i ? "#fff" : "#000",
                        svgHourCircle = this.createSVGElement("circle", {
                            id: "h-" + i,
                            class: "dtp-select-hour",
                            r: "30",
                            cx: x,
                            cy: y,
                            fill: fill,
                            "data-hour": i
                        }),
                        svgHourText;
                    ((svgHourText = this.createSVGElement("text", {
                        id: "th-" + i,
                        class: "dtp-select-hour-text",
                        "text-anchor": "middle",
                        style: "cursor:pointer",
                        "font-weight": "normal",
                        "font-size": "20",
                        x: x,
                        y: y + 7,
                        fill: color,
                        "data-hour": i
                    })).textContent = 0 === i && this.params.shortTime ? 12 : i),
                        this.toggleTime(i, !0)
                            ? (svgHourCircle.addEventListener(
                            "click",
                            this._onSelectHour.bind(this)
                            ),
                                svgHourText.addEventListener(
                                    "click",
                                    this._onSelectHour.bind(this)
                                ))
                            : ((svgHourCircle.className += " disabled"),
                                (svgHourText.className += " disabled"),
                                svgHourText.setAttribute("fill", "#bdbdbd")),
                        svgClockElement.appendChild(svgHourCircle),
                        svgClockElement.appendChild(svgHourText);
                }
                if (!this.params.shortTime) {
                    for (var i = 0; i < 12; i++) {
                        var x = -110 * Math.sin(2 * -Math.PI * (i / 12)),
                            y = -110 * Math.cos(2 * -Math.PI * (i / 12)),
                            fill =
                                this.currentDate.format(hFormat) == i + 12
                                    ? "var(--primary)"
                                    : "transparent",
                            color =
                                this.currentDate.format(hFormat) == i + 12
                                    ? "#fff"
                                    : "rgba(0,0,0,.87)",
                            svgHourCircle = this.createSVGElement("circle", {
                                id: "h-" + (i + 12),
                                class: "dtp-select-hour",
                                style: "cursor:pointer",
                                r: "30",
                                cx: x,
                                cy: y,
                                fill: fill,
                                "data-hour": i + 12
                            }),
                            svgHourText;
                        ((svgHourText = this.createSVGElement("text", {
                            id: "th-" + (i + 12),
                            class: "dtp-select-hour-text",
                            "text-anchor": "middle",
                            style: "cursor:pointer",
                            "font-weight": "normal",
                            "font-size": "22",
                            x: x,
                            y: y + 7,
                            fill: color,
                            "data-hour": i + 12
                        })).textContent = i + 12),
                            this.toggleTime(i + 12, !0)
                                ? (svgHourCircle.addEventListener(
                                "click",
                                this._onSelectHour.bind(this)
                                ),
                                    svgHourText.addEventListener(
                                        "click",
                                        this._onSelectHour.bind(this)
                                    ))
                                : ((svgHourCircle.className += " disabled"),
                                    (svgHourText.className += " disabled"),
                                    svgHourText.setAttribute("fill", "#bdbdbd")),
                            svgClockElement.appendChild(svgHourCircle),
                            svgClockElement.appendChild(svgHourText);
                    }
                    this.$dtpElement.find("a.dtp-meridien-am").addClass("d-none"),
                        this.$dtpElement.find("a.dtp-meridien-pm").addClass("d-none");
                }
                this._centerBox();
            },
            initMinutes: function () {
                (this.currentView = 2),
                    this.showTime(this.currentDate),
                    this.initMeridienButtons(),
                    this.currentDate.hour() < 12
                        ? this.$dtpElement.find("a.dtp-meridien-am").click()
                        : this.$dtpElement.find("a.dtp-meridien-pm").click(),
                    this.$dtpElement.find(".dtp-picker-year").addClass("d-none"),
                    this.$dtpElement.find(".dtp-picker-calendar").addClass("d-none"),
                    this.$dtpElement.find(".dtp-picker-datetime").removeClass("d-none");
                for (
                    var svgClockElement = this.createSVGClock(!1), i = 0;
                    i < 60;
                    i++
                ) {
                    var s = i % 5 == 0 ? 162 : 158,
                        r = i % 5 == 0 ? 30 : 20,
                        x = -s * Math.sin(2 * -Math.PI * (i / 60)),
                        y = -s * Math.cos(2 * -Math.PI * (i / 60)),
                        color =
                            this.currentDate.format("m") == i
                                ? "var(--primary)"
                                : "transparent",
                        svgMinuteCircle = this.createSVGElement("circle", {
                            id: "m-" + i,
                            class: "dtp-select-minute",
                            style: "cursor:pointer",
                            r: r,
                            cx: x,
                            cy: y,
                            fill: color,
                            "data-minute": i
                        });
                    this.toggleTime(i, !1)
                        ? svgMinuteCircle.addEventListener(
                        "click",
                        this._onSelectMinute.bind(this)
                        )
                        : (svgMinuteCircle.className += " disabled"),
                        svgClockElement.appendChild(svgMinuteCircle);
                }
                for (var i = 0; i < 60; i++)
                    if (i % 5 == 0) {
                        var x = -162 * Math.sin(2 * -Math.PI * (i / 60)),
                            y = -162 * Math.cos(2 * -Math.PI * (i / 60)),
                            color =
                                this.currentDate.format("m") == i ? "#fff" : "rgba(0,0,0,.87)",
                            svgMinuteText = this.createSVGElement("text", {
                                id: "tm-" + i,
                                class: "dtp-select-minute-text",
                                "text-anchor": "middle",
                                style: "cursor:pointer",
                                "font-weight": "normal",
                                "font-size": "20",
                                x: x,
                                y: y + 7,
                                fill: color,
                                "data-minute": i
                            });
                        (svgMinuteText.textContent = i),
                            this.toggleTime(i, !1)
                                ? svgMinuteText.addEventListener(
                                "click",
                                this._onSelectMinute.bind(this)
                                )
                                : ((svgMinuteText.className += " disabled"),
                                    svgMinuteText.setAttribute("fill", "#bdbdbd")),
                            svgClockElement.appendChild(svgMinuteText);
                    }
                this._centerBox();
            },
            animateHands: function () {
                var H = this.currentDate.hour(),
                    M = this.currentDate.minute(),
                    hh,
                    mh;
                this.$dtpElement
                    .find(".hour-hand")[0]
                    .setAttribute("transform", "rotate(" + (360 * H) / 12 + ")"),
                    this.$dtpElement
                        .find(".minute-hand")[0]
                        .setAttribute("transform", "rotate(" + (360 * M) / 60 + ")");
            },
            createSVGClock: function (isHour) {
                var hl = this.params.shortTime ? -120 : -90,
                    svgElement = this.createSVGElement("svg", {
                        class: "svg-clock",
                        viewBox: "0,0,400,400"
                    }),
                    svgGElement = this.createSVGElement("g", {
                        transform: "translate(200,200) "
                    }),
                    svgClockFace = this.createSVGElement("circle", {
                        r: "192",
                        fill: "#eee"
                    }),
                    svgClockCenter = this.createSVGElement("circle", {
                        r: "4",
                        fill: "var(--primary)"
                    });
                if ((svgGElement.appendChild(svgClockFace), isHour)) {
                    var svgMinuteHand = this.createSVGElement("line", {
                            class: "minute-hand",
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: -150
                        }),
                        svgHourHand = this.createSVGElement("line", {
                            class: "hour-hand",
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: hl,
                            stroke: "var(--primary)",
                            "stroke-width": 3
                        });
                    svgGElement.appendChild(svgMinuteHand),
                        svgGElement.appendChild(svgHourHand);
                } else {
                    var svgMinuteHand = this.createSVGElement("line", {
                            class: "minute-hand",
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: -150,
                            stroke: "var(--primary)",
                            "stroke-width": 3
                        }),
                        svgHourHand = this.createSVGElement("line", {
                            class: "hour-hand",
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: hl
                        });
                    svgGElement.appendChild(svgHourHand),
                        svgGElement.appendChild(svgMinuteHand);
                }
                return (
                    svgGElement.appendChild(svgClockCenter),
                        svgElement.appendChild(svgGElement),
                        this.$dtpElement.find("#dtp-svg-clock").empty(),
                        this.$dtpElement.find("#dtp-svg-clock")[0].appendChild(svgElement),
                        this.animateHands(),
                        svgGElement
                );
            },
            createSVGElement: function (tag, attrs) {
                var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
                for (var k in attrs) el.setAttribute(k, attrs[k]);
                return el;
            },
            isAfterMinDate: function (date, checkHour, checkMinute) {
                var _return = !0;
                if (void 0 !== this.minDate && null !== this.minDate) {
                    var _minDate = moment(this.minDate),
                        _date = moment(date);
                    checkHour ||
                    checkMinute ||
                    (_minDate.hour(0),
                        _minDate.minute(0),
                        _date.hour(0),
                        _date.minute(0)),
                        _minDate.second(0),
                        _date.second(0),
                        _minDate.millisecond(0),
                        _date.millisecond(0),
                        checkMinute
                            ? (_return =
                            parseInt(_date.format("X")) >= parseInt(_minDate.format("X")))
                            : (_date.minute(0),
                                _minDate.minute(0),
                                (_return =
                                    parseInt(_date.format("X")) >=
                                    parseInt(_minDate.format("X"))));
                }
                return _return;
            },
            isBeforeMaxDate: function (date, checkTime, checkMinute) {
                var _return = !0;
                if (void 0 !== this.maxDate && null !== this.maxDate) {
                    var _maxDate = moment(this.maxDate),
                        _date = moment(date);
                    checkTime ||
                    checkMinute ||
                    (_maxDate.hour(0),
                        _maxDate.minute(0),
                        _date.hour(0),
                        _date.minute(0)),
                        _maxDate.second(0),
                        _date.second(0),
                        _maxDate.millisecond(0),
                        _date.millisecond(0),
                        checkMinute
                            ? (_return =
                            parseInt(_date.format("X")) <= parseInt(_maxDate.format("X")))
                            : (_date.minute(0),
                                _maxDate.minute(0),
                                (_return =
                                    parseInt(_date.format("X")) <=
                                    parseInt(_maxDate.format("X"))));
                }
                return _return;
            },
            rotateElement: function (el, deg) {
                $(el).css({
                    WebkitTransform: "rotate(" + deg + "deg)",
                    "-moz-transform": "rotate(" + deg + "deg)"
                });
            },
            showDate: function (date) {
                date &&
                (this.$dtpElement
                    .find(".dtp-actual-day")
                    .html(date.locale(this.params.lang).format("dddd")),
                    this.$dtpElement.find(".dtp-actual-month").html(
                        date
                            .locale(this.params.lang)
                            .format("MMM")
                            .toUpperCase()
                    ),
                    this.$dtpElement
                        .find(".dtp-actual-num")
                        .html(date.locale(this.params.lang).format("DD")),
                    this.$dtpElement
                        .find(".dtp-actual-year")
                        .html(date.locale(this.params.lang).format("YYYY")));
            },
            showTime: function (date) {
                if (date) {
                    var minutes = date.minute(),
                        content =
                            (this.params.shortTime ? date.format("hh") : date.format("HH")) +
                            ":" +
                            (2 == minutes.toString().length ? minutes : "0" + minutes) +
                            (this.params.shortTime ? " " + date.format("A") : "");
                    this.params.date
                        ? this.$dtpElement.find(".dtp-actual-time").html(content)
                        : (this.params.shortTime
                        ? this.$dtpElement.find(".dtp-actual-day").html("")
                        : this.$dtpElement.find(".dtp-actual-day").html("&nbsp;"),
                            this.$dtpElement.find(".dtp-actual-maxtime").html(content));
                }
            },
            selectDate: function (date) {
                date &&
                (this.currentDate.date(date),
                    this.showDate(this.currentDate),
                    this.$element.trigger("dateSelected", this.currentDate));
            },
            generateCalendar: function (date) {
                var _calendar = {};
                if (null !== date) {
                    var startOfMonth = moment(date)
                            .locale(this.params.lang)
                            .startOf("month"),
                        endOfMonth = moment(date)
                            .locale(this.params.lang)
                            .endOf("month"),
                        iNumDay = startOfMonth.format("d");
                    (_calendar.week = this.days), (_calendar.days = []);
                    for (var i = startOfMonth.date(); i <= endOfMonth.date(); i++) {
                        if (i === startOfMonth.date()) {
                            var iWeek = _calendar.week.indexOf(iNumDay.toString());
                            if (iWeek > 0)
                                for (var x = 0; x < iWeek; x++) _calendar.days.push(0);
                        }
                        _calendar.days.push(
                            moment(startOfMonth)
                                .locale(this.params.lang)
                                .date(i)
                        );
                    }
                }
                return _calendar;
            },
            constructHTMLCalendar: function (date, calendar) {
                var _template = "";
                (_template +=
                    '<div class="dtp-picker-month">' +
                    date.locale(this.params.lang).format("MMMM YYYY") +
                    "</div>"),
                    (_template += '<table class="table dtp-picker-days"><thead>');
                for (var i = 0; i < calendar.week.length; i++)
                    _template +=
                        "<th>" +
                        moment(parseInt(calendar.week[i]), "d")
                            .locale(this.params.lang)
                            .format("dd")
                            .substring(0, 1) +
                        "</th>";
                (_template += "</thead>"), (_template += "<tbody><tr>");
                for (var i = 0; i < calendar.days.length; i++)
                    i % 7 == 0 && (_template += "</tr><tr>"),
                        (_template +=
                            '<td data-date="' +
                            moment(calendar.days[i])
                                .locale(this.params.lang)
                                .format("D") +
                            '">'),
                    0 != calendar.days[i] &&
                    (!1 === this.isBeforeMaxDate(moment(calendar.days[i]), !1, !1) ||
                    !1 === this.isAfterMinDate(moment(calendar.days[i]), !1, !1) ||
                    -1 !==
                    this.params.disabledDays.indexOf(calendar.days[i].isoWeekday())
                        ? (_template +=
                            '<span class="dtp-select-day">' +
                            moment(calendar.days[i])
                                .locale(this.params.lang)
                                .format("DD") +
                            "</span>")
                        : moment(calendar.days[i])
                            .locale(this.params.lang)
                            .format("DD") ===
                        moment(this.currentDate)
                            .locale(this.params.lang)
                            .format("DD")
                            ? (_template +=
                                '<a href="javascript:void(0);" class="dtp-select-day selected">' +
                                moment(calendar.days[i])
                                    .locale(this.params.lang)
                                    .format("DD") +
                                "</a>")
                            : (_template +=
                                '<a href="javascript:void(0);" class="dtp-select-day">' +
                                moment(calendar.days[i])
                                    .locale(this.params.lang)
                                    .format("DD") +
                                "</a>"),
                        (_template += "</td>"));
                return (_template += "</tr></tbody></table>");
            },
            setName: function () {
                for (
                    var text = "",
                        possible =
                            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                        i = 0;
                    i < 5;
                    i++
                )
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                return text;
            },
            isPM: function () {
                return this.$dtpElement.find("a.dtp-meridien-pm").hasClass("selected");
            },
            setElementValue: function () {
                this.$element.trigger("beforeChange", this.currentDate),
                void 0 !== $.material && this.$element.removeClass("empty"),
                    this.$element.val(
                        moment(this.currentDate)
                            .locale(this.params.lang)
                            .format(this.params.format)
                    ),
                    this.$element.trigger("change", this.currentDate);
            },
            toggleButtons: function (date) {
                if (date && date.isValid()) {
                    var startOfMonth = moment(date)
                            .locale(this.params.lang)
                            .startOf("month"),
                        endOfMonth = moment(date)
                            .locale(this.params.lang)
                            .endOf("month");
                    this.isAfterMinDate(startOfMonth, !1, !1)
                        ? this.$dtpElement
                            .find("a.dtp-select-month-before")
                            .removeClass("invisible")
                        : this.$dtpElement
                            .find("a.dtp-select-month-before")
                            .addClass("invisible"),
                        this.isBeforeMaxDate(endOfMonth, !1, !1)
                            ? this.$dtpElement
                                .find("a.dtp-select-month-after")
                                .removeClass("invisible")
                            : this.$dtpElement
                                .find("a.dtp-select-month-after")
                                .addClass("invisible");
                    var startOfYear = moment(date)
                            .locale(this.params.lang)
                            .startOf("year"),
                        endOfYear = moment(date)
                            .locale(this.params.lang)
                            .endOf("year");
                    this.isAfterMinDate(startOfYear, !1, !1)
                        ? this.$dtpElement
                            .find("a.dtp-select-year-before")
                            .removeClass("invisible")
                        : this.$dtpElement
                            .find("a.dtp-select-year-before")
                            .addClass("invisible"),
                        this.isBeforeMaxDate(endOfYear, !1, !1)
                            ? this.$dtpElement
                                .find("a.dtp-select-year-after")
                                .removeClass("invisible")
                            : this.$dtpElement
                                .find("a.dtp-select-year-after")
                                .addClass("invisible");
                }
            },
            toggleTime: function (value, isHours) {
                var result = !1,
                    _date,
                    _date;
                isHours
                    ? ((_date = moment(this.currentDate))
                        .hour(this.convertHours(value))
                        .minute(0)
                        .second(0),
                        (result = !(
                            !1 === this.isAfterMinDate(_date, !0, !1) ||
                            !1 === this.isBeforeMaxDate(_date, !0, !1)
                        )))
                    : ((_date = moment(this.currentDate)).minute(value).second(0),
                        (result = !(
                            !1 === this.isAfterMinDate(_date, !0, !0) ||
                            !1 === this.isBeforeMaxDate(_date, !0, !0)
                        )));
                return result;
            },
            _attachEvent: function (el, ev, fn) {
                el.on(ev, null, null, fn), this._attachedEvents.push([el, ev, fn]);
            },
            _detachEvents: function () {
                for (var i = this._attachedEvents.length - 1; i >= 0; i--)
                    this._attachedEvents[i][0].off(
                        this._attachedEvents[i][1],
                        this._attachedEvents[i][2]
                    ),
                        this._attachedEvents.splice(i, 1);
            },
            _fireCalendar: function () {
                (this.currentView = 0),
                    this.$element.blur(),
                    this.initDates(),
                    this.show(),
                    this.params.date
                        ? (this.$dtpElement.find(".dtp-date").removeClass("d-none"),
                            this.initDate())
                        : this.params.time &&
                        (this.$dtpElement.find(".dtp-time").removeClass("d-none"),
                            this.initHours());
            },
            _onBackgroundClick: function (e) {
                e.stopPropagation(), this.hide();
            },
            _onElementClick: function (e) {
                e.stopPropagation();
            },
            _onKeydown: function (e) {
                27 === e.which && this.hide();
            },
            _onCloseClick: function () {
                this.hide(),
                    this.$dtpElement.find(".dtp-actual-year").removeClass("text-white"),
                    this.$dtpElement
                        .find(".dtp-actual-month, .dtp-actual-num, .dtp-actual-day")
                        .removeClass("text-white-50");
            },
            _onClearClick: function () {
                this.$dtpElement.find(".dtp-actual-year").removeClass("text-white"),
                    this.$dtpElement
                        .find(".dtp-actual-month, .dtp-actual-num, .dtp-actual-day")
                        .removeClass("text-white-50"),
                    (this.currentDate = null),
                    this.$element.trigger("beforeChange", this.currentDate),
                    this.hide(),
                void 0 !== $.material && this.$element.addClass("empty"),
                    this.$element.val(""),
                    this.$element.trigger("change", this.currentDate);
            },
            _onNowClick: function () {
                if (
                    (this.$dtpElement.find(".dtp-actual-year").removeClass("text-white"),
                        this.$dtpElement
                            .find(".dtp-actual-month, .dtp-actual-num, .dtp-actual-day")
                            .removeClass("text-white-50"),
                        (this.currentDate = moment()),
                    !0 === this.params.date &&
                    (this.showDate(this.currentDate),
                    0 === this.currentView && this.initDate()),
                    !0 === this.params.time)
                ) {
                    switch ((this.showTime(this.currentDate), this.currentView)) {
                        case 1:
                            this.initHours();
                            break;
                        case 2:
                            this.initMinutes();
                    }
                    this.animateHands();
                }
            },
            _onOKClick: function () {
                switch (
                    (this.$dtpElement.find(".dtp-actual-year").removeClass("text-white"),
                        this.$dtpElement
                            .find(".dtp-actual-month, .dtp-actual-num, .dtp-actual-day")
                            .removeClass("text-white-50"),
                        this.currentView)
                    ) {
                    case 0:
                        !0 === this.params.time
                            ? this.initHours()
                            : (this.setElementValue(), this.hide());
                        break;
                    case 1:
                        this.initMinutes();
                        break;
                    case 2:
                        this.setElementValue(), this.hide();
                }
            },
            _onCancelClick: function () {
                if (
                    (this.$dtpElement.find(".dtp-actual-year").removeClass("text-white"),
                        this.$dtpElement
                            .find(".dtp-actual-month, .dtp-actual-num, .dtp-actual-day")
                            .removeClass("text-white-50"),
                        this.params.time)
                )
                    switch (this.currentView) {
                        case 0:
                            this.hide();
                            break;
                        case 1:
                            this.params.date ? this.initDate() : this.hide();
                            break;
                        case 2:
                            this.initHours();
                    }
                else this.hide();
            },
            _onMonthBeforeClick: function () {
                this.currentDate.subtract(1, "months"),
                    this.initDate(this.currentDate),
                    this._closeYearPicker(),
                    this.$dtpElement.find(".dtp-actual-year").removeClass("text-white"),
                    this.$dtpElement
                        .find(".dtp-actual-month, .dtp-actual-num, .dtp-actual-day")
                        .removeClass("text-white-50");
            },
            _onMonthAfterClick: function () {
                this.currentDate.add(1, "months"),
                    this.initDate(this.currentDate),
                    this._closeYearPicker(),
                    this.$dtpElement.find(".dtp-actual-year").removeClass("text-white"),
                    this.$dtpElement
                        .find(".dtp-actual-month, .dtp-actual-num, .dtp-actual-day")
                        .removeClass("text-white-50");
            },
            _onYearBeforeClick: function () {
                this.currentDate.subtract(1, "years"),
                    this.initDate(this.currentDate),
                    this._closeYearPicker(),
                    this.$dtpElement.find(".dtp-actual-year").removeClass("text-white"),
                    this.$dtpElement
                        .find(".dtp-actual-month, .dtp-actual-num, .dtp-actual-day")
                        .removeClass("text-white-50");
            },
            _onYearAfterClick: function () {
                this.currentDate.add(1, "years"),
                    this.initDate(this.currentDate),
                    this._closeYearPicker(),
                    this.$dtpElement.find(".dtp-actual-year").removeClass("text-white"),
                    this.$dtpElement
                        .find(".dtp-actual-month, .dtp-actual-num, .dtp-actual-day")
                        .removeClass("text-white-50");
            },
            refreshYearItems: function () {
                var curYear = this.currentDate.year(),
                    midYear = this.midYear,
                    minYear = 1850;
                void 0 !== this.minDate &&
                null !== this.minDate &&
                (minYear = moment(this.minDate).year());
                var maxYear = 2200;
                void 0 !== this.maxDate &&
                null !== this.maxDate &&
                (maxYear = moment(this.maxDate).year()),
                    this.$dtpElement
                        .find(".dtp-picker-year .invisible")
                        .removeClass("invisible"),
                    this.$dtpElement.find(".year-picker-item").each(function (i, el) {
                        var newYear = midYear - 3 + i;
                        $(el)
                            .attr("data-year", newYear)
                            .text(newYear)
                            .data("year", newYear),
                            curYear == newYear
                                ? $(el).addClass("active")
                                : $(el).removeClass("active"),
                        (newYear < minYear || newYear > maxYear) &&
                        $(el).addClass("invisible");
                    }),
                minYear >= midYear - 3 &&
                this.$dtpElement
                    .find(".dtp-select-year-range.before")
                    .addClass("invisible"),
                maxYear <= midYear + 3 &&
                this.$dtpElement
                    .find(".dtp-select-year-range.after")
                    .addClass("invisible"),
                    this.$dtpElement.find(".dtp-select-year-range").data("mid", midYear);
            },
            _onActualYearClick: function () {
                this.params.year &&
                (this.$dtpElement.find(".dtp-picker-year.d-none").length > 0
                    ? (this.$dtpElement.find(".dtp-picker-datetime").addClass("d-none"),
                        this.$dtpElement.find(".dtp-picker-calendar").addClass("d-none"),
                        this.$dtpElement.find(".dtp-picker-year").removeClass("d-none"),
                        this.$dtpElement.find(".dtp-actual-year").addClass("text-white"),
                        this.$dtpElement
                            .find(".dtp-actual-month, .dtp-actual-num, .dtp-actual-day")
                            .addClass("text-white-50"),
                        (this.midYear = this.currentDate.year()),
                        this.refreshYearItems())
                    : this._closeYearPicker());
            },
            _onYearRangeBeforeClick: function () {
                (this.midYear -= 7), this.refreshYearItems();
            },
            _onYearRangeAfterClick: function () {
                (this.midYear += 7), this.refreshYearItems();
            },
            _onYearItemClick: function (e) {
                var newYear,
                    oldYear,
                    diff = $(e.currentTarget).data("year") - this.currentDate.year();
                this.currentDate.add(diff, "years"),
                    this.initDate(this.currentDate),
                    this.$dtpElement.find(".dtp-actual-year").removeClass("text-white"),
                    this.$dtpElement
                        .find(".dtp-actual-month, .dtp-actual-num, .dtp-actual-day")
                        .removeClass("text-white-50"),
                    this._closeYearPicker(),
                    this.$element.trigger("yearSelected", this.currentDate);
            },
            _closeYearPicker: function () {
                this.$dtpElement.find(".dtp-picker-calendar").removeClass("d-none"),
                    this.$dtpElement.find(".dtp-picker-year").addClass("d-none");
            },
            enableYearPicker: function () {
                (this.params.year = !0),
                    this.$dtpElement.find(".dtp-actual-year").removeClass("disabled");
            },
            disableYearPicker: function () {
                (this.params.year = !1),
                    this.$dtpElement.find(".dtp-actual-year").addClass("disabled"),
                    this._closeYearPicker();
            },
            _onSelectDate: function (e) {
                this.$dtpElement.find("a.dtp-select-day").removeClass("selected"),
                    $(e.currentTarget).addClass("selected"),
                    this.selectDate(
                        $(e.currentTarget)
                            .parent()
                            .data("date")
                    ),
                !0 === this.params.switchOnClick &&
                !0 === this.params.time &&
                setTimeout(this.initHours.bind(this), 200),
                !0 === this.params.switchOnClick &&
                !1 === this.params.time &&
                setTimeout(this._onOKClick.bind(this), 200);
            },
            _onSelectHour: function (e) {
                if (!$(e.target).hasClass("disabled")) {
                    for (
                        var value = $(e.target).data("hour"),
                            parent = $(e.target).parent(),
                            h = parent.find(".dtp-select-hour"),
                            i = 0;
                        i < h.length;
                        i++
                    )
                        $(h[i]).attr("fill", "transparent");
                    for (
                        var th = parent.find(".dtp-select-hour-text"), i = 0;
                        i < th.length;
                        i++
                    )
                        $(th[i]).attr("fill", "#000");
                    $(parent.find("#h-" + value)).attr("fill", "var(--primary)"),
                        $(parent.find("#th-" + value)).attr("fill", "#fff"),
                        this.currentDate.hour(parseInt(value)),
                    !0 === this.params.shortTime &&
                    this.isPM() &&
                    this.currentDate.add(12, "hours"),
                        this.showTime(this.currentDate),
                        this.animateHands(),
                    !0 === this.params.switchOnClick &&
                    setTimeout(this.initMinutes.bind(this), 200);
                }
            },
            _onSelectMinute: function (e) {
                if (!$(e.target).hasClass("disabled")) {
                    for (
                        var value = $(e.target).data("minute"),
                            parent = $(e.target).parent(),
                            m = parent.find(".dtp-select-minute"),
                            i = 0;
                        i < m.length;
                        i++
                    )
                        $(m[i]).attr("fill", "transparent");
                    for (
                        var tm = parent.find(".dtp-select-minute-text"), i = 0;
                        i < tm.length;
                        i++
                    )
                        $(tm[i]).attr("fill", "#000");
                    $(parent.find("#m-" + value)).attr("fill", "var(--primary)"),
                        $(parent.find("#tm-" + value)).attr("fill", "#fff"),
                        this.currentDate.minute(parseInt(value)),
                        this.showTime(this.currentDate),
                        this.animateHands(),
                    !0 === this.params.switchOnClick &&
                    setTimeout(
                        function () {
                            this.setElementValue(), this.hide();
                        }.bind(this),
                        200
                    );
                }
            },
            _onSelectAM: function (e) {
                $(".dtp-actual-meridien")
                    .find("a")
                    .removeClass("selected"),
                    $(e.currentTarget).addClass("selected"),
                this.currentDate.hour() >= 12 &&
                this.currentDate.subtract(12, "hours") &&
                this.showTime(this.currentDate),
                    this.toggleTime(1 === this.currentView);
            },
            _onSelectPM: function (e) {
                $(".dtp-actual-meridien")
                    .find("a")
                    .removeClass("selected"),
                    $(e.currentTarget).addClass("selected"),
                this.currentDate.hour() < 12 &&
                this.currentDate.add(12, "hours") &&
                this.showTime(this.currentDate),
                    this.toggleTime(1 === this.currentView);
            },
            _hideCalendar: function () {
                this.$dtpElement.find(".dtp-picker-calendar").addClass("d-none");
            },
            convertHours: function (h) {
                var _return = h;
                return (
                    !0 === this.params.shortTime &&
                    h < 12 &&
                    this.isPM() &&
                    (_return += 12),
                        _return
                );
            },
            setDate: function (date) {
                (this.params.currentDate = date), this.initDates();
            },
            setMinDate: function (date) {
                (this.params.minDate = date), this.initDates();
            },
            setMaxDate: function (date) {
                (this.params.maxDate = date), this.initDates();
            },
            destroy: function () {
                this._detachEvents(), this.$dtpElement.remove();
            },
            show: function () {
                this.$dtpElement.removeClass("d-none"),
                    this._attachEvent($(window), "keydown", this._onKeydown.bind(this)),
                    this._centerBox(),
                    this.$element.trigger("open"),
                !0 === this.params.monthPicker && this._hideCalendar();
            },
            hide: function () {
                $(window).off("keydown", null, null, this._onKeydown.bind(this)),
                    this.$dtpElement.addClass("d-none"),
                    this.$element.trigger("close");
            },
            _centerBox: function () {
                var h =
                    (this.$dtpElement.height() -
                        this.$dtpElement.find(".dtp-content").height()) /
                    2;
                this.$dtpElement
                    .find(".dtp-content")
                    .css(
                        "marginLeft",
                        -this.$dtpElement.find(".dtp-content").width() / 2 + "px"
                    ),
                    this.$dtpElement.find(".dtp-content").css("top", h + "px");
            },
            enableDays: function () {
                var enableDays = this.params.enableDays;
                enableDays &&
                $(".dtp-picker-days tbody tr td").each(function () {
                    $.inArray($(this).index(), enableDays) >= 0 ||
                    $(this)
                        .find("a")
                        .css({
                            background: "#e3e3e3",
                            cursor: "no-drop",
                            opacity: "0.5"
                        })
                        .off("click");
                });
            }
        });
})(jQuery, moment);
