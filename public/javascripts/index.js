// handles the login form
function submitLoginForm()
{
    var loginName = $("#login-name").val();
    $.ajax({ // make an AJAX request
        type: "POST",
        url: "/loginUser", // it's the URL of your component B
        data: {"user":loginName}, // serializes the form's elements
        success: function(data)
        {
            if(data === "no_errors")
            {
                   location.reload();
            }
            else
                 $("#alertUserNonExisting").show();

        }
    });
}

// logs out the user and delete the object in the session
function logOut()
{
    console.log("Log out")
    $.ajax({ // make an AJAX request
        type: "GET",
        url: "/logout", // it's the URL of your component B
        success: function(data)
        {
            window.location = "/";

        }
    });
}