var express = require('express');
var router = express.Router();
const WebSocket = require('ws');
let alert = require('alert')

const wss = new WebSocket.Server({ port: 8500 });
var data_comp = [
  {task_id:'426',part_number:'17771272F',componentName:'Turbocompressore',coordinates:'X:10,Y:11,Z:12'},
  {task_id:'428',part_number:'10512099F',componentName:'Supporto centrale tubi completo',coordinates:'X:10,Y:11,Z:12'},
  {task_id:'430',part_number:'39002018F',componentName:'Corpo farfallato',coordinates:'X:10,Y:11,Z:12'},
  {task_id:'432',part_number:'10132161F',componentName:'Coperchio separatore olio completo',coordinates:'X:10,Y:11,Z:12'},
  {task_id:'434',part_number:'11092133F',componentName:'Manicotto uscita aria da turbo',coordinates:'X:10,Y:11,Z:12'},
  {task_id:'436',part_number:'30222010F',componentName:'Tenditore automatico',coordinates:'X:10,Y:11,Z:12'},
  {task_id:'438',part_number:'21632313G',componentName:'Distanziale di bilanciatura',coordinates:'X:10,Y:11,Z:12'},
  {task_id:'440',part_number:'35062015F',componentName:'Iniettore',coordinates:'X:10,Y:11,Z:12'},
  {task_id:'442',part_number:'35032008F',componentName:'Rail',coordinates:'X:10,Y:11,Z:12'},
  {task_id:'444',part_number:'41572014F',componentName:'Disco Flex Plate',coordinates:'X:10,Y:11,Z:12'},
  {task_id:'446',part_number:'35022147F',componentName:'Pompa iniziezione',coordinates:'X:10,Y:11,Z:12'},
  {task_id:'448',part_number:'21052151G',componentName:'Collettore di scarico',coordinates:'X:10,Y:11,Z:12'},

]
    var data = [
    {task_id:'424',operation_to_execute:'Spostare zona prelievo'},
    {task_id:'425',operation_to_execute:'riconoscimento componenti'},
    {task_id:'426',operation_to_execute:'prelievo componente'},
    {task_id:'427',operation_to_execute:'deposito componente'},
    {task_id:'428',operation_to_execute:'prelievo componente'},
    {task_id:'429',operation_to_execute:'deposito componente'},
    {task_id:'430',operation_to_execute:'prelievo componente'},
    {task_id:'431',operation_to_execute:'deposito componente'},
    {task_id:'432',operation_to_execute:'prelievo componente'},
    {task_id:'433',operation_to_execute:'deposito componente'},
    {task_id:'434',operation_to_execute:'prelievo componente'},
    {task_id:'435',operation_to_execute:'deposito componente'},
    {task_id:'436',operation_to_execute:'prelievo componente'},
    {task_id:'437',operation_to_execute:'deposito componente'},
    {task_id:'438',operation_to_execute:'prelievo componente'},
    {task_id:'439',operation_to_execute:'deposito componente'},
    {task_id:'440',operation_to_execute:'prelievo componente'},
    {task_id:'441',operation_to_execute:'deposito componente'},
    {task_id:'442',operation_to_execute:'prelievo componente'},
    {task_id:'443',operation_to_execute:'deposito componente'},
    {task_id:'444',operation_to_execute:'prelievo componente'},
    {task_id:'445',operation_to_execute:'deposito componente'},
    {task_id:'446',operation_to_execute:'prelievo componente'},
    {task_id:'447',operation_to_execute:'deposito componente'},
    {task_id:'448',operation_to_execute:'prelievo componente'},
    {task_id:'449',operation_to_execute:'deposito componente'},
    {task_id:'450',operation_to_execute:'spostare zona trasbordo'},
    {task_id:'466',operation_to_execute: 'spostare zona trasbordo'},
    {task_id:'467',operation_to_execute: 'home'},
    {task_id:'468',operation_to_execute: 'OOS'}
   // {stat_numb:'S023', stat_descr:'Alb Aspirazione grippato', status: 'NOK'},
  ];

/* GET riconoscimento  page. */
router.get('/riconoscimento', function(req, res, next) {
   //var task_id = req.query.task_id;
   var comp_name = req.query.part_num;
   var coord = req.query.coordinates;
   var str_to_send = "{\"part_number\":\"" + comp_name + "\",\"coord\":\"" + coord + "\"}";
   wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
//if (client !== ws && client.readyState === WebSocket.OPEN) {

      client.send(str_to_send);
console.log("SEND DATA to client = " + data);
    }
//});  
});
   
  res.render('riconoscimento', { title: 'Stub riconoscimento UC-C', statData : data_comp});
 });

router.get('/stub_ucc-tasks', function(req, res, next) {
  var statNum = req.query.task_num;
  var status=req.query.status;
  var stringToSend = "{\"statNum\":\"" + statNum + "\",\"status\":\"" + status + "\"}";
  console.log("Status number =" + stringToSend);
//wss.on('connection', function connection(ws) {
     wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
 //if (client !== ws && client.readyState === WebSocket.OPEN) {

        client.send(stringToSend);
console.log("SEND DATA to client = " + data);
      }
//});  
});


  res.render('stub_ucc-tasks', { title: 'Stub UC-C', statData : data});
});

wss.on('connection', function connection(ws,req) {
  ws.on('message', function incoming(data) {
    var msg_arrived = JSON.stringify(data);
    var parsed = JSON.parse(data);
    var task = parsed.task_id;
    console.log("MSG arrived = " + msg_arrived + "parsed = "  + task)
    if(task==424)
    {
      var msg_to_resp = "{\"task_id\":\"424\",\"origin\":\"MW\",\"command_to_execute_ack\":\"WAIT\",\"state\":\"ACK\"}";
      ws.send(msg_to_resp)
      alert("Activated - the first message could be sent!!!!!!")
      
    }
//     wss.clients.forEach(function each(client) {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
// 	const ip = req.socket.remoteAddress;
 
//   //console.log("MSG arrived = " + msg_arrived + "parsed = " + JSON.parse(data).task)
//         client.send(data);
// console.log("Some DATA from client = " + data + "IP= " + ip);
//       }
//     });
  });
});



module.exports = router;
