


data_socket_transporter.emit('get receipt info', {api_key: localStorage.getItem('SSH_KEY')});

data_socket_transporter.on('receipt info', (data)=>{
    var cust_ddlb = "<option value='" +0+ "'>"+"Select a Customer....."+"</option>.....";        
    data.customer.forEach(function(row) {
        cust_ddlb += "<option value='" + row.cust_id + "'>";
        cust_ddlb += row.cust_company_name;  
        cust_ddlb += "</option>";
    });

    $('#cust_acct').html(cust_ddlb);

    // var bank_ddlb = "<option value='" +0+ "'>"+"Select Method of Payment....."+"</option>.....";        
    // data.bank.forEach(function(row) {
    //     bank_ddlb += "<option value='" + row.banks_id + "'>";
    //     bank_ddlb += row.bank_name;  
    //     bank_ddlb += "</option>";
    // });

    var bank_ddlb = "<option value='" +0+ "'>"+"Select Method of Payment....."+"</option>.....";        
    data.bank.forEach(function(row) {
        bank_ddlb += "<option value='" + row.banks_id + "'>";
        bank_ddlb += row.bank_name;  
        bank_ddlb += "</option>";
    });

    $('#cr_acct').html(bank_ddlb);
    
})

openers = ()=>{
    window.location='dashboard.html'
}

function saveData(){  

    var inObj = {
        cust_acct: $('#cust_acct').val(),
        cust_id: $('#cust_acct').val(),
        cr_acct: $('#cr_acct').val(),
        tdate  : $('#dated').val(),
        amount : $('#amt').val(),
        narra  : $('#narra').val(),
        api_key: localStorage.getItem('SSH_KEY'), 
        user_id: localStorage.getItem('user') 
    };

    data_socket_transporter.emit('cust_debitnotePOST', inObj )
    
    data_socket_transporter.on('cust_debitnotePOST', (outObj)=>{
        $('#saver').attr('disabled', true);
        console.log(outObj);

        // var str = "<table class='table table-bordered' >"
        
        // for(var x=0; x<outObj.length; x++){
        //     var amt = outObj[x].amount
        //     str += "<tr><td>"+ outObj[x].account_id+"</td><td>"+ formatCurrency(amt) +"</td></tr>"

        // }
        // str += "</table>"            


        // $("#journal").html(str);
    }) 
    
}

function reset(id){
    data_socket_transporter.emit('getcustomerbalance', id);
    data_socket_transporter.on('getcustomerbalance', (data)=>{
        $("#balance").val(data);
        if(data < 0){
            $("#bal_state").html('Debit balance')
        }else if(data > 0){
            $("#bal_state").html('Credit balance')
        }else{
            $("#bal_state").html('')
        }
    })
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
