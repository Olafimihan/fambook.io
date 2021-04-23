
$(function(){
$('#refresh').hide();
})

data_socket_transporter.emit('get equilibrium age', {api_key: localStorage.getItem('SSH_KEY') });

data_socket_transporter.on('get equilibrium age', (data)=>{
console.log(data)

    var equilibrium = data[0].equilibrium_point;
                    console.log(equilibrium)     
    // alert(data)
    $("#equilibrium").val(equilibrium);



})



function saveData(){
    let equilibrium = $("#equilibrium").val(); 

    var outData={
        equilibrium: equilibrium,
        api_key: api_key

    }

    data_socket_transporter.emit('change equilibrium', outData)
    data_socket_transporter.on('change equilibrium', (responseObj)=>{
        console.log(responseObj)
    })

}


data_socket_transporter.on('errmsg', (err)=>{
    alert(err.sqlMessage)
})