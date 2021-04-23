$(document).ready(function(){
    $('#saver').click(function(evt){
        
        evt.preventDefault();

        var inObj = {
            supp_id: $('#supp_id').val(),
            method: $('#method').val(),
            amount : $('#amount').val(),
            narra  : $('#narration').val(),
            dated  : $('#dated').val(),
            ttC    : "Credit", 
            ttD    : "Debit",
            user_id: localStorage.getItem('user'),
            api_key: localStorage.getItem('SSH_KEY')
        };

         
        $('#saver').attr('disabled', true);
        
        if($('#cust_id').val()===0 || $('#cust_id').val()==='') {
            alert('Please, select a customer to continue...');
            return;
        }

        if($('#amount').val()==='') {
            alert('Please, enter an amount to continue...');
            return;
        }
        if($('#dated').val()==='') {
            alert('Please, enter date to continue...');
            return;
        }
        if($('#method').val()===0 || $('#method').val()==='') {
            alert('Please, select a payment method to continue...');
            return;
        }


    
        data_socket_transporter.emit('supppayment', inObj)
        data_socket_transporter.on('payment display', (rcpt)=>{
            $('#rcptno').val(rcpt);
        })
         
        data_socket_transporter.on('display payment', (dataObj)=>{
            console.log(dataObj)

            let str = "<table class='table table-borderd' >"
            str += "<tr><td style='text-align: left' >S/N</td><td>Trans Date</td><td>Supplier Name</td><td>Amount</td></tr>"
            
            str += "<tr style='background-color: white'><td> 1 </td><td>" + dataObj.trans_date + "</td><td>" + dataObj.suppname + "</td><td>" + dataObj.amount + "</td></tr>"
            // dataObj.forEach((recs)=>{
            //     recCount++;
                
            // })

            str +=  "</table>"

            $('#translist').html(str)

        })
        //console.log(evt)
    
    })
    
}); //document


data_socket_transporter.emit('get receipt info', {api_key: localStorage.getItem('SSH_KEY')});

data_socket_transporter.on('receipt info', (data) => {
    // console.log(data)
    var bank_ddlb = "<option value='" +0+ "'>"+"Select Method of Payment....."+"</option>.....";        
    data.bank.forEach(function(row) {
        bank_ddlb += "<option value='" + row.banks_id + "'>";
        bank_ddlb += row.bank_name;  
        bank_ddlb += "</option>";
    });

    $('#method').html(bank_ddlb);

    var supp_ddlb = "<option value='" +0+ "'>"+"Select a Supplier....."+"</option>.....";        
    data.supplier.forEach(function(row) {
        supp_ddlb += "<option value='" + row.supplier_id + "'>";
        supp_ddlb += row.supplier_company_name;  
        supp_ddlb += "</option>";
    });

    $('#supp_id').html(supp_ddlb);

});



function saveData() {  
    $('#saver').attr('disabled', true);

    var user="MD";

    var inObj = {
        supp_acct: $('#dr_acct').val(),
        bank_id: $('#cr_acct').val(),
        tdate  : $('#dated').val(),
        amount : $('#amt').val(),
        narra  : $('#narra').val(),
        ttC    : "Credit", 
        ttD    : "Debit",
        user_id: "manager" 
    };

    var supp_acct= $('#dr_acct').val(),
        bank_id  = $('#cr_acct').val(),
        tdate    = $('#dated').val(),
        amount   = $('#amt').val(),
        narra    = $('#narra').val(),
        ttC      = "Debit", 
        ttD      = "Credit",
        user_id  = user 


    $.ajax({
    url: "http://139.162.192.74:2021/supp_receipt",
    type: "get",
    cache: false,
    data: "cust_acct="+supp_acct+"&bank="+bank_id+"&tdate="+tdate+"&amt="+amount+"&narra="+narra+"&ttC="+ttC+"&ttD="+ttD+"&user="+user_id+"&api_key="+api_key,
    // data: {insertObject: inObj},
    dataType: "json",
    success: (data) => {
        $('.savebtn').addClass('hidden');
        $('#saver').attr('disabled', true);
        console.log(data);
        alert(data.resp);
    
        if(data.resp==='success'){
        alert('Payment posted successfully!!!');

        }else{
        alert('There is a likely Database error!!!')
        return
        }
        // swal('HEY!', 'Thanks for sharing with us...', 'success');
    }, 
    error: (err) => {

    }
    });


    // $.ajax({
    //   url: "",
    //   method: "POST",
    //   cache: false,
    //   data: {},
    //   success: function(data){

    //   },
    //   error: function(err){

    //   },
    //   datatype: "JSON"
    // });

    // data_socket_transporter.emit('cust_creditnotePOST', inObj )
    
    // data_socket_transporter.on('cust_creditnotePOST', (outObj)=>{
    //   $('#saver').attr('disabled', true);
    //   console.log(outObj);
    //   alert(outObj);
    
    // }) 
    
}
function getSupplierBalance(id){
    console.log(id)
    data_socket_transporter.emit('getsupplierbalance', id);
    data_socket_transporter.on('getsupplierbalance', (data)=>{
        console.log(data)
        if(data < 0){
            $("#balance").val(data);
            // $("#bal_state").html('Debit balance')
        }else if(data > 0){
            $("#balance").val(data)

        }else if(data === 0){
            $("#balance").val(data)
        }else{
            // $("#bal_state").html(data)
        }
    })
}


// function reset(id){
//     data_socket_transporter.emit('getsupplierbalance', id);
//     data_socket_transporter.on('getsupplierbalance', (data)=>{
//         console.log(data)
        
//         if(data < 0){
//             $("#balance").val(data * -1);
        
//             $("#bal_state").html('Debit balance')
//         }else if(data > 0){
//             $("#balance").val(data);
//             $("#bal_state").html('Credit balance')
//         }else{
//             $("#bal_state").html('')
//         }
//     })
// }

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
