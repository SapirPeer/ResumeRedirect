(function($){

	var selectors = {
		'scroll_buttons':'.ir__scroll-buttons',
		'resume_redirect':'#ir__resume-redirect',
		'redirect':'.ir__redirect',
		'resume':'.ir__resume',
		'find_guide_step':'.ir__find__guide__step',
		'stay_button':'#stay_on_this_page',
		'guide_steps_container':'.ir__resume__guide-steps',
		'start_over_button':'#start_it_over',
		'instructions':'.ir__resume-redirect__instruction',
		'step_button':'.ir__resume__guide-step__button',
		'guide_step':'.ir__resume__guide-step',
		'close_button':'ir__close-button'
	}
	//constants
	var DISPLAYED_GUIDE_SIZE = 420;
	var SCROLL_DURATION = 1500;
	var RESUME_CONTAINER_SIZE = 620;
	var MAX_STEP_NUM_IN_A_LINE = 7
	var STEPS_CONTAINER_MIN_SIZE = 420;
	var STEPS_CONTAINER_MIDDLE_SIZE=500;
	var STEPS_CONTAINER_MAX_SIZE=510;

	var stepsList;
	var apiName ;
	var optionStatus;
	var stepContainerInvisibleSize;
	var userSelection;

	//constructor
	ResumeRedirect=
	function(steps){
		init(steps);
	};

	function init(steps){
		var stepId;
		var closeButton = document.getElementsByClassName('ir__close-button');
		initDisplay();
		//case the user want to start the guide from the beginning;
		$(selectors.start_over_button).on('click',function(){
			userSelection = "start_over";
			//iridize('api.guide.start', {apiName:apiName});\
			minimizeWindow();
		});
		//case the user want to stay in this page 
		$(selectors.stay_button).on('click',function(){
			userSelection="stay_on_this_page";
			//increase the size of the resume window
			$('.ir__resume-redirect').addClass("maximize_window");	
			$('#resume_instructions').show();
			sortingSteps();
			displaySteps();
			scroll();
			$('.ir__resume__guide-step__button').on('click',function(){
				stepId = Number(this.value);
			//iridize('api.guide.start',{apiName:apiName, step:stepId});
			minimizeWindow();
		});	

		});
		$(selectors.find_guide_step).on('click', function(){
			maximizeWindow();
		});


		//case the user press x button.
		$(closeButton).on('click', function(){
			$(selectors.resume_redirect).hide();
		});


	};

	function scroll(){	
		//defining the arrows buttons
		var leftArrow = document.getElementsByClassName('ir__left-arrow');
		var rightArrow = document.getElementsByClassName('ir__right-arrow');
		//length of every step (step includes button + text)
		var stepLength = $(selectors.guide_step).length;
		var stepSize = $(selectors.guide_step).outerWidth(true);
		// size of the visible part of the ir__resume__guide-steps is equal as the resume container size 
		// get total width of all ir__resume__guide-steps ir__resume__guide-steps
		var getStepsContainerSize = function() {
			return stepLength * stepSize
		};
		var stepContainerSize = getStepsContainerSize();
		stepContainerInvisibleSize = stepContainerSize - RESUME_CONTAINER_SIZE  ;
		$(selectors.guide_steps_container).on('scroll', function() {
		// get how much of ir__resume__guide-steps is invisible
		stepContainerInvisibleSize = stepContainerSize - RESUME_CONTAINER_SIZE;

	});
		//the size that we scroll for exch directon
		var totalGuideStepsSize = stepContainerInvisibleSize + DISPLAYED_GUIDE_SIZE;
		$(rightArrow).on('click', function() {
			if(totalGuideStepsSize > DISPLAYED_GUIDE_SIZE){
				$(selectors.guide_steps_container).animate( { scrollLeft:'+=420'}, {duration:SCROLL_DURATION});
				$(leftArrow).show();
				document.getElementsByClassName('ir__resume__guide-steps')[0].style.width=STEPS_CONTAINER_MIN_SIZE;														 
				totalGuideStepsSize-=DISPLAYED_GUIDE_SIZE;
			}
			if(totalGuideStepsSize < DISPLAYED_GUIDE_SIZE){
				$(rightArrow).hide();
				document.getElementsByClassName('ir__resume__guide-steps')[0].style.width=STEPS_CONTAINER_MIDDLE_SIZE;														 

			}
		});
		// scroll to right
		$(leftArrow).on('click', function() {
			$(selectors.guide_steps_container).animate( { scrollLeft: '-=420' }, {duration:SCROLL_DURATION});
			totalGuideStepsSize +=DISPLAYED_GUIDE_SIZE;
			$(rightArrow).show();
			document.getElementsByClassName('ir__resume__guide-steps')[0].style.width=STEPS_CONTAINER_MIN_SIZE;														 

			if(totalGuideStepsSize>stepContainerInvisibleSize){
				$(leftArrow).hide();
				document.getElementsByClassName('ir__resume__guide-steps')[0].style.width=STEPS_CONTAINER_MAX_SIZE;														 

			}

		});
	}

	//This function maximize the window after the user as pressed the minimzed window
	function maximizeWindow(){
		$(selectors.resume).show();
		$(selectors.find_guide_step).hide();
		$(selectors.scroll_buttons).show();
		$(selectors.resume_redirect).removeClass("minimize_window");
		if(userSelection == "stay_on_this_page"){
			$(selectors.resume_redirect).addClass("maximize_window");
		}
		else{

			$(selectors.resume_redirect).addClass("mid");
//			$(selectors.resume_redirect).removeClass("maximize_window");

			console.log("else");}

		}
	//This function minimizes the window after the user has selected a specific step
	function minimizeWindow(){
		$(selectors.find_guide_step).show();
		$(selectors.scroll_buttons).hide();
		$(selectors.redirect).hide();
		$(selectors.resume).hide();
		$(selectors.resume_redirect).addClass("minimize_window");
		$(selectors.resume_redirect).removeClass("maximize_window");
		$(selectors.resume_redirect).removeClass("mid");




	}

	function displaySteps(){		
		$(selectors.stay_button).hide();
		$(selectors.guide_steps_container).show();
		$(selectors.start_over_button).addClass("fade_out");
		$(selectors.instructions).addClass("fade_out");
		//case there are more than 7 steps
		if($('.ir__resume__guide-step').length >MAX_STEP_NUM_IN_A_LINE){
			$('.ir__right-arrow').show();
			document.getElementsByClassName('ir__resume__guide-steps')[0].style.width='510px';														 
		}
	};

	function createStep(step, stepStatus){
		var newStep	;
		var stepButton;
		var stepText;
		//creating a new div for this step and assign it to the relevant class
		newStep = document.createElement('div');
		newStep.className = 'ir__resume__guide-step';
		//Define the step as a child of the new div
		document.getElementsByClassName('ir__resume__guide-steps')[0].appendChild(newStep);
		//creating a new input button for this step and define his prop
		stepButton = document.createElement('input');
		stepButton.setAttribute(stepStatus,"");
		stepButton.type = 'button';
		stepButton.className='ir__resume__guide-step__button'
		stepButton.id = "step_button_" + step.id;
		stepButton.value=step.id;
		//define the step as a child of the new step
		newStep.appendChild(stepButton);
		//creating a text for the  guide step and define his prop
		stepText =document.createElement("label");
		stepText.innerHTML = step.text;
		stepText.setAttribute("for",stepButton.id);
		stepText.className='ir__resume__guide-step__step';
		newStep.appendChild(stepText);
	};

	function sortingSteps(){	
		var step;
		var stepStatus;
		//Set the step status (enabled or disabled) and create the step by using the function createStep
		$.each(steps, function(index){
			step=steps[index];
			stepStatus="disabled";
			if(step.in_this_page == true){
				stepStatus = "enabled";
			}
			createStep(step, stepStatus);
		});
	};


	//Initializing the page view depending on the steps that exists in this page.
	function initDisplay(){
		var step;
		//check if there is at least one step for this page.
		$.each(steps,function(index){
			step=steps[index];
			if(step.in_this_page == true){
				optionStatus = "resume";
				$(selectors.resume).show();
				$(selectors.redirect).hide();
				return;
				
			}	
			//case there is no steps for this page.
			optionStatus = "redirect";
			$(selectors.resume).hide();
			$(selectors.redirect).show();

			
		});
	};

})($);
