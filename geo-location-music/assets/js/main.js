var BACKEND_URL = "http://159.203.111.158:5559/";



function tplawesome(e,t){res=e;for(var n=0;n<t.length;n++){res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){return t[n][r]})}return res}
// $('#results').append(tplawesome('hi','Im','kenneth'))
// var coords;
$(function() {
	$("form").on("submit", function(e) {
		e.preventDefault();
			 // prepare the request
			 var request = gapi.client.youtube.search.list({
			 	part: "snippet",
			 	type: "video",
			 	q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
			 	maxResults: 3,
			 	order: "viewCount",
			 	publishedAfter: "2015-01-01T00:00:00Z"
			 }); 
			 // execute the request
			 request.execute(function(response) {
			 	var results = response.result;
			 	$("#results").html("");
			 	$.each(results.items, function(index, item) {
			 		console.log(item)
			 		$.get("tpl/item.html", function(data) {
			 			$("#results").append(tplawesome(data, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
			 		});
			 	});
			 	resetVideoHeight();
			 });
			});

	$("body").on("click", "#results .item", function() {
			// console.log("click event on item")
			$("#results .item").removeClass("active");
			$(this).addClass("active")
		})

	$(window).on("resize", resetVideoHeight);
});

function resetVideoHeight() {
	$(".video").css("height", $("#results").width() * 9/16);
}

function init() {
	console.log("init()");
	gapi.client.setApiKey("AIzaSyDH3Je7Vq_redqWlOy-m2CG54yFJ39XOQs");
	gapi.client.load("youtube", "v3", function() {
		// yt api is ready
		console.log("youtube api ready");
	});
}

$('video').iframeTracker({
	blurCallback: function(){
		$('video').on('click', function(){
			console.log('please work');
		})
	}
});


let coords= {
	lat: 0,
	long: 0
};

var currentLocation = navigator.geolocation.watchPosition((data)=>{
	coords = {
		lat:data.coords.latitude,
		lng:data.coords.longitude
	}
	console.log("got current location update", coords);

	$(document).trigger("first-geoupdate");
})


$('body').on('click',function(e){
	if(e.target.classList.contains('submit')){
		var videoTitle = e.target.parentNode.children[0].innerHTML;
		var videoUrl = e.target.parentNode.children[1].src
		

		$.ajax(BACKEND_URL + 'newVideo' , {
			method: 'POST',
			data: {
				title: videoTitle,
				url: videoUrl,
				coords: coords
			}
		}).done(function(data){
			console.log(data);
		})
	}
})

// grabs all things in DB
var getNearbyVideos = function() {
	console.log("getNearbyVideos");
	$.ajax({
		url: BACKEND_URL + 'videos/' + coords.lat + "/" + coords.lng
	}).done(function(data) {
		for (var i = 0; i < data.length; i++) {
			console.log(data.length)
			var playedNearHereWrap = $('.played-near-here');

			playedNearHereWrap.append(`
				<div class="near-here-item">
				<h2>${data[i].title}</h2>
				<iframe class="video w100" width="100" height="100" src="${data[i].url}" frameborder="0" allowfullscreen></iframe>
				</div>
				`);
		}
	});
}

$(document).one("first-geoupdate", getNearbyVideos)



$('.submit').on('click', function(){

})
$('.submit').on('click', function(){

})
$('.submit').on('click', function(){

})

