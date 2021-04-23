 $(document).ready(function(){
    $('#saver').click(function(evt){
        
        evt.preventDefault();

        var inObj = {
            cust_id: $('#cust_id').val(),
            method: $('#method').val(),
            amount : $('#amount').val(),
            narra  : $('#narration').val(),
            dated  : $('#dated').val(),
            ttC    : "Credit", 
            ttD    : "Debit",
            user_id: localStorage.getItem('user'),
            api_key: localStorage.getItem('SSH_KEY')
        };

        // alert($('#amount').val());

        console.log('Akiikitan Oluwa!!')
        console.log(inObj)

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

        data_socket_transporter.emit('custreceipt', inObj)
        data_socket_transporter.on('rcpt display', (rcpt)=>{
            $('#rcptno').val(rcpt);
        })
         
        data_socket_transporter.on('display receipt', (dataObj)=>{
            console.log(dataObj)

            let str = "<table class='table table-borderd' >"
            str += "<tr><td style='text-align: left' >S/N</td><td>Trans Date</td><td>Customer</td><td>Amount</td></tr>"
            
            str += "<tr style='background-color: white'><td> 1 </td><td>" + dataObj.trans_date + "</td><td>" + dataObj.custname + "</td><td>" + dataObj.amount + "</td></tr>"
            // dataObj.forEach((recs)=>{
            //     recCount++;
                
            // })

            str +=  "</table>"

            $('#translist').html(str)

        })
        //console.log(evt)
    
    })
    
})

data_socket_transporter.emit('get receipt info', {api_key: localStorage.getItem('SSH_KEY')});

data_socket_transporter.on('receipt info', (data) => {

    // console.log(data)
    var bank_ddlb = "<option value='" +0+ "'>"+"Select Method of Payment....."+"</option>.....";        
    data.bank.forEach(function(row) {
        bank_ddlb += "<option value='" + row.banks_id + "'>";
        bank_ddlb += row.bank_name;  
        bank_ddlb += "</option>";
    });

    $('#method').html(bank_ddlb)

    var cust_ddlb = "<option value='" +0+ "'>"+"Select a Customer....."+"</option>.....";        
    data.customer.forEach(function(row) {
        cust_ddlb += "<option value='" + row.cust_id + "'>";
        cust_ddlb += row.cust_company_name;  
        cust_ddlb += "</option>";
    });

    $('#cust_id').html(cust_ddlb)

    

});




function saveData() {  
    
    var inObj = {
        cust_id: $('#cust_id').val(),
        method: $('#method').val(),
        amount : $('#amount').val(),
        narra  : $('#narration').val(),
        dated  : $('#dated').val(),
        ttC    : "Credit", 
        ttD    : "Debit",
        user_id: localStorage.getItem('user'),
        rcpt   : $('#rcptno').val()
    };

    $.ajax({
        url: "http://139.162.192.74:2021/cust_receipt",
        type: "POST",
        cache: false,
        data: {objectData: JSON.stringify(inObj)},
        contentType: "application/json",
        dataType: "JSON",
        success: (data) => {
            console.log(data);

        }, 
        error: (err) => {
            console.log(err)
        }
    });

    data_socket_transporter.on('cust_creditnotePOST', (outObj)=>{
        $('#saver').attr('disabled', true);
        console.log(outObj);
        // alert(outObj);
    
    }) 
    
}

function buildNarration(val){
    let narr = toWords(val)
    $('#narration').val(narr)

}

function getCustomerBalance(id){
    console.log(id)
    data_socket_transporter.emit('getcustomerbalance', id);
    data_socket_transporter.on('getcustomerbalance', (data)=>{
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


function toWords(s){
    var th = ['dollars','thousand','million', 'billion','trillion'];
    
    var dg = ['Zero','One','Two','Three','Four', 'Five','Six','Seven','Eight','Nine'];
    var tn = ['Ten','Eleven','Twelve','Thirteen', 'Fourteen','Fifteen','Sixteen', 'Seventeen','Eighteen','Nineteen'];
    var tw = ['Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
    s = s.toString();
    s = s.replace(/[\, ]/g,'');
    
  //    alert(s+':::::'+String(parseFloat(s)))
  //    alert(String(parseFloat(s)))
  
    if (s != String(parseFloat(s))) return 'not a number';
    
    var x = s.indexOf('.');
    if (x == -1) x = s.length;
    if (x > 15) return 'too big';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i=0; i < x; i++){
        if ((x-i)%3==2) {
            if (n[i] == '1') {
                str += tn[Number(n[i+1])] + ' ';
                i++;
                sk=1;
            } else if (n[i]!=0) {
                str += tw[n[i]-2] + ' ';
                sk=1;
            }
        }else if (n[i]!=0) {
            str += dg[n[i]] +' ';
            if ((x-i)%3==0) str += 'hundred and ';
            sk=1;
        } 
        
        if ((x-i)%3==1){
            if (sk) str += th[(x-i-1)/3] + ' ';
            sk=0;
        }
    }
  
    if (x != s.length) {
        var y = s.length;
        str += 'and ';
        for (i=x+1; i<y; i++) str += dg[n[i]] +' ';
    }
  
    return str.replace(/\s+/g,' ');
  }
  