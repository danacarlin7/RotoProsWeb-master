$(document).ready(function() {

	//Custom Scroll Bar

	$(".articleDetails .articleDetailsWrapper .articleWrapper").mCustomScrollbar({
		axis:"x",
		theme:"dark-thick"
	});

/*	$('.menuToggle').click(function(){
		$(".mainMenu").addClass("tglMnu");
	});

	$(".closeBtn").click(function(e){
		e.preventDefault();
		$(this).parent().removeClass("tglMnu");
	});*/



	$(".newsDetails .tabWrapper #headLines .panel-group .panel").click(function(){
		$(".newsDetails .tabWrapper #headLines .panel-group .panel").removeClass("active");
		$(this).addClass("active");
	});

	$(".newsDetails .tabWrapper #clubNews .panel-group .panel").click(function(){
		$(".newsDetails .tabWrapper #clubNews .panel-group .panel").removeClass("active");
		$(this).addClass("active");
	});

	$("header .bottomHeader .rightNav > ul > .searchBtn a").click(function(e){
		e.stopPropagation();
		if ($(window).width() >= 480) {
			$("header .bottomHeader .rightNav > ul > .searchBtn .srchBar").animate({
                width: 265
            },100);
		}
		else
		{
			$("header .bottomHeader .rightNav > ul > .searchBtn .srchBar").animate({
                width: 195
            },100);
		}

	});
	$("header .bottomHeader .rightNav > ul > .searchBtn .srchBar").click(function(e){
		e.stopPropagation();
	});


	$(document).click(function (e) {
		var container = $("header .bottomHeader .rightNav > ul > .searchBtn");

    	if (!container.is(e.target))
    	{
			$("header .bottomHeader .rightNav > ul > .searchBtn .srchBar").width(0);
		}
  	});


	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		$($(e.target).attr('href'))
			.find('.owl-carousel')
			.owlCarousel('invalidate', 'width')
			.owlCarousel('update')
	});

	$('.matchDetailsSlider').owlCarousel({
		margin: 30,
		nav: true,
		loop: true,
		responsive: {
		  0: {
			items: 1
		  },
		  480: {
			items: 2
		  },
		  600: {
			items: 3
		  },
		  992: {
			items: 5
		  },
		  1200: {
			items: 8
		  }
		}
	});
	$( ".matchDetailsSlider .owl-prev").html('<img src="images/slider_lft_arow.png" alt="" />');
	$( ".matchDetailsSlider .owl-next").html('<img src="images/slider_rght_arow.png" alt="" />');


	$('.socialDetailsSlider').owlCarousel({
		items: 1,
		margin: 0,
		nav: true,
		loop: true,
		autoplay:true,
		autoplayTimeout:3000,
		autoplayHoverPause:true
	});
	$( ".socialDetailsSlider .owl-prev").html('<img src="images/social_slider_top_arow.png" alt="" />');
	$( ".socialDetailsSlider .owl-next").html('<img src="images/social_slider_bottom_arow.png" alt="" />');

	$('.latestNewsDetailsSlider').owlCarousel({
		margin: 30,
		nav: true,
		loop: true,
		responsive: {
		  0: {
			items: 1
		  },
		  480: {
			items: 2
		  },
		  600: {
			items: 3
		  },
		  992: {
			items: 4
		  },
		  1200: {
			items: 5
		  }
		}
	});
	$( ".latestNewsDetailsSlider .owl-prev").html('<img src="images/slider_lft_arow.png" alt="" />');
	$( ".latestNewsDetailsSlider .owl-next").html('<img src="images/slider_rght_arow.png" alt="" />');


/*
	$('.nSlider').owlCarousel({
		items: 1,
		margin: 0,
		nav: true,
		loop: true,
		autoplay:true,
		autoplayTimeout:3000,
		autoplayHoverPause:true
	});

	$( ".nSlider .owl-prev").html('<i class="icnWrapperS"><img src="images/blkArowLft.png" alt="" class="img-responsive"></i><span>Previous</span>');
	$( ".nSlider .owl-next").html('<i class="icnWrapperS">Next</i><span><img src="images/blkArow.png" alt="" class="img-responsive"></span>');
*/


	/*$('.midSlider').owlCarousel({
		items: 1,
		margin: 20,
		nav: true,
		loop: true,
		autoplay:true,
		autoplayTimeout:3000,
		autoplayHoverPause:true,
		responsive: {
		  0: {
			items: 1
		  },
		  600: {
			items: 2
		  }
		}
	});

	$( ".midSlider .owl-prev").html('<i class="icnWrapperS"><img src="images/blkArowLft.png" alt="" class="img-responsive"></i><span>Previous</span>');
	$( ".midSlider .owl-next").html('<i class="icnWrapperS">Next</i><span><img src="images/blkArow.png" alt="" class="img-responsive"></span>');
	*/
	$(".clseBtn").click(function(){
		$(this).parent().hide();
	});

	$(".clrAll").click(function(){
		$(".curntFilters").hide();
	});

	$(".mainTab > .tab > ul > li > a").on("click", function(e){
		 e.preventDefault();
		 var openTab = $(this).attr("href");
		 $(".mainTab .tabcontent").hide(0);
		 $(openTab).show(0);
		 $(".mainTab > .tab > ul > li > a").removeClass("active");
		 $(this).addClass("active");
	 });

	$(".signupRghtWrapper .mainTab .tabcontent .signUpPakges li input").click(function(){
		if($(".signupRghtWrapper .mainTab .tabcontent .signUpPakges li input").is(':checked'))
		{
			$(".signupRghtWrapper .mainTab .tabcontent .signUpPakges li").removeClass('pkgeactive');
			$(this).parent().addClass('pkgeactive');

		}
	});

	/* Same height */

	$(window).resize(function(){
		var cirWidth=$('.profitByCatRght > ul > li').width();
		$('.profitByCatRght > ul > li').height(cirWidth);
	}).trigger('resize');

	/* Same Height Ends */

	/* Top filter fixed js Starts */

	var $window = $(window).on('resize', function(){
		if ($(window).width() >= 992)
		{
			$(window).scroll(function(){
			  var sticky = $('.topFiltrWrapper'),
				  scroll = $(window).scrollTop();

			  if (scroll >= 190)
			  {
				  sticky.addClass('fixedDash');
				  $(".fixdPad").css("padding-top","80px");
			  }
			  else
			  {
				  sticky.removeClass('fixedDash');
				  $(".fixdPad").css("padding-top","0px");
			  }
			});
		}
	}).trigger('resize');

	/* Top filter fixed js Ends */

	/* Dashboard filter dropdown */

	$(window).click(function(e) {
		$(".dropdownSelect > .dropdownSelectMenu").hide();
	});

	$(".dropdownSelect > .dropdownSelectClick").click(function(e){
		e.stopPropagation();
		if($(".dropdownSelect > .dropdownSelectMenu").hasClass("activeSelectMenu"))
		{
			$(".dropdownSelect > .dropdownSelectMenu").hide();
			$(".dropdownSelect > .dropdownSelectMenu").removeClass("activeSelectMenu");
		}
		if($(this).next().hasClass("activeSelectMenu"))
		{
			$(this).next().removeClass("activeSelectMenu");
			$(this).next().hide();
		}
		else
		{

			$(this).next().show();
			$(this).next().addClass("activeSelectMenu");
		}

	});

	$(".dropdownSelect > .dropdownSelectMenu > li > a").click(function(){

		var slctTxt= $(this).text();
		$(this).parents(".dropdownSelectMenu").siblings(".dropdownSelectClick").text(slctTxt);
	});

	/* Dashboard filter dropdown */

	function toggleIcon(e) {
		$(e.target)
			.prev('.panel-heading')
			.find(".more-less")
			.toggleClass('glyphicon-plus glyphicon-minus');
	}
	$('.panel-group').on('hidden.bs.collapse', toggleIcon);
	$('.panel-group').on('shown.bs.collapse', toggleIcon);


	/* Date Picker JS */

	$('.datepicker').datepicker({
		changeMonth: true,
		 changeYear: true,
		 beforeShow: function (textbox, instance) {
		 instance.dpDiv.css({
		 marginLeft: textbox.offsetWidth+ (-228) + 'px'
	  });
	 }
   });

	/* Date Picker Ends */

	$(".linUpSection .tFormat table tr.dtSubs").click(function(){
		$(this).prev(".subsHide").find(".subsHideTbl").css("display", "block");
	});



});
