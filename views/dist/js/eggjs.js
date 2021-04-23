
data_socket_transporter.emit('get gl sales drop down', {api_key: localStorage.getItem('SSH_KEY')});

data_socket_transporter.on('get gl sales drop down', (data)=>{

    // console.log(data)
    $("#stock_acct").html(data.val);
    $("#sales_acct").html(data.val);
    $("#cfs_acct").html(data.val);

})

data_socket_transporter.emit('get eggs list', {api_key: localStorage.getItem('SSH_KEY')});

data_socket_transporter.on('get eggs list', (data)=>{
 
    var str="<table class='table table-bordered' >"
    str+="<thead style='background-color: lightgray; font-weight: bold'><td>Description</td><td>Cost Price</td><td>Sell Price</td><td></td><td></td></thead>"

// console.log(data)
    data.forEach((recs)=>{
        str += "<tr><td>" + recs.goods_description + "</td><td>" + recs.buy_price + "</td><td>" + recs.sell_price + "</td><td><button class='btn btn-primary' id='"+recs.goods_id+"' onclick='editter(this.id)' ><i class='fa fa-edit' style='font-size: 12px' >Edit</i></button></td><td><button class='btn btn-primary' id='"+recs.goods_id+"' onclick='deleter(this.id)' ><i class='fa fa-trash' style='font-size: 12px' >Delete</i></button></td></tr>"
    })

    str += "</table>";

    // console.log(data)
    $("#egglist").html(str);

})

function editter(id){
    // alert(id)
    $("#upd").attr('disabled', false)
    $("#sub").attr('disabled', true)
    
    data_socket_transporter.emit('editeggs', id)
    data_socket_transporter.on('editeggs', (resultSet)=>{
        // console.log(resultSet)

        $("#good_id").val(resultSet[0].goods_id);
        $("#eggname").val(resultSet[0].goods_description);
        $("#cost").val(resultSet[0].buy_price);
        $("#price").val(resultSet[0].sell_price);
        
        $("#balance").val(resultSet[0].balance);
        // $("#stock_acct").val(resultSet[0].account_id);
        // $("#sales_acct").val(resultSet[0].account_id_sell);
        // $("#cfs_acct").val(resultSet[0].account_id_cfs);

        // $("#bday").val(resultSet[0].birthdate);
 
    })
}

function deleter(id){
    data_socket_transporter.emit('deleteegg', id);
    data_socket_transporter.on('deleteegg', (responseObject)=>{
        // console.log(responseObject)
        if(responseObject.affectedRows>0){
            data_socket_transporter.emit('get eggs list', {api_key: localStorage.getItem('SSH_KEY')});
        }else{
            console.log(responseObject);
        }
    })
}

function saveData(){
    let name = $("#eggname").val();
     
    let price = $("#price").val();
     
    let api_key = localStorage.getItem('SSH_KEY');

    var outData={
        eggname: name, price: price, api_key: api_key 
    }

    data_socket_transporter.emit('saveeggs', outData)
    data_socket_transporter.on('saveeggs', (responseObj)=>{
        data_socket_transporter.emit('get eggs list', {api_key: localStorage.getItem('SSH_KEY')})
        // alert(responseObj.insertId)
    })

}

function updateData(){
    let itemid = $("#good_id").val();
    let name = $("#eggname").val();
    let price = $("#price").val();
    let api_key = localStorage.getItem('SSH_KEY');
     

    var outData={
      good_id: itemid, price: price, name: name, api_key: api_key
    }
 

    data_socket_transporter.emit('price_change', outData)
    data_socket_transporter.on('price_change', (inData)=>{
        console.log(inData)  
        if(inData.result.affectedRows>0){
        //   alert('success!!!')
        
        data_socket_transporter.emit('get eggs list', {api_key: localStorage.getItem('SSH_KEY')})
        } else {
            console.log(inData)
        }
    })


}