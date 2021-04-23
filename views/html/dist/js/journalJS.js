$(document).ready(function(){
    alert('Module Not Enabled!!!')
    window.location='dashboard.html';
})

data_socket_transporter.emit('get filtered gl drop down');

data_socket_transporter.on('get filtered gl drop down', (data)=>{

    // console.log(data)
    $("#dr_acct").html(data.val);
    $("#cr_acct").html(data.val); 
})



function saveData(){  

    var inObj={
        dr_acct: $('#dr_acct').val(),
        cr_acct: $('#cr_acct').val(),
        tdate  : $('#dated').val(),
        amount : $('#amt').val(),
        narra  : $('#narra').val(),
        account_id: "",
        serial: 300,
        glTT: "",
        user_id: "ashipa",
        status: 0,
        balance: 0,
        current_bal: 0
    };

    data_socket_transporter.emit('journalentry', inObj )
    
    data_socket_transporter.on('journalentry', (outObj)=>{
        $('#saver').attr('disabled', true);
        console.log(outObj);

        var str = "<table class='table table-bordered' >"
        
        for(var x=0; x<outObj.length; x++){
            var amt = outObj[x].amount
            str += "<tr><td>"+ outObj[x].account_id+"</td><td>"+ formatCurrency(amt) +"</td></tr>"

        }
        str += "</table>"            

        alert("Transaction successfully posted...")

        $("#journal").html(str);
    }) 
    
}

function reset(){
    $('#saver').attr('disabled', false)
}

function printData(){
    window.print();
}

function formatCurrency(num) {
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
    num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10)
    cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
    num = num.substring(0,num.length-(4*i+3))+','+
    num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + '' + num + '.' + cents);
}
