// determin whether to show login box or not
function showlogin()
{
  if ($(".loginbox").is(":visible"))
      $( ".loginbox" ).hide();
    else
      $( ".loginbox" ).show();
}

// store Account info local at client
function storeAccountInfo()
{
    sessionStorage.setItem("login", $('#login').val());
    loadBody(); // check buttons
}


// logout the user and enable login button and disable logout button
function logoutUser()
{
  //local
  sessionStorage.log = null;
  delete sessionStorage.login;
  loadBody();

}


// determine which buttons to show and hide
function loadBody()
{

  if(sessionStorage.login)
  {
      $( ".login" ).hide();
      $( ".logout" ).show();

      $('#currentLogin').text("Logged in as: "+ sessionStorage.login); // show loged in user

      console.log("Current user set:"+sessionStorage.login);
  }
  else
  {
          $( ".login" ).show();
          $( ".logout" ).hide();

       $('#currentLogin').text(""); // hide

      console.log("Current user NOT set:" + sessionStorage.login);
  }
}

// Show Create or Search Div
function choiceMade(value)
{

switch (value)
{
case 0:
    console.log("Show Create Resource");
     $( "#createCompDiv" ).show();
  break;
case 1:
    console.log("Show Search Resource");
         $( "#createCompDiv" ).hide();

  break;

}

}



