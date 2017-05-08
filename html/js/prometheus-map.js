// prometheus-map.js
// rusEFI/Prometheus project
// (c) andreika, 2017 (prometheus.pcb@gmail.com)
// https://github.com/andreika-git/prometheus/

$(function() {
        $('.map').maphilight();
        $('.componentLink').mouseover(function(e) {
        	var area = $($(this).attr("href"));
            area.mouseover();
        }).click(function(e) {
        	var area = $($(this).attr("href"));
            area.mouseover();
            var re = /([0-9]+),([0-9]+)/g;
			var m, sumX = 0, sumY = 0, cnt = 0;
			while (m = re.exec(area.attr("coords"))) {
            	sumX += parseInt(m[1]); sumY += parseInt(m[2]);
            	cnt++;
            }
            sumX = parseInt(sumX / cnt) - $("#mapdiv").width() / 2;
            sumY = parseInt(sumY / cnt) - $("#mapdiv").height() / 2;
            $("#mapdiv").stop();
            //if (!$("#mapdiv").is(':animated'))
            	$("#mapdiv").animate({scrollLeft: sumX, scrollTop: sumY }, 500);
			e.preventDefault();
			area.trigger("click");
        }).mouseout(function(e) {
        	$($(this).attr("href")).mouseout();
        });
});

$(function(){
  $("table").colResizable({liveDrag:true});
});

var clicked = false, dragged = false, clickX, clickY;

$("document").ready(function(e) {
	//document.onselectstart = function () { return false; }
	$(document).mousemove(function(e) {
        if (clicked && (e.pageX != clickX || e.pageY != clickY)) {
			$("html").css('cursor', 'grabbing');
        	updateScrollPos(e);
	        clickX = e.pageX;
    	    clickY = e.pageY;
    	    dragged = true;
    	}
    }).mouseup(function(e) {
    	if (clicked) {
	    	if (dragged) {
        		$('html').css('cursor', 'auto');
    			e.preventDefault();
    			e.stopPropagation();
	    	} else {
	    		$("#mapdiv area").trigger('click');
	    	}
        	clicked = false;
    	}
    }).mousedown(function(e) {
    	var targets = $(e.target).parents().andSelf();
    	dragged = false;
    	if (targets.is('#mapdiv') || targets.is('#map')) {
        	e.preventDefault();
	        clicked = true;
	        clickX = e.pageX;
	   	    clickY = e.pageY;
	   	    return false;
	   	}
    }).click(function(e) {
   		if (clicked)
   			return false;
   		return true;
    });

    $(".maparea").click(function(e) {
    	if (dragged)
    		return false;
		for (var i = 0; i < components.length; i++) {
			if (components[i]["name"] == e.target.id) {
				//alert(e.target.id);

				$(this).data("maphilight", { alwaysOn: true }).trigger('alwaysOn.maphilight');
				$('.selected').data('maphilight', { alwaysOn: false }).trigger('alwaysOn.maphilight');
    			$('.maparea').removeClass('selected');
                $(this).addClass('selected');

				var html = "<table border=0><tr><td>";
				var imgUrl = (components[i]["more"] && components[i]["more"]["img"]) ? components[i]["more"]["img"] : "https://raw.githubusercontent.com/andreika-git/prometheus/master/html/img/image_na.jpg";
				html += "<img src=\"" + imgUrl + "\" width=200 height=200>";
				html += "</td><td width=370 valign=top><div>";
				html += "<div>Designator: <b>"+components[i]["name"]+"</b></div>";
				html += "<div><b>"+components[i]["descr"]+"</b></div>";
				html += "<div>Value: <b>"+components[i]["value"]+"</b></div>";
				html += "<div>Package: <b>"+components[i]["fp"]+"</b></div>";
				if (components[i]["remark"])
					html += "<div><b><i>"+components[i]["remark"]+"</i></b></div>";
				html += "</div></td>";
				if (components[i]["more"]) {
					var m = components[i]["more"];
					html += "<td valign=top><div>";
					if (components[i]["part"]) {	
						html += "<div>"+(components[i]["supp"])+" Number: <b><a href=\""+(m["url"] ? m["url"] : "#")+"\">"+components[i]["part"]+"</a></b></div>";
					}
					if (m["ds"]) {
						html += "<div><a href=\"" + m["ds"] + "\"><img src=\"https://raw.githubusercontent.com/andreika-git/prometheus/master/html/img/pdf-1.png\" width=32 height=32>" + (m["model"] ? m["model"] : "Datasheet") + "</a></div>";
					}
					if (m["vname"]) {
						html += "<div>Manufacturer: " + (m["vurl"] ? "<a href=\"" + m["vurl"] + "\">" : "") + m["vname"] + (m["vurl"] ? "</a>" : "") + "</div>";
					}
					if (m["price"]) {
						html += "<div>Price: <b>"+m["price"]+"</b></div>";
					}
					html += "</div></td>";
				}
				html += "</tr></table>";
				$("#mapinfo").html(html);
			}
		}
		
		e.preventDefault();
    	return false;
    });

	$(window).on("resize", function() {
       	$("#mapdiv").height($(window).height() - $("#mapinfo").height() - 40);
       	$("#maplinks").height($(window).height() - 40);
	});
	
    $(window).trigger('resize');
});

var updateScrollPos = function(e) {
    $("html").css('cursor', 'grabbing');
    $("#mapdiv").scrollTop($("#mapdiv").scrollTop() + (clickY - e.pageY));
    $("#mapdiv").scrollLeft($("#mapdiv").scrollLeft() + (clickX - e.pageX));
}

function putLinks(components)
{
	var letter = "", prev = "";
    for (var i = 0; i < components.length; i++) {
    	var c = components[i];
    	var title = c['name']+"\n"+c['value']+"\n"+c['fp'];
   		var area = "<area class=\"maparea\" shape=\""+c['shape']+"\" coords=\""+c['coords']+"\" href=\"#"+c['name']+"\" alt=\""+c['name']+"\" id=\""+c['name']+"\" title=\""+title+"\" />";
   		document.writeln(area);
    	if (c['name'] != prev) {
	    	prev = c['name'];
	    	var value = c['value'] + ((c['more'] && c['more']['addrem']) ? " " + c['remark'] : "");
	    	var maplinks = "<a class=\"componentLink\" href=\"#"+c['name']+"\" title=\""+title+"\"><b>"+c['name']+"</b> (" + value + ")</a> ";
    		if (c['name'].substr(0, 1) != letter) {
    			if (letter != "")
    				$("#maplinks").append("<br><hr>\n");
	    		letter = c['name'].substr(0, 1);
	    	}
    		$("#maplinks").append(maplinks);
    	}
    }
   	$("#maplinks").append("<br>");
}
