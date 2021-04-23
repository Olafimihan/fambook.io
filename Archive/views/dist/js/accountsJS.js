$(function () {
    data_socket_transporter.emit('trialbalance_rpt', {api_key: localStorage.getItem('SSH_KEY')});
    data_socket_transporter.on('trialbalance_rpt', (rpt_Obj) => {
        $('#trialbalance_rpt').html(rpt_Obj.str);
        $('h3').html(rpt_Obj.dt);
    });


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


   
  function printData(){
    window.print();
  }
  function printDiv(divName){
    var printContents = document.getElementById('printArea').innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }