

$("#Variability").slider();
$("#Variability").on("slide", function(slideEvt) {
	$("#VariabilitySliderVal").text(slideEvt.value + "%");
});

$("#nlp").slider();
$("#nlp").on("slide", function(slideEvt) {
	$("#nlpSliderVal").text(slideEvt.value);
});

$("#nup").slider();
$("#nup").on("slide", function(slideEvt) {
	$("#nupSliderVal").text(slideEvt.value);
});

$("#me").slider();
$("#me").on("slide", function(slideEvt) {
	$("#meSliderVal").text(slideEvt.value + "%");
});

$("#mms").slider();
$("#mms").on("slide", function(slideEvt) {
	$("#mmsSliderVal").text("$" + slideEvt.value);
});

$("#ProjectionFilter").slider();
$("#ProjectionFilter").on("slide", function(slideEvt) {
	$("#ProjectionFilterSliderVal").text(slideEvt.value);
});

$("#SalaryFilter").slider();
$("#SalaryFilter").on("slide", function(slideEvt) {
	$("#SalaryFilterSliderVal").text(slideEvt.value);
});


$("#ValueFilter").slider();
$("#ValueFilter").on("slide", function(slideEvt) {
	$("#ValueFilterSliderVal").text(slideEvt.value);
});

$("#BattingOrder").slider();
$("#BattingOrder").on("slide", function(slideEvt) {
	$("#BattingOrderSliderVal").text(slideEvt.value);
});


$(document).on('click', '.browse', function(){
  var file = $(this).parent().parent().parent().find('.file');
  file.trigger('click');
});
$(document).on('change', '.file', function(){
  $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
});

