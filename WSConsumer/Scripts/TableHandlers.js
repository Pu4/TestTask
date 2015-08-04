var extDtarow;
var extData;
var extCellArray = null;
var extRoute;

tableFiller = function(datarow) {
    var rowId = null;
    if (typeof datarow == "string") {
        rowId = "#A-Z";
    } else {
        rowId = Math.ceil(datarow / 100);
        if (rowId % 2 != 0) {
            rowId += 1;
        }
        rowId = "#" + rowId;
    }
    if (extDtarow != undefined) {
        tableCleaner(extDtarow);
        extDtarow = rowId;
    } else {
        extDtarow = rowId;
    }
    $(rowId).attr("class", "innerTable");
    $(rowId).append(tableGetter(datarow));
    $("<div class='innerTable' style='display:table-row' id='deleteMe'></div>").insertAfter(rowId);
}

tableCleaner = function (tableId) {
    $("#deleteMe").remove();
    $(tableId).empty();
    $(tableId).removeAttr("class", "innerTable");
}

dataGetter = function() {
    $.ajax({
        url: "https://api.tfl.gov.uk/Line/Mode/bus/Route?app_id=21b45316&app_key=fdbc65e1e4dda31c58b0cda465e85638",
        dataType: "json"
    }).then(function(data) {
        extData = data;
    });
}

$(document).ready(function () {
    $("#Right_Block").hide();
        dataGetter();
    }
);

tableGetter = function(mdataRow) {
    var cellArray;
    if (typeof mdataRow == "string") {
        cellArray = $.grep(extData, function (e) { return e.name[0] >= mdataRow[0] && e.name[0] <= mdataRow[2]; });
    } else {
        cellArray = $.grep(extData, function (e) { return e.name >= (mdataRow - 49) && e.name <= mdataRow;});
    }
    extCellArray = cellArray;
    var mkp = "";
    cellArray.forEach(function(entry) {
        mkp += "<div class='divCell' onclick='routeGetter(" + entry.name + ")'>" + entry.name + "</div>";
    });
    return mkp;
}

routeFiller = function() {
    var directInner = "inbound";
    $("#Right_Block").show();
   routeMarkupGen(directInner);
}

routeGetter = function(name) {
    var urlString = "https://api.tfl.gov.uk/Line/" + name + "/Arrivals?app_id=21b45316&app_key=fdbc65e1e4dda31c58b0cda465e85638";
    $.ajax({
        url: urlString,
        dataType: "json"
    }).then(function(data) {
        extRoute = data;
    }).then(function() { routeFiller(); });
}

routeMarkupGen = function(direction) {
    var markup = "";
    var stopsArray = $.grep(extRoute, function (q) { return q.direction == direction; });
    $("#DirectionP").text("Direction: " + direction);
    switch (direction) {
    case "inbound":
        {
            $("button").attr("onclick", "routeMarkupGen('outbound')");
            break;
        }
        case "outbound":
            {
                $("button").attr("onclick", "routeMarkupGen('inbound')");
                break;
            }

    }
    var uniqueStops;

    uniqueStops = uniq_fast(stopsArray);

    uniqueStops.forEach(function (stop) {
            markup += "<li class='list-group-item'>" + stop.stationName;
            switch (stop.platformName) {
            case "null":
                {

                break;
            }
            default:
                {
                    markup += "  platform:" + stop.platformName;
                    break;
                }
            }
            markup += "</li>";
        }
    );
    $(".list-group").html(markup);
}

uniq_fast = function (a) {
    var p;
    for (var i = 0; i < a.length; i++) {
        for (var x = i + 1; x < a.length; x++) {
            if (a[x].stationName == a[i].stationName) {
                a.splice(x, 1);
                --x;
            }
        }
    }
    return a;
}