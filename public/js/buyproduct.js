$(document).ready(function(){
  var buypid;
  $("#buy").click(function(){
    buypid=$("#buypid").val();
    $.post("/buy",{buypid:buypid},function(data){
      }
    });
  });
});
