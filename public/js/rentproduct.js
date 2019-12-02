$(document).ready(function(){
  var rentpid;
  $("#rent").click(function(){
    rentpid=$("#rentpid").val();
    $.post("/rent",{rentpid:rentpid},function(data){
      }
    });
  });
});
