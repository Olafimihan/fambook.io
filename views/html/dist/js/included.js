// let acctClass = document.getElementsByClassName('acct')
// $('#acct').addClass('hidden');

$('#psetup').hide();
$('#plist').show();

// $('#psetup').addClass('hidden');
// $('#plist').removeClass('hidden');

$('#addnew').click(function(e){
    // alert('clicked')
    // console.log(e)
    $('#psetup').show();
    $('#plist').hide();
    $('.acct').addClass('hidden');


})

// let api_key="";
api_key=localStorage.getItem('SSH_KEY') 
console.log('LS: '+api_key)
// $(function(){
// })

// includeHTML()

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
console.log("AT Socket HEad: "+api_key);
data_socket_transporter.emit('get gl drop down', {api_key: api_key});

data_socket_transporter.on('get gl drop down', (data)=>{
    var val = "<option value='" +0+ "'>"+"Select a GL Account....."+"</option>.....";
            
    data.val.forEach(function(row) {
        val += "<option value='" + row.account_id + "' >";
        val += row.account_title;  
        val += "</option>";
    });

    $("#morta_acctdr").html(val);
    $("#morta_acctcr").html(val);
    $("#production_acctcr").html(val);
    $("#production_acctdr").html(val);
    $("#feed_costacct").html(val);
    $("#drug_costacct").html(val);
    $("#morta_costacct").html(val);
    $("#investment_acct").html(val);
    $("#layer_acct").html(val);
    $("#layer_costacct").html(val);


    // $("#penslist").html(data.pens);
    // Render All Pens for user
    var str="<table class='table table-bordered' >"
    str += "<tr style='background-color: lightgreen; font-size: 16px; font-weight: bolder'><td>Pen Name</td><td>Quantity</td><td>Capacity</td><td>Investment</td><td>Water QTY(ltrs)</td><td>Rate</td><td>Monthly Wage</td><td>Mortality Cost</td><td>Action</td></tr>"

    var totalPenInvestment=0;
    data.pens.forEach((recs)=>{
        totalPenInvestment += recs.balance;
        str += "<tr style='font-size: 12px'><td>" + recs.pen_name + "</td><td>" + recs.quantity_of_birds.toFixed(2) + "</td><td>" + recs.capacity.toFixed(2) + "</td><td style='text-align: right'>" + recs.balance.toFixed(2) + "</td><td>" + recs.waterqty.toFixed(2) + "</td><td>" + recs.rate + "</td><td>" + recs.monthlywages.toFixed(2) + "</td><td>" + recs.mortalityCost.toFixed(2) + "</td><td><button class='btn btn-primary' id='"+recs.pen_id+"' onclick='editter(this.id)' ><i class='fa fa-edit' ></i></button></td></tr>"
    })
    str += "<tr><td colspan='3'></td><td style='text-align: right; font-size: 14px; font-weight: bolder'>" + totalPenInvestment.toFixed(2) + "</td></tr>"
    str += "</table>"

    $("#penslist").html(str);

})

function editter(id){
    data_socket_transporter.emit('editpen', id)
    data_socket_transporter.on('editpen', (data)=>{
        var resultSet = data.result;  
        var dated     = data.dated;

        // console.log(resultSet)

        // alert(resultSet[0].date)
    
        $("#pen_id").val(resultSet[0].pen_id);
        $("#pen_name").val(resultSet[0].pen_name);
        $("#mortacost").val(resultSet[0].mortalityCost);
        $("#qty").val(resultSet[0].quantity_of_birds);

        $("#dob").val(dated);
        
        $("#morta_acctdr").val(resultSet[0].account_morta_dr);
        $("#morta_acctcr").val(resultSet[0].account_morta_cr);

        $("#production_acctcr").val(resultSet[0].account_prod_cr);
        $("#production_acctdr").val(resultSet[0].account_prod_dr);
        
        $("#feed_costacct").val(resultSet[0].feed_cost_acct);
        $("#drug_costacct").val(resultSet[0].direct_exp_cost_acct);
        $("#morta_costacct").val(resultSet[0].mortality_cost_acct);
        
        $("#investment_acct").val(resultSet[0].pen_investment);

        $("#layer_acct").val(resultSet[0].layers_sales_acct);
        $("#layer_costacct").val(resultSet[0].layers_cfs_acct);




    })
}

function saveData(){
    $('#save').attr('disabled', true);

    let pname = $("#pen_name").val();

    
    let mortacost = $("#mortacost").val();
    
    let dob = $("#dob").val();
    let water = $("#water").val();

    let rate = $("#rate").val();
    let wage = $("#wage").val();
     

    var outData = {
        pname: pname, mortacost: mortacost, dob: dob, water: water, rate: rate, wage: wage, token: localStorage.getItem('SSH_KEY')
    }

    data_socket_transporter.emit('savepen', outData);
    data_socket_transporter.on('savepen', (response)=>{
        $("#pen_name").val('');
        $("#mortacost").val('');
        
        $("#dob").val('');
        $("#water").val('');

        $("#rate").val('');
        $("#wage").val('');
     
        console.log(response);
    })


}
function updateData(){
    let pname = $("#pen_name").val();
    let mortacost = $("#mortacost").val();
    
    let morta_acctdr = $("#morta_acctdr").val();
    let morta_acctcr = $("#morta_acctcr").val();

    let prod_acctcr = $("#production_acctcr").val();
    let prod_acctdr = $("#production_acctdr").val();
    
    let feedcostacct = $("#feed_costacct").val();
    let drugcostacct = $("#drug_costacct").val();
    let mortacostacct = $("#morta_costacct").val();
    
    let investmentacct = $("#investment_acct").val();
    
    let Salesacct = $("#layer_acct").val();
    let Costacct = $("#layer_costacct").val();

    let dob = $("#dob").val();
//  alert(dob)
    var outData={
        pen_id: $("#pen_id").val(), 
        pname: pname, 
        mortacost: mortacost, 
        morta_acctcr: morta_acctcr, 
        morta_acctdr: morta_acctdr, 
        prod_acctcr: prod_acctcr, 
        prod_acctdr: prod_acctdr,
        feedcostacct: feedcostacct, 
        drugcostacct: drugcostacct, 
        mortacostacct: mortacostacct, 
        investmentacct: investmentacct,
        salesAcct: Salesacct,
        CostAcct: Costacct
    }

    data_socket_transporter.emit('updatepen', outData)


}

// data_socket_transporter.on('errmsg', (err)=>{
//     alert(err.sqlMessage)
// })
