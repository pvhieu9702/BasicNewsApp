"use-strict"

var token = "6f668db0b629e80901a094e5732fefbd";


var topic = {
	"breaking-news" : "breaking-news", 
	"world"			: "world", 
	"nation"		: "nation", 
	"business"		: "business", 
	"technology"	: "technology", 
	"entertainment"	: "entertainment", 
	"sports"		: "sports", 
	"science"		: "science",
	"health"		: "health"
};
var lang = {
	"Arabic" 		: "ar",
	"German" 		: "de",
	"Greek" 		: "el",
	"English" 		: "en",
	"Spanish" 		: "es",
	"French" 		: "fr",
	"Hebrew" 		: "he",
	"Hindi" 		: "hi",
	"Italian" 		: "it",
	"Japanese" 		: "ja",
	"Malayalam" 	: "ml",
	"Marathi" 		: "mr",
	"Dutch" 		: "nl",
	"Norwegian" 	: "no",
	"Portuguese" 	: "pt",
	"Romanian" 		: "ro",
	"Russian" 		: "ru",
	"Swedish" 		: "sv",
	"Tamil" 		: "ta",
	"Telugu" 		: "te",
	"Ukrainian" 	: "uk",
	"Chinese" 		: "zh"
}
var country = {
	"Australia" 			: "au",
	"Brazil" 				: "br",
	"Canada" 				: "ca",
	"Switzerland" 			: "ch",
	"China" 				: "cn",
	"Germany" 				: "de",
	"Egypt" 				: "eg",
	"Spain" 				: "es",
	"France" 				: "fr",
	"United Kingdom"		: "gb",
	"Greece" 				: "gr",
	"Hong Kong" 			: "hk",
	"Ireland" 				: "ie",
	"Israel" 				: "il",
	"India" 				: "in",
	"Italy" 				: "it",
	"Japan" 				: "jp",
	"Netherlands" 			: "nl",
	"Norway" 				: "no",
	"Peru" 					: "pe",
	"Philippines" 			: "ph",
	"Pakistan" 				: "pk",
	"Portugal" 				: "pt",
	"Romania" 				: "ro",
	"Russian Federation" 	: "ru",
	"Sweden" 				: "se",
	"Singapore" 			: "sg",
	"Taiwan" 				: "tw",
	"Province of China"		: "tw",
	"Ukraine" 				: "ua",
	"United States" 		: "us"
}

var defaultTopic = topic["breaking-news"];
var defaultLang = lang["English"];
var defaultCountry = country["United States"];

$(document).ready(function () {
	// Add choose  to selector
	loadSelect("#topic-selector",topic);
	loadSelect("#lang-selector",lang);
	loadSelect("#country-selector",country);

	// Load click function in Search button
	$("#search-submit").click(function () { 
		searchNews();		
	});

	// Load heading news in first time
	let defaultURL = "https://gnews.io/api/v4/top-headlines?";
	defaultURL += "topic=" + defaultTopic;
	defaultURL += "&lang=" + defaultLang;
	defaultURL += "&country=" + defaultCountry
	defaultURL += "&token=" + token;
	requestAjax(defaultURL);
});

/**
 * Search function
 */
function searchNews() {
	let keywords 	= document.getElementById("keyword").value;
	let topic		= document.getElementById("topic-selector").value;
	let lang		= document.getElementById("lang-selector").value;
	let country		= document.getElementById("country-selector").value;
	let from		= document.getElementById("date-from").value;
	let to			= document.getElementById("date-to").value;

	// Check keyword input filled
	if(keywords == "") {
		alert("Bạn chưa điền nội dung cần tìm kiếm.");
		document.getElementById("keyword").focus();
	}
		
	else {
		let searchURL = "https://gnews.io/api/v4/search?";
		searchURL += "q=" + keywords;
		//Check topic, lang, country, from, to filled
		if(topic != "")
			searchURL += "&topic=" + topic;
		if(lang != "")
			searchURL += "&lang=" + lang;
		if(country != "")
			searchURL += "&country=" + country;
		if(from != "") {
			let fromDate = new Date(from);
			searchURL += "&from=" + fromDate.toISOString();
			console.log(searchURL);
		}
		if(to != "") {
			let toDate = new Date(to);
			searchURL += "&to=" + toDate.toISOString();
			console.log(searchURL);
		}

		// Clear search box value
		document.getElementById("keyword").value			= "";
		document.getElementById("topic-selector").value		= "";
		document.getElementById("lang-selector").value		= "";
		document.getElementById("country-selector").value	= "";
		document.getElementById("date-from").value			= "";
		document.getElementById("date-to").value			= "";

		// Hide modal after press Search
		$('#search-box').modal('hide');

		// Add token into URL
		searchURL += "&token=" + token;
		
		requestAjax(searchURL);
	}
};

/**
 * Ajax Request
 * @param {string} url 
 */
function requestAjax(url) {
	// Show loading element while wait ajax
	$('#loading').show();
	$.ajax({
		type: "GET",
		url: url,
		beforeSend: function(){
			// Clear news element
			let newsItem = document.getElementById('news');
			newsItem.innerHTML = "";
		},
		success: function (response) {
			// Render news
			createNews(response);
			$('#loading').hide();
		}
	});
}

/**
 * Nhập data vào các option của id được chọn
 * @param {iD Selector} id 
 * @param {Object} data 
 */
function loadSelect(id, data) {
	let selector = $(id);
	// Add first element is ""
	let element = document.createElement('option');
	element.value = "";
	element.innerHTML = "";
	selector.append(element);

	// Add all Element and value in selector
	$.each(data, function (indexInArray, valueOfElement) {
		let element = document.createElement('option');
		element.value = valueOfElement;
		element.innerHTML = indexInArray;
		selector.append(element);
	});
}

/**
 * Tạo thẻ bài báo với các thông tin lấy được dạng json
 * @param {JSON} json 
 */
function createNews(json) {
	let newsItem = document.getElementById('news');
	$.each(json.articles, function (indexInArray, valueJson) { 

		let image 	= document.createElement("img");
		setAttributes(image,{
			"class": "img-fluid",
			"src": valueJson.image
		});
		let imageDiv = document.createElement("div");
		setAttributes(imageDiv,{
			"class": "thumb-art col-xs-12 col-md-6 col-lg-5 text-center"
		});
		imageDiv.appendChild(image);

		let title 	= document.createElement("p");
		setAttributes(title,{
			"class": "title-news"
		});
		let linkTitles = document.createElement("a");
		setAttributes(linkTitles,{
			"href": valueJson.url,
			"target":"_blank"
		});
		linkTitles.innerHTML = valueJson.title;
		title.appendChild(linkTitles);

		let timeDiv 	= document.createElement("div");
		setAttributes(timeDiv,{
			"class": "content-time"
		});
		let time = document.createElement("span");
		time.innerHTML = valueJson.publishedAt.split("T")[0].replaceAll("-", "/");
		timeDiv.appendChild(time);

		let description = document.createElement("p");
		setAttributes(description,{
			"class": "description"
		});
		description.innerHTML = valueJson.description;

		let content = document.createElement("div");
		setAttributes(content,{
			"class": "content-news col-xs-12 col-md-6 col-lg-7"
		});
		content.appendChild(title);
		content.appendChild(timeDiv);
		content.appendChild(description);

		let article = document.createElement("article");
		setAttributes(article,{
			"class": "item-new row"
		});
		article.appendChild(imageDiv);
		article.appendChild(content);
		newsItem.append(article);
	});
}

/**
 * Gắn một hoặc nhiều thuộc tính vào element
 * @param {Element} el 
 * @param {Atribute} attrs 
 */
function setAttributes(el, attrs) {
	for(var key in attrs) {
		el.setAttribute(key, attrs[key]);
	}
}
