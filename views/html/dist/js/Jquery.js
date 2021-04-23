// console.log(data_socket_transporter);
// console.log(localStorage.getItem('SSH_KEY'));

$(document).ready(function() {
  console.log(data_socket_transporter);
  $('#login').click(function() {
    var loginObject = {
      user: $('#username').val(),
      pass: $('#password').val()
    }

    data_socket_transporter.emit('adminlogin', loginObject);

    data_socket_transporter.on('adminlogin', (respObject) => {
      console.log(respObject)
      if(respObject.result){
        localStorage.setItem('SSH_KEY', respObject.api_key);
        localStorage.setItem('FarmName', respObject.farmname);
        localStorage.setItem('user', respObject.user);
        window.location='dashboard.html';
      }else{
        alert(respObject.api_key)
        //window.location='404.html';
      }
      
    });

  })
  
});


data_socket_transporter.on('get_initial_board_data', (responseObject) => {
  console.log('Olafimihn ooo...')

  console.log(responseObject)
});

function get_initial_board_data(){
  $.ajax({
    url: "http://139.162.192.74:2021/get_initial_board_data",
    cache: false,
    type: 'GET',
    data: "api_key="+localStorage.getItem('SSH_KEY'),
    success: (data)=>{
      // console.log(data)
      // console.log('dele')
      // console.log(data.result.fcr)
      $('#feedqty').html(formatCurrency(data.result.totalfeedqty)+" Bags");
      $('#feedcost').html(formatCurrency(data.result.totalfeedcost));
      $('#drugcost').html(formatCurrency(data.result.totaldrugcost));
      $('#othercost').html(formatCurrency(data.result.totalothercost));
      $('#production').html(formatCurrency(data.result.totalproductionqty));
      $('#sales').html(formatCurrency(data.result.totalsales));
      $('#mortaqty').html(formatCurrency(data.result.totalmortaqty));
      $('#mortacost').html(formatCurrency(data.result.totalmortacost));
      $('#costofsales').html(formatCurrency(data.result.totalcostofsales));
      $('#fcr').html(formatCurrency(data.result.fcr));

      const lbl = ['Cost Of Sales', 'Operational Cost', 'Feed Cost', 'Drug Cost', 'Mortality Cost', 'Labour'];
      // const dat = [1700,500,400,600,300,100]
      let dat = []

      dat.push(data.result.totalcostofsales);
      dat.push(data.result.totalothercost);
      dat.push(data.result.totalfeedcost);
      dat.push(data.result.totaldrugcost);
      dat.push(data.result.totalmortacost);
      dat.push(data.result.totLabour);
      
      var donutData        = {
        labels          : ['Cost Of Sales', 'Operational Cost', 'Feed Cost', 'Drug Cost', 'Mortality Cost', 'Labour'],
        datasets        : [{data: dat, 
        backgroundColor : ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de'], } ]
      }

      var donutOptions     = {
        maintainAspectRatio : false,
        responsive : true,
      }
      

      //-------------
      //- PIE CHART -
      //-------------
      // Get context with jQuery - using jQuery's .get() method.
      var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
      // console.log(pieChartCanvas)

      var pieData        = donutData;
      var pieOptions     = donutOptions;

      //Create pie or douhnut chart
      // You can switch between pie and douhnut using the method below.
      var pieChart = new Chart(pieChartCanvas, {
        type: 'pie',
        data: donutData,
        options: donutOptions      
      });

      let dataAnalysis = "<table class='table-bordered' width='100%' height='100%'>"
      dataAnalysis+= "<tr style='font-weight; bolder; font-size: 20px; text-align: center'><td colspan='2'>Current Week Cost Analysis</td></tr>"
      for(x=0; x < lbl.length; x++){
        dataAnalysis+="<tr style='font-weight: bold'><td>" +lbl[x]+ "</td><td style='text-align: right'>" +formatCurrency(dat[x])+ "</td></tr>"
      }
      dataAnalysis+= "</table>"

      // console.log(dataAnalysis)
      $('#dataanalysis').html(dataAnalysis);

    },
    error: (error)=>{
      // console.log(error)
    },
    datatype: 'JSON'
  })
};

$(function () {
    
    /* ChartJS
     * -------
     * Here we will create a few charts using ChartJS
     */


    //-------------
    //- DONUT CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    /**
     * 
     */
    //data_socket_transporter.emit('get_initial_board_data', {api_key: localStorage.getItem('SSH_KEY')});

    get_initial_board_data();

    data_socket_transporter.on('get_initial_data', (resultObject) => {
      const lbl = ['Cost Of Sales', 'Operational Cost', 'Feed Cost', 'Drug Cost', 'Mortality Cost', 'Labour'];
      // const dat = [1700,500,400,600,300,100]
      let dat = [];

      dat.push(resultObject.totalcostofsales);
      dat.push(resultObject.totalothercost);
      dat.push(resultObject.totalfeedcost);
      dat.push(resultObject.totaldrugcost);
      dat.push(resultObject.totalmortacost);
      dat.push(resultObject.totalothercost);

      var donutData        = {
        labels          : ['Cost Of Sales', 'Operational Cost', 'Feed Cost', 'Drug Cost', 'Mortality Cost', 'Labour'],
        datasets        : [{data: dat, 
        backgroundColor : ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de'], } ]
      }

      var donutOptions     = {
        maintainAspectRatio : false,
        responsive : true,
      }
       

      //-------------
      //- PIE CHART -
      //-------------
      // Get context with jQuery - using jQuery's .get() method.
      var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
      var pieData        = donutData;
      var pieOptions     = donutOptions

      //Create pie or douhnut chart
      // You can switch between pie and douhnut using the method below.
      var pieChart = new Chart(pieChartCanvas, {
        type: 'pie',
        data: donutData,
        options: donutOptions      
      })


    })





})

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

