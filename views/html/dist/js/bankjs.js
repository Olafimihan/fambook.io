



data_socket_transporter.emit('get banks list', {api_key: localStorage.getItem('SSH_KEY')});

data_socket_transporter.on('get banks list', (data)=>{
  var str="<table class='table table-bordered' >"

  data.forEach((recs)=>{
      str += "<tr><td>" + recs.bank_name + "</td><td>" + recs.address + "</td><td><button class='btn btn-primary' id='"+recs.banks_id+"' onclick='editter(this.id)' ><i class='fa fa-edit' ></i></button></td><td><button class='btn btn-primary' id='"+recs.banks_id+"' onclick='deleter(this.id)' ><i class='fa fa-trash' ></i></button></td></tr>"
  })

  str += "</table>"; 
//   console.log(data)
  $("#banklist").html(str); 

})

function editter(id){
    // alert(id)
    $("#upd").attr('disabled', false)
    $("#sub").attr('disabled', true)
    
    data_socket_transporter.emit('editbanks', id)
    data_socket_transporter.on('editbanks', (resultSet) => {
        console.log(resultSet)

        $("#bank_id").val(resultSet[0].banks_id);
        $("#bankname").val(resultSet[0].bank_name);
        $("#address").val(resultSet[0].address);

    })
}

function deleter(id){
  // alert('My ID: '+id)
    data_socket_transporter.emit('deletebank', id);
    data_socket_transporter.on('deletebank', (responseObj) => {
        
        console.log(responseObj);

        if(responseObj.affectedRows>0){
            data_socket_transporter.emit('get banks list', {api_key: localStorage.getItem('SSH_KEY')});
        }else{
            console.log(responseObj) //Manage error rendering with sweet alerts timer display [Boot strap I suppose]. 
        }
      // console.log(responseObj)
  });

}

function saveData(){
    let bankname =$("#bankname").val();
    
    let address   =$("#address").val(); 
    let api_key  =localStorage.getItem('SSH_KEY')

    var outData = {
        bankname: bankname, address: address, api_key: api_key
    }

    data_socket_transporter.emit('savebank', outData);
    data_socket_transporter.on('savebank', (responseObj) => {
        console.log(responseObj);

        if(responseObj.insertId > 0){
            data_socket_transporter.emit('get banks list', {api_key: localStorage.getItem('SSH_KEY')})
            $('#bankname').val('')
            $('#address').val('')
          
        }else{
            console.log(responseObj);
        }
        
    })


}
function updateData(){
    let bank_id = $("#bank_id").val();
    let name    = $("#bankname").val();
    let address = $("#address").val();
    
    var outData={
        bank_id: bank_id, bankname: name, address: address 
    }

    data_socket_transporter.emit('updatebank', outData);
    data_socket_transporter.on('updatebank', (respData) => {
        console.log(respData);

      if(respData.affectedRows > 0){
          data_socket_transporter.emit('get banks list', {api_key: localStorage.getItem('SSH_KEY')})
      } else {
          console.log(respData);
      }


    });


}