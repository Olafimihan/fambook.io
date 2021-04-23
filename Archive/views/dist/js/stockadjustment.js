

$(document).ready(function(){
    alert('Module not enabled!!!')
    window.location='dashboard.html'
})
console.log(data_socket_transporter)

data_socket_transporter.emit('get item drop down', {feed: 'feed', api_key: localStorage.getItem('SSH_KEY')});

data_socket_transporter.on('get item drop down', (data)=>{

    console.log(data)
    var item_ddlb = "<option value='" +0+ "'>"+"Select an Item....."+"</option>.....";        
    if(data.feed=='feed'){
        data.result.forEach(function(row) {
            item_ddlb += "<option value='" + row.product_id + "'>";
            item_ddlb += row.description;  
            item_ddlb += "</option>";
        });
    
    }else if(data.feed=='drug'){
        data.result.forEach(function(row) {
            item_ddlb += "<option value='" + row.goods_id + "'>";
            item_ddlb += row.description;  
            item_ddlb += "</option>";
        });
    
    }else if(data.feed=='egg')
    data.result.forEach(function(row) {
        item_ddlb += "<option value='" + row.goods_id + "'>";
        item_ddlb += row.goods_description;  
        item_ddlb += "</option>";
    });

    $("#itemlist").html(item_ddlb);
    // $("#cr_acct").html(data.val); 
})

// $.ajax({
//     url: "",
//     data: "",
//     cache: false,
//     type: "",
//     success: function(data){
//         console.log(data)
//     },
//     error: function(err){
// console.log(err)
//     },
//     dataType: JSON
// })

function changeDDL(val){
    var radioValue = $("input[name='customRadio']:checked").val();
    
    data_socket_transporter.emit('get item drop down', {feed: val, api_key: localStorage.getItem('SSH_KEY')});

    data_socket_transporter.on('get item drop down', (data)=>{

        console.log(val)
        console.log(data)
        $("#item").html(data.val);
        // $("#cr_acct").html(data.val); 
    })

}

function getData(id){
    var radioValue = $("input[name='customRadio']:checked").val();
    console.log(radioValue);
    
    var outObj = {
        val: radioValue,
        id : id
    }

    // let maybeNaN = NaN;
    
    // maybeNaN = 3;
    // console.log(Number.isNaN(inObj.val / inObj.qty)); // false

    data_socket_transporter.emit('itemdata', outObj);
    data_socket_transporter.on('itemdata', (inObj) => {
        
        // console.log(inObj[0].description )
        const flag = inObj.flag 
        const result = inObj.data

        console.log(flag); // true
        console.log(result); // true
        
        if(flag==='drug'){
        $('#u_prc').val(result[0].amount);
        $('#c_qty').val(formatCurrency(result[0].stock_level));
        $('#c_value').val(formatCurrency(result[0].stock_value));


        }else if(flag==='feed'){
        $('#u_prc').val(result[0].cost_price);
        $('#c_qty').val(formatCurrency(result[0].quantity));
        $('#c_value').val(formatCurrency(result[0].stock_value));

        }else if(flag==='egg'){
        $('#u_prc').val(result[0].buy_price);
        $('#c_qty').val(formatCurrency(result[0].stock_level));
        $('#c_value').val(formatCurrency(result[0].balance));

        }

        
        // if(Number.isNaN(inObj[0].val / inObj[0].qty)) {
        //     $('#u_prc').val(0);
        // }else{
        //     $('#u_prc').val((inObj[0].val / inObj[0].qty).toFixed(2));
        // }

    })
}

function getValues(val){
    var u_prc = $('#u_prc').val();
    
    $('#n_value').val((val * u_prc).toFixed(2));
    // alert(val)
}


function saveData() {
    var feedtype   = $("input[name='customRadio']:checked").val();
    var trans_type = $("input[name='trans_type']:checked").val();
    
    // dataObj.serial, dataObj.account_id, dataObj.tdate, dataObj.tdate, dataObj.narra, dataObj.glTT, dataObj.amount, dataObj.user_id, 
    // dataObj.status, dataObj.balance, dataObj.current_bal, 0, 0, 0, 0 
    
    var inObj={
        feedtype: feedtype,
        itemid: $('#item').val(),
        product: $('#item').val(),
        quantity: $('#n_qty').val(),
        qty: $('#n_qty').val(),
        tdate  : "",
        amount : $('#n_value').val(),
        amt : $('#n_value').val(),
        stockval : $('#n_value').val(),
        narra  : $('#narra').val(),
        account_id: "",
        serial: 0,
        glTT: trans_type,
        tt: trans_type,
        user: localStorage.getItem('user'),
        status: 0,
        balance: 0,
        current_bal: 0,
        api_key: localStorage.getItem('SSH_KEY')
    };

    data_socket_transporter.emit('stockadjustment', inObj );
    
    data_socket_transporter.on('stockadjustment', (outObj)=>{
        $('#saver').attr('disabled', true);
        console.log(outObj);
        if(outObj == "success"){
            alert("Adjustment successfully posted!!!")
        }

        // var str = "<table class='table table-bordered' >"
        
        // for(var x=0; x<outObj.length; x++){
        //     var amt = outObj[x].amount
        //     str += "<tr><td>"+ outObj[x].account_id+"</td><td>"+ formatCurrency(amt) +"</td></tr>"
        // }
        // str += "</table>"

        // $("#journal").html(str);
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
