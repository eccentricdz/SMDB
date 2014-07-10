// JavaScript Document
var bmdb = (function(){
		var config = {
			$search : $('#query'),
			$suggest : $('#suggestions'),
			apikey : 'efa6b06f204ada216993bedf47cf1d02',
			currentLink : -1,
			resno : 0,
			baseUrl : "",
			gotConfig : false,
			gotDetails : false
	}
	function init(){
			getConfig();
		if(config.gotConfig)
		{
		$('#suggestions').delegate('li.query', 'mouseover', function(){
			$(this).siblings('.active').removeClass('active');
			$(this).addClass('active');
			config.currentLink = $(this).index();
			});
			$('#suggestions').delegate('li.query', 'click', function(){
				//$(this).removeClass('active');
			display($(this), $(this).attr('type'), $(this).attr('id'));
			});
		$('#suggestions').delegate('a.castlink','click',function(){
			subDisplay($(this));
		});
		$('#query').on('keyup',function(event){
			if(!(event.which==38||event.which==40||event.which==13))
			{
				config.currentLink = -1;
					var query = String($(this).val()).toLowerCase();
			var len = query.length;
			var xhr2 = new XMLHttpRequest();
			var xhr = new XMLHttpRequest();
			
			xhr.open("GET","http://api.themoviedb.org/3/search/movie?api_key="+config.apikey+"&query="+query+"&search_type=ngram");
			xhr2.open("GET","http://api.themoviedb.org/3/search/person?api_key="+config.apikey+"&query="+query+"&search_type=ngram");
			xhr.setRequestHeader("Accept", "application/json");
				xhr2.setRequestHeader("Accept", "application/json");
			xhr.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200 && xhr2.readyState == 4 && xhr2.status == 200) {
	 var movies = JSON.parse(this.responseText);
	 var persons = JSON.parse(xhr2.responseText);
	 $('#suggestions').html('');
	
	 
	 for(var i=0;i<(movies.results.length);i++)
	 {
		 var title = movies.results[i].title.toLowerCase();
		 var date = movies.results[i].release_date.substring(0,4);
		 if(query.indexOf(title.substr(0,len))==0)
		 {
	 var newsuggest = $("<li class='movie query' type='movie' id='"+movies.results[i].id+"'>"+title+" - "+date+"<i class='icon-film pull-right'></i></li>");
	 $('#suggestions').append(newsuggest);
		 }}
		  for(var i=0;i<(persons.results.length);i++)
	 {
		 var title = persons.results[i].name.toLowerCase();
		 if(query.indexOf(title.substr(0,len))==0)
		 {
	 var newsuggest = $("<li class='person query' type='person' id='"+persons.results[i].id+"'>"+title+"<i class='icon-user pull-right'></i></li>");
	 $('#suggestions').append(newsuggest);
		 }}
		 $('#suggestions li.query').first().addClass('active');
		 config.currentLink = 0;
		 config.resno = $('#suggestions li.query').last().index();
  }
			};
			xhr2.send(null);
			xhr.send(null);
			}
			});
			$(document).on('keydown',function(event){
				if(!(config.currentLink==-1))
				{
				if(event.which==38)
			{
				
				if(!(config.currentLink==0))
				{$('#query').blur();
					$('#suggestions li.active').removeClass('active');
					if(config.currentLink>0)
					config.currentLink = config.currentLink-1;
					$('#suggestions li.query').eq(config.currentLink).addClass('active');
				}
			}
			else if(event.which==40)
			{
				$('#query').blur();
					$('#suggestions li.active').removeClass('active');
						config.currentLink = (config.currentLink+1)%(config.resno+1);
												$('#suggestions li.query').eq(config.currentLink).addClass('active');
				
			}
			else if(event.which == 13)
		{
			var active = $('#suggestions li.query').eq(config.currentLink);
			//active.removeClass('active');
			display(active, active.attr('type'), active.attr('id'));
			}
				}
			});
			
	}
	}
	function getConfig()
	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET","http://api.themoviedb.org/3/configuration?api_key="+config.apikey,false);
		xhr.setRequestHeader("Accept", "application/json");
		xhr.onreadystatechange = function () {
			if(this.readyState == 4 && this.status == 200)
			{
				var res = JSON.parse(this.responseText);
				config.baseUrl = res.images.base_url; 
				config.gotConfig = true;
				}
			}
			xhr.send(null);
	}
	function display(active, type, id)
	{setLoading(active);
		var subcontent = $("<div id='subcontent'></div>");
		config.currentId = id;
		var details = getDetails(type, id);
		if(config.gotDetails)
		{
			 config.gotDetails = false;
		$('#suggestions div.content').remove();
		var content = $("<div id='content' class='content "+type+"'></li>");
		content.css({
			width : screen.availWidth,
			height: window.innerHeight,
			position : 'relative',
			//boxSizing : 'border-box',
			//overflow: 'scroll'
		});
		if(type=='movie')
		{
			var gen = "";
		var imglink = config.baseUrl+"original"+details.poster_path;
		var head = $("<h2 id='head'>"+details.title+"</h2>");
		for(var i=0;i<(details.genres.length);i++)
		gen = gen+" / "+details.genres[i].name;
		gen = gen.substring(3);
		var genres = $("<p id='genres'>"+gen+"</p>");
		var rating = $("<p id='rating'>"+details.vote_average+"</p>");
		var date = $("<p id='date'><i class='icon-calendar'></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+details.release_date.substring(8,10)+"&nbsp;"+getMnth(details.release_date.substring(5,7))+"&nbsp;"+details.release_date.substring(0,4)+"</p>");
		var overview = $("<p id='overview'>"+details.overview+"</p>");
		var count = $("<p id='count'>(&nbsp;&nbsp;"+details.vote_count+"&nbsp;&nbsp;&nbsp;users&nbsp;&nbsp;)</p>");
		var source = getTrailer(id);
		if(source!=-1)
		var trailer = $("<iframe width='100%' height='350px'id='trailer' src='http://www.youtube.com/embed/"+source+"'></iframe>");
		else
		var trailer = null;
		
		var cast = getCast(id);
		if(cast!=-1)
		{
			var castlist = $("<ul id='castlist'></ul>");
			for(var i=0;i<cast.cast.length;i++)
			{
				var newcast = $("<li><a id="+cast.cast[i].id+" href='#javascript' class='castlink' ><b>"+cast.cast[i].name+"</b></a>&nbsp;&nbsp;as&nbsp;&nbsp;<span id='character'><i>"+cast.cast[i].character+"</i></span></li>");
				castlist.append(newcast);
			}
		}
		else
		var castlist = null;
		
		subcontent.append(head).append(genres).append(date).append(overview).append(rating).append(count).append(trailer).append(castlist);
		}
		else
		{
		var imglink = config.baseUrl+"original"+details.profile_path;
		var head = $("<h2 id='head'>"+details.name+"</h2>");
		var genres = $("<p id='genres'>"+details.place_of_birth+"</p>");
		var date = $("<p id='date'><i class='icon-calendar'></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+details.birthday.substring(8,10)+"&nbsp;"+getMnth(details.birthday.substring(5,7))+"&nbsp;"+details.birthday.substring(0,4)+"</p>");
		var overview = $("<p id='overview'>"+details.biography+"</p>");
		subcontent.append(head).append(genres).append(date).append(overview);
		}
		var bdrop = $("<div id='bdrop'></div>");
		bdrop.css({
			background : 'url('+imglink+')',
			backgroundSize : 'cover',
		});
		content.append(bdrop);
		content.append(subcontent);
		
		active.after(content);
		$('#suggestions div.content').css('left',-((window.innerWidth-550)/2)).hide();
		setTimeout(function(){
			$('#suggestions div.content').slideDown(1500,function(){
			scrollAnim(content.offset().top); 
		resetLoading(active, type);
		});
		}, 1500);
			
		
		
		}
	}
	function scrollAnim(pos)
	{
		$('body, html').animate({
			scrollTop : pos
		}, 1000);
	}
	
	function getDetails(type, id)
	{var res;
		var details = new XMLHttpRequest();
		details.open("GET","http://api.themoviedb.org/3/"+type+"/"+id+"?api_key="+config.apikey, false);
		details.setRequestHeader("Accept", "application/json");
		details.onreadystatechange = function () {
			if(this.readyState == 4 && this.status == 200)
			{
				
				res = JSON.parse(this.responseText);
				config.gotDetails = true;
				
				}
			}
			details.send(null);
			return res;
	}
	function getTrailer(id)
	{var res;
		var details = new XMLHttpRequest();
		details.open("GET","http://api.themoviedb.org/3/movie/"+id+"/trailers?api_key="+config.apikey, false);
		details.setRequestHeader("Accept", "application/json");
		details.onreadystatechange = function () {
			if(this.readyState == 4 && this.status == 200)
			{
				
				res = JSON.parse(this.responseText);
				
				}
			}
			details.send(null);
			if(res.youtube[0])
			return res.youtube[0].source;
			else
			return -1;
	}
	
	function getCast(id)
	{var res;
		var details = new XMLHttpRequest();
		details.open("GET","http://api.themoviedb.org/3/movie/"+id+"/casts?api_key="+config.apikey, false);
		details.setRequestHeader("Accept", "application/json");
		details.onreadystatechange = function () {
			if(this.readyState == 4 && this.status == 200)
			{
				
				res = JSON.parse(this.responseText);
				
				}
			}
			details.send(null);
			if(res.cast[0])
			{
			return res;
			}
			else
			return -1;
	}
	
	function getMnth(mnth)
	{
		mnth = parseInt(mnth)-1;
		var month=new Array();
month[0]="January";
month[1]="February";
month[2]="March";
month[3]="April";
month[4]="May";
month[5]="June";
month[6]="July";
month[7]="August";
month[8]="September";
month[9]="October";
month[10]="November";
month[11]="December";
return month[mnth];
	}
	
	function setLoading($li)
	{
		$li.find('i').removeClass().addClass('icon-refresh').addClass('icon-spin').addClass('pull-right');
	}
	function resetLoading($li, type)
	{
		if(type=='movie')
		$li.find('i').removeClass().addClass('icon-film').addClass('pull-right');
		else
			$li.find('i').removeClass().addClass('icon-user').addClass('pull-right');
	}
	
	function subDisplay($cast)
	{
		if($cast.hasClass('profiledis'))
		{
			$cast.removeClass('profiledis');
			$cast.parent().css('color','#FDEEE3').next('img').remove();
		}
		else
		{
		var details = getDetails('person', $cast.attr('id'));
		if(config.gotDetails)
		{ 
			config.gotDetails = false;
			if(details.profile_path!=null)
			{
				$cast.addClass('profiledis');
			var imglink = config.baseUrl+"w185"+details.profile_path;
			var profileimg = $("<img class='profile' src='"+imglink+"' />");
			$cast.parent().after(profileimg).css('color','#222');
			}
			
		}
		}
	}
	return {init: init};
})();