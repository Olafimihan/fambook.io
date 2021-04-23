
$(function(){
    
    $("#example1").DataTable({
      "responsive": true,
      "autoWidth": false,
    });

    $('#search').keydown(function(evt){
      var keypressed = evt.key
      var keyCode    = evt.keyCode

      // alert(keypressed)
      // alert(keyCode)


    })
})

 
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
          }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
      }
  }
}

data_socket_transporter.emit('get drugs list', {api_key: localStorage.getItem('SSH_KEY')});

data_socket_transporter.on('get drugs list', (data) => {
    var str="<table class='table table-bordered' >"

    data.forEach((recs)=>{
        str += "<tr><td style='font-weight: normal; font-size: 12px'>" + recs.description + "</td><td style='font-weight: normal; font-size: 12px'>" + recs.amount.toFixed(2) + "</td><td  style='font-weight: normal; font-size: 12px'><button class='btn btn-primary' id='"+recs.goods_id+"' onclick='editter(this.id)' ><i class='fa fa-edit' ></i></button><button class='btn btn-danger' id='"+recs.goods_id+"' onclick='deleter(this.id)' ><i class='fa fa-trash' ></i></button></td></tr>"
    })

    str += "</table>";

    // console.log(data)
    $("#druglist").html(str);

})

function deleter(id){
    // alert('My ID: '+id)
    data_socket_transporter.emit('deletedrug', id);
    data_socket_transporter.on('deletedrug', (responseObj) => {

        if(responseObj.affectedRows>0){
            data_socket_transporter.emit('get drugs list', {api_key: localStorage.getItem('SSH_KEY')});
        }else{
            console.log(responseObj) //Manage error rendering with sweet alerts timer display [Boot strap I suppose]. 
        }

        // console.log(responseObj)
    });

}


function editter(id){
    // alert(id)
    $("#upd").attr('disabled', false);
    $("#sub").attr('disabled', true);
    data_socket_transporter.emit('editdrugs', id);
    data_socket_transporter.on('editdrugs', (resultSet) => {
        $("#good_id").val(resultSet[0].goods_id);
        $("#drugname").val(resultSet[0].description);
        $("#cost").val(resultSet[0].amount);

    })
}

function saveData(){
    let name    = $("#drugname").val();
    let prc     = $("#cost").val(); 
    let api_key = localStorage.getItem('SSH_KEY');
    var outData = {
      drugname: name, cost: prc, api_key: api_key 
    }

    data_socket_transporter.emit('savedrugs', outData)
    data_socket_transporter.on('savedrugs', (responseObj) => {
      if(responseObj.affectedRows > 0){
        data_socket_transporter.emit('get drugs list', {api_key: localStorage.getItem('SSH_KEY')});
      } 
    })
}

function updateData(){
    let id = $("#good_id").val();
    let name = $("#drugname").val();
    let prc = $("#cost").val();
     
    var outData={
      drugname: name, cost: prc, id: id 
    }
 
    data_socket_transporter.emit('updatedrug', outData);
    data_socket_transporter.on('updatedrug', (inData)=>{
      if(inData.affectedRows > 0){
        data_socket_transporter.emit('get drugs list', {api_key: localStorage.getItem('SSH_KEY')});
      }
    });


}

 