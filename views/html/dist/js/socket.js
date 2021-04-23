

let data_socket_transporter = io.connect("http://139.162.192.74:2021");

// let api_key = localStorage.getItem("SSH_KEY");
    
// if(api_key===null){
//     window.location='index.html'
//     // return;
// };

// console.log("SSH_KEY: "+api_key);
// console.log(data_socket_transporter);

data_socket_transporter.on('errmsg', (errmsg) => {
    // piping all exception to this event, you can send it in a mail later on for monitoring

    data_socket_transporter.emit('errormailer', errmsg);
    
    console.log(errmsg);
});



function getSubscriptionFee(id){
    data_socket_transporter.emit('sub_fee', id)
    data_socket_transporter.on('sub_fee', ()=>{
        
    })

}

// const userlevel = document.getElementById('userlevel');

// userlevel.html(localStorage.getItem('FarmName'))

$('#userlevel').html(localStorage.getItem('FarmName'));

// document.ready(function(){
//     alert('Dele')
// })


// var data_socket_transporter = io.connect("http://127.0.0.1:2000");
// var data_socket_transporter = io.connect("http://139.162.229.38:2000");
    
// console.log(data_socket_transporter);

// document.ready(function(){
//     alert('Dele')
// })