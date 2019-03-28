
var usernames={a:"a"};
var divElements = ["welcome","logIn","game","setup","register"];
var currentDiv = "welcome";

//is just jQuery short-hand for $(document).ready(function() { ... });
$(function() {
	$.validator.addMethod("notNumbers", function(value, element, regexpr) {
     var numbr = /\d/;
     return !numbr.test(value);
    }, "containing number.");
	
	$.validator.addMethod("passwordValid", function(value, element, regexpr) {
     var numbr = /\d/;
	 var letter=/[a-zA-Z]/
     return numbr.test(value) && letter.test(value);
    }, "Password should contains numbers and letters.");
    //
    $.validator.addMethod("dateInserted", function(value, element, regexpr) {
        if(value === "")
            return false;
        return true;
    }, "Please insert a full birth date.");


    $.validator.addMethod("hasRegister", function(value, element, regexpr) {
        if ((value in usernames) == false)
        {
            return true; // username is free
        }
            return false; // username is taken

    }, "username already exists.");
	
	
  // Initialize form validation on the registration form. It has the name attribute "registration"
    $("form[name='reg']").validate({
    // Specify validation rules
        rules: {
            firstname: { required: true,
                       notNumbers: true
            },
            lastname: { required: true,
                       notNumbers: true
            },
            username:{ required:true,
					   hasRegister:true
            },
            datePicker: "dateInserted",
            email: { required: true,
					 email: true
            },
            pwd: {  required: true,
					passwordValid:true,
					minlength: 8
            }

        },
        errorElement: "div",
        wrapper: "div",
        errorPlacement: function(error, element) {
                offset = element.offset();
                error.insertBefore(element);
                error.addClass('message');  // add a class to the wrapper
                error.css('position', 'absolute');
                error.css('left', offset.left + element.outerWidth());
                error.css('top', offset.top);
        },

        // Specify validation error messages
        messages: {
          firstname: {
            required: "Please enter your first name",
            notContainingNumbers: "firstnamne number",
              hasRegister: "The user name is already exist."
          },
          lastname: "Please enter your last name",
          password: {
            required: "Please provide a password",
            minlength: "Your password must be at least 8 characters long"
         },
          email: "Please enter a valid email address"
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function(form) {
           // form.submit();
            submitUserName(form);
            display("logIn");
        }

    });

});


function display(div) {

    if(currentDiv == "game" && div != "game")
    {
        exitGame();
    }
    for (var i = 0; i < divElements.length; i++)
    {
       if(divElements[i] == div) {
           document.getElementById(divElements[i]).style.display = "block";
           currentDiv = div;
       }
       else
           document.getElementById(divElements[i]).style.display="none";
    }

}


function submitUserName(form)
{

    usernames[form[0].value]=form[1].value;
}

function logIn()
{
    var usernameToCheck=document.getElementById("logInName").value;
    var pwdToCheck=document.getElementById("pwdInName").value;
    if(usernameToCheck in usernames){
        if(usernames[usernameToCheck]==pwdToCheck){
            display("setup");
            document.getElementById("userNameDisplay").innerText = usernameToCheck;
        }
        else{
            alert("wrong password!");
        }
    }
    else
        alert("wrong username!");

}



$(function() {
    $.validator.addMethod("notValidNumber", function(value, element, regexpr) {
        if (value == parseInt(value, 10))
            return true;
        return false;
    }, "Not a valid number.");
    $.validator.addMethod("ballsAmount", function(value, element, regexpr) {
            if(value >= 60 && value <= 90)
                return true;
            return false;
    }, "There could only be 60-90 balls.");


    $.validator.addMethod("timeAmount", function(value, element, regexpr) {
        if(value < 60)
            return false;
        return true;
    }, "Not a valid time setup.");

    $.validator.addMethod("monsterAmount", function(value, element, regexpr) {
        if(value >0  && value <4)
            return true;
        return false;

    }, "There could only be 1-3 monsters.");
	

    $("form[name='setupForm']").validate({
        // Specify validation rules
        rules: {
            numBalls: { required: true,
						notValidNumber: true,
						ballsAmount: true
            },
            timeAmount: { required: true,
						  notValidNumber: true,
                          timeAmount: true
            },
            numMonsters:{ required:true,
                          notValidNumber:true,
                          monsterAmount: true
            },

        },
        errorElement: "div",
        wrapper: "div",
        errorPlacement: function(error, element) {
            offset = element.offset();
            error.insertBefore(element)
            error.addClass('message');  // add a class to the wrapper
            error.css('position', 'absolute');
            error.css('left', offset.left + element.outerWidth());
            error.css('top', offset.top);
        },
        // Specify validation error messages
        messages: {
            numBalls: {
                required: "Please enter number of balls",
                notValidNumber: "Not a valid number",
                ballsAmount: "Number of balls must be between 60 and 90"
            },
            timeAmount: {
                required: "Please enter time amount",
                notValidNumber: "Not a valid number",
                timeAmount: "Time not in range"
            },
            numMonster: {
                required: "Please enter number of monsters",
                notValidNumber: "Not a valid number",
                monsterAmount: "Number of monsters must be between 1 and 3"
            },
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function(form) {
            setup();
            newGame();
            display("game");
        }

    });

});



window.addEventListener("load", modalOpener, false);

function modalOpener(){

    var modal = document.getElementById('about');

    var btn = document.getElementById("aboutButton");

    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}


