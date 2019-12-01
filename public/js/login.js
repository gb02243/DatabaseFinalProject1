$(document).ready(function(){
  var username,pass;
  $("#submit").click(function(){
    username=$("#username").val();
    pass=$("#password").val();
    /*
    * Perform some validation here.
    */
    $.post("/submit",{username:username,pass:pass},function(data){
      if(data==='done') {
        window.location.href="/admin";
      }else if (data === 'password'){
        window.location.href="/login";
        window.alert("Incorrect Password.");
      }else if(data === 'username'){
        window.location.href="/login";
        window.alert("Incorrect Username.");
      }
    });
  });
});
