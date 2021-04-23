

data_socket_transporter.emit('get gl drop down', {api_key: localStorage.getItem('SSH_KEY')});

  data_socket_transporter.on('get gl drop down', (data)=>{
      // console.log(data)
      $("#stock_acct").html(data.val);
      $("#sales_acct").html(data.val);
      $("#cfs_acct").html(data.val);

  })

  data_socket_transporter.emit('get feeds list', {api_key: localStorage.getItem('SSH_KEY')});

  data_socket_transporter.on('get feeds list', (data)=>{
    var str="<table class='table table-bordered' >"

    data.forEach((recs)=>{
        str += "<tr><td>" + recs.description + "</td><td>" + recs.cost_price.toFixed(2) + "</td><td><button class='btn btn-primary' id='"+recs.product_id+"' onclick='editter(this.id)' ><i class='fa fa-edit' ></i></button></td><td><button class='btn btn-primary' id='"+recs.product_id+"' onclick='deleter(this.id)' ><i class='fa fa-trash' ></i></button></td></tr>"
    })

    str += "</table>"; 
    console.log(data)
    $("#feedlist").html(str); 

  })

  function editter(id){
      // alert(id)
      $("#upd").attr('disabled', false)
      $("#sub").attr('disabled', true)
      
      data_socket_transporter.emit('editfeeds', id)
      data_socket_transporter.on('editfeeds', (resultSet)=>{
          console.log(resultSet)

          $("#good_id").val(resultSet[0].product_id);
          $("#feedname").val(resultSet[0].description);
          $("#cost").val(resultSet[0].cost_price);

      })
  }

  function deleter(id){
    // alert('My ID: '+id)
    data_socket_transporter.emit('deletefeed', id);
    data_socket_transporter.on('deletefeed', (responseObj)=>{
        if(responseObj.affectedRows>0){
            data_socket_transporter.emit('get feeds list', {api_key: localStorage.getItem('SSH_KEY')});
        }else{
            console.log(responseObj) //Manage error rendering with sweet alerts timer display [Boot strap I suppose]. 
        }
        // console.log(responseObj)
    });

  }

  function saveData(){
      let feedname = $("#feedname").val();
      
      let cprice = $("#cost").val(); 
      let api_key=localStorage.getItem('SSH_KEY')

      var outData={
        feedname: feedname, cost: cprice, api_key: api_key
      }

    //   console.log(outData)

      data_socket_transporter.emit('savefeed', outData)
      data_socket_transporter.on('savefeed', (responseObj)=>{
          if(responseObj.insertId > 0){
            data_socket_transporter.emit('get feeds list', {api_key: localStorage.getItem('SSH_KEY')})
            
          }else{
              log(responseObj)
          }
          
      })


  }
  function updateData(){
      let good_id = $("#good_id").val();
      let name = $("#feedname").val();
      let cost = $("#cost").val();
      
    //   let telephone = $("#telephone").val();
    //   let email = $("#email").val();

      // let bday = $("#bday").val(); 

      var outData={
          good_id: good_id, feedname: name, cost: cost 
      }
  
      data_socket_transporter.emit('updatefeed', outData);
      data_socket_transporter.on('updatefeed', (respData)=>{
        if(respData.affectedRows > 0){
            data_socket_transporter.emit('get feeds list', {api_key: localStorage.getItem('SSH_KEY')})
        } else {
            console.log(respData);
        }


      });


  }