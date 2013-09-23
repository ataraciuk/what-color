WhatColor = {};
WhatColor.init = function() {
	$("#twitter-widget-0").ready(function () {
		setTimeout(WhatColor.checkIframe,500);
	});
	$('#tweetBtn').click(function(){
		$(this).attr('href', this.href + encodeURIComponent(WhatColor.BASETEXT + $('#colorSel').val() + WhatColor.HASHTAGS));
	});
}

WhatColor.tweets = [];

WhatColor.checkIframe = function() {
 	var fr = $('#twitter-widget-0').contents();
	WhatColor.tweets = $('li.tweet', fr);
	if(WhatColor.tweets.length == 0) {
		setTimeout(WhatColor.checkIframe,500);
	} else {
		var colorComps = WhatColor.filterTweets(WhatColor.tweets);
		WhatColor.parseAvg(colorComps);
	}
}

WhatColor.filterTweets = function(elems) {
	var filtered = [];
	for(i = 0,l = elems.length; i < l; i++) {
		var e = $(elems[i]);
		//filter by less than 24 hours. for that, we find if the tweet date has a abbr tag. if not, it's older
		var recent = e.find('time').find('abbr').length > 0;
		if(recent) {
			//now let's check correct format, hex value and tag
			var content = e.find('p.e-entry-title');
			var contentHtml = content.html();
			//if it starts with the required text
			if(contentHtml.indexOf(WhatColor.BASETEXT) === 0) {
				var hexaVal = contentHtml.substring(WhatColor.BASELGTH, WhatColor.BASELGTH + 6);
				if(/^[0-9A-F]{6}$/i.test(hexaVal)) {
					//lets filter the color components
					filtered.push(hexaVal.match(/.{2}/g));
				}
			}
		}
	}
	return filtered;
}

WhatColor.parseAvg = function(arr) {
	var l = arr.length;
	var tots = [0,0,0];
	for(i = 0; i < l; i++) {
		var e = arr[i];
		for(j = 0; j < 3; j++) {
			tots[j]+= parseInt(e[j], 16);
		}
	}
	if(l > 0) {
		for(j = 0; j < 3; j++) {
			tots[j] = Math.round(tots[j] / l).toString(16);
			if(tots[j].length < 2) tots[j] = '0' + tots[j];
		}
		var hexa = tots.join('');
		$('#colorResult > div:first-child').css('background-color', '#'+hexa);
		$('#colorResult > div:last-child').html(hexa);
	}
}

WhatColor.BASETEXT = 'Andres should wear ';
WhatColor.BASELGTH = WhatColor.BASETEXT.length;
WhatColor.HASHTAGS = ' #colortowear #socialhacking';

document.addEventListener("DOMContentLoaded", function () {
	WhatColor.init();
});