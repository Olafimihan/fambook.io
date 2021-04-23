
data_socket_transporter.emit('get gl drop down', {api_key: localStorage.getItem('SSH_KEY')});

data_socket_transporter.on('get gl drop down', (data) => { 
    // console.log(data)
    var cust_ddlb = "<option value='" +0+ "'>"+"Select a Customer....."+"</option>.....";        
    data.cust_RS.forEach(function(row) {
        cust_ddlb += "<option value='" + row.cust_id + "'>";
        cust_ddlb += row.cust_company_name;  
        cust_ddlb += "</option>";
    });

    $("#item_id").html(cust_ddlb);
    // $("#cr_acct").html(data.val); 
});

$(function () {
$("#example1").DataTable({
    "responsive": true,
    "autoWidth": false,
});
$('#example2').DataTable({
    "paging": true,
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": false,
    "responsive": true,
});

});

function changeDDL(val){
//   var radioValue = $("input[name='customRadio']:checked").val();
    data_socket_transporter.emit('get item drop down', {feed: val, api_key: localStorage.getItem('SSH_KEY')});

    data_socket_transporter.on('get item drop down', (data)=>{

        console.log(val)
        console.log(data)
        $("#item").html(data.val);
        // $("#cr_acct").html(data.val); 
    })

}


function previewData(){
    var itemid = $("#item_id").val()
    var bdate  = $("#bdate").val()
    var edate  = $("#edate").val()
        

    $("h7").html("")
    $("h7").html(' Customer Ledger between '+ bdate + ' TO '+ edate)

    var dateObj = {
        itemid : itemid,
        bdate  : bdate,
        edate  : edate,
        api_key: localStorage.getItem('SSH_KEY')
    };

    data_socket_transporter.emit('customerledger_rpt', dateObj )

    data_socket_transporter.on('customerledger_rpt', (dataObj)=>{ 
        let str=""; // "<table class='table table-bordered' >";
        let counter=0;
        let dbt_amt=0, crd_amt=0;
        let totdbt_amt=0, totcrd_amt=0;

        let bal=0;
        $('#custname').html(dataObj[0].cust_company_name + ": ("+bdate+" TO "+edate+")")

        dataObj.forEach((recs)=>{
            counter++;
            if(recs.trans_type==='Debit')
            {
                dbt_amt=recs.amount;
                crd_amt=0;
                totdbt_amt+=recs.amount;
            }
            else if(recs.trans_type==='Credit')
            {
                crd_amt=recs.amount;
                dbt_amt=0;
                totcrd_amt+=recs.amount;
            }

            bal = recs.balance;
            let dateArray = recs.trans_date.split('T');

            str += "<tr style='font-size: 12px'><td>" + counter + "</td><td>" + dateArray[0] + "</td><td>" + recs.narration + "</td><td>" + formatCurrency(dbt_amt) + "</td><td>" + formatCurrency(crd_amt) + "</td><td>" + formatCurrency(recs.pre_bal) + "</td><td style='text-align: right'>" + formatCurrency(recs.balance) + "</td></tr>"
        })

        // <th>S/N</th>
        //             <th>Date</th>
        //             <th>Customer Name</th>
        //             <th>Narration</th>
        //             <th>Debit</th>
        //             <th>Credit</th> 
        //             <th>Previous Balance</th> 
        //             <th>current Balance</th> 
        
        str += "<tr style='background-color: gold; font-weight: bolder'><td colspan='6'>Balance b/d</td><td style='text-align: right'>" + formatCurrency(bal) + "</td></tr>"
        // str += "</table>"

        $("#usage_resp").html(str);

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
