/**
 * jQuery Age Gate v1.0.0
 *
 * Simple age verification, "age gate", plugin required by some content providers.
 * Supports Cookies when used with https://github.com/carhartl/jquery-cookie
 * https://github.com/hark/jquery-age-gate
 *
 * by Matthew Callis https://github.com/MatthewCallis
 *                   http://www.hark.com
 *
 * Useage:
 *   $('#age-restricted').agegate({
 *     age: 21,
 *     legal: function(){
 *       $('#age-restricted').empty().append('<iframe src="..."></iframe>');
 *     },
 *     underage: function(){
 *       alert("Sorry, you must be at least " + this.age + " years old in order to continue.");
 *       $('#age-restricted').empty();
 *     }
 *   });
 *
 * Released under the GPLv2 license, http://www.gnu.org/licenses/gpl-2.0.html
 */
(function($){
  $.fn.agegate = function(options){
    var cookie_js = (typeof $.cookie !== "undefined");
    return this.each(function(){
      var o = $.extend({}, $.fn.agegate.defaults, options);

      // If the age_gate cookie is set, use it.
      if(cookie_js && $.cookie('age_gate') !== null){
        if($.cookie('age_gate') === 'underage'){
          o.underage();
          return;
        }
        else if($.cookie('age_gate') === 'legal'){
          o.legal();
          return;
        }
        else{
          // Invalid Cookie, delete it.
          $.cookie('age_gate', null);
        }
      }

      // Build the container and inputs
     
	   var gate = $('<div/>').attr({ 'id': o.container_id });
      var title = $('<strong class="title"/>').text(o.title);
	  
  
	    var province = $('<select/>').attr({ 'id': 'agegate-province', 'name': 'agegate-province' }).append(function(){
			var provinces = '';
			   provinces += '<option value="-1">Province/Territory</option>';
			  provinces += '<option value="18">Alberta</option> ';
			   provinces += '<option value="19">British Columbia</option>';
			    provinces += '<option value="18">Manitoba</option>';
				 provinces += '<option value="19">New Brunswick</option>';
				  provinces += '<option value="19">Newfoundland and Labrador</option>';
				   provinces += '<option value="19">Northwest Territories</option>';
				    provinces += '<option value="19">Nova Scotia</option>';
					 provinces += '<option value="19">Nunavut</option>';
					  provinces += '<option value="19">Ontario</option>';
					   provinces += '<option value="19">Prince Edward Island</option>';
					    provinces += '<option value="18">Québec</option>';
						 provinces += '<option value="19">Saskatchewan</option>';
						  provinces += '<option value="19">Yukon</option>';
			return provinces;
		  });
	  
      var day = $('<select/>').attr({ 'id': 'agegate-day', 'name': 'agegate-day' }).append(function(){
        var days = '';
         days += '<option value="-1">Day</option>';
		for(var i = 1; i < 32; i++){
          days += '<option value="'+i+'">'+i+'</option>';
        }
        return days;
      });

      var month = $('<select/>').attr({ 'id': 'agegate-month', 'name': 'agegate-month' }).append(function(){
        var months = '';
       	 months += '<option value="-1">Month</option>';
	    for(var i = 0; i < 12; i++){
          months += '<option value="'+i+'">' + o.month_names[i] + '</option>';
        }
        return months;
      });

      var year = $('<select/>').attr({ 'id': 'agegate-year', 'name': 'agegate-year' }).append(function(){
        var years = '';
        years += '<option value="-1">Year</option>';
		for(var i = 2015; i > 1900; i--){
          years += '<option value="'+i+'">' + i + '</option>';
        }
        return years;
      });

      var verify = $('<input/>').attr({ 'type': 'submit', 'id': 'verify', 'name': 'verify', 'value': o.verify_text, 'class': o.verify_class });
      verify.bind('click', function(){
		  var flag=true;
		  $("#age-gate .selectboxit-container.selectboxit-container").removeClass("error");
		  $("#age-gate .selectboxit-container.selectboxit-container .valid").remove();
		  $("#age-gate select").each(function(){
				if($(this).val()==-1){
					if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
						$(this).addClass("error");
						$(this).before("<strong class='valid'>This field is required</strong>");
					}
					$(this).next(".selectboxit-container.selectboxit-container").addClass("error");
					$(this).next(".selectboxit-container.selectboxit-container").prepend("<strong class='valid'>This field is required</strong>")
					flag=false;
				}  
			})
		if(flag==false){ return false;}	
        var birthday = new Date();
        birthday.setFullYear($('#agegate-year').val(), $('#agegate-month').val(), $('#agegate-day').val());
        var today = new Date();
		o.age = $("#agegate-province").val();
        today.setFullYear(today.getFullYear() - o.age);
        if((today - birthday) < 0){
          o.underage();
          if(cookie_js){
             //$.cookie('age_gate', 'underage');
          }
        }
        else{
          o.legal();
          if(cookie_js){
            $.cookie('age_gate', 'legal');
          }
        }
      });

      var b = '<br/>';
     var header =$(".gate-header"),footer=$(".gate-footer");
	 header.show();
	 footer.show();
	  gate.append(header)	 		
	  gate.append(title)	  	 
          .append("<div class='province-firlds fields'></div>")
          .append("<div class='select-firlds fields'></div>")
          .append(verify);

	   $(this).find("#age-gate").remove();	     
	   
	  $(this).prepend(gate);
		gate.find(".province-firlds").empty().append(province)
		gate.find(".select-firlds").empty().append(month);
	    gate.find(".select-firlds").append(day)
		gate.find(".select-firlds").append(year);
		gate.wrap("<div class='over-flow'></div>"); 
		 $(this).css({"overflow": "hidden"})
		 gate.append(footer)
    });
	
	
  };

  $.fn.agegate.defaults = {
    age:            18,
    container_id:  'age-gate',
    verify_text:   'Verify',
    verify_class:  'submit',
    title:         'Age-Restricted',
    label_day:     'Day:',
    label_month:   'Month:',
    label_year:    'Year:',
    label_request: 'Your Location',
    month_names:   ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    legal: function(){},
    underage: function(){}
  };
})(jQuery);



