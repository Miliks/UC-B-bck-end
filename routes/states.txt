var express = require('express');
var router = express.Router();
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8400 });

    var data = [
    {stat_numb:'S000',stat_descr:'Start'},
    {stat_numb:'S001',stat_descr:'Login'},
    {stat_numb:'S002',stat_descr:'Avvio ciclo/Logout'},
    {stat_numb:'S003',stat_descr:'AGV KIT in arrivo'},
    {stat_numb:'S004', stat_descr:'Lettura Bar code albero Scarico'},
    {stat_numb:'S005', stat_descr:'Lettura albero non coretta. Riprovare?'},
    {stat_numb:'S006',stat_descr:'Lettura Bar code albero Aspirazione'},
    {stat_numb:'S007',stat_descr:'Lettura albero non coretta. Riprovare?'},
    {stat_numb:'S008',stat_descr:'Lettura Bar code pompa olio'},
    {stat_numb:'S009',stat_descr:'Lettura pompa non coretta. Riprovare?'},
 {stat_numb:'S010',stat_descr:'Unrecoverable issue'},
 {stat_numb:'S011',stat_descr:'AGV T. KIT spostamento punto B'},
    {stat_numb:'S012',stat_descr:'Riconoscimento Albero Scarico'},
{stat_numb:'S013',stat_descr:'Errore riconoscimento Albero Scarico - Franka. Attendere recovery?'},
    {stat_numb:'S014',stat_descr:'Gripping Albero Scarico Franka'},
 {stat_numb:'S015',stat_descr:'Errore gripper Albero Scarico - Franka. Attendere recovery?'},
 {stat_numb:'S016',stat_descr:'Attesa slitta trasp. cobot Kuka in posizione di interscambio alberi'},
    {stat_numb:'S019',stat_descr:'Gripping Albero Scarico Kuka'},
{stat_numb:'S020',stat_descr:'Errore gripper Albero Scarico - Kuka. Attendere recovery?'},
    {stat_numb:'S023',stat_descr:'Riconoscimento Albero Aspirazion'},
{stat_numb:'S024',stat_descr:'Errore riconoscimento Albero Aspirazione - Franka. Attendere recovery?'},
    {stat_numb:'S025',stat_descr:'Gripping Albero Aspirazione Franka'},
{stat_numb:'S026',stat_descr:'Errore gripper Albero Aspirazione - Franka. Attendere recovery?'},
    {stat_numb:'S028',stat_descr:'Attendere AGV T.MOT'},
    {stat_numb:'S029',stat_descr:'Calibrazione slitta'},
    {stat_numb:'S030',stat_descr:'Errore calibrazione Slitta. Attendere recovery?'},
    {stat_numb:'S031',stat_descr:'Inserimento albero Scarico'},
    {stat_numb:'S032',stat_descr:'Errore Inserimento albero Scarico. Attendere recovery?'},
    {stat_numb:'S034',stat_descr:'Gripping Albero Aspirazione Kuka'},
    {stat_numb:'S035',stat_descr:'Errore gripper Albero Aspirazione - Kuka. Attendere recovery?'},
    {stat_numb:'S038',stat_descr:'Spostamento AGV T.MOT in punto D'},
    {stat_numb:'S040',stat_descr:'Calibrazione slitta'},
    {stat_numb:'S041',stat_descr:'Errore calibrazione Slitta. Attendere recovery?'},
    {stat_numb:'S042',stat_descr:'Inserimento albero Aspirazione'},
    {stat_numb:'S045',stat_descr:'AGV T.Motore in arrivo'},
   // {stat_numb:'S023', stat_descr:'Alb Aspirazione grippato', status: 'NOK'},
  ];

/* GET state machine page. */
router.get('/state-machine', function(req, res, next) {
   
  res.render('state-machine', { title: 'State Machine', statData : data});
});

router.get('/state-machine-send', function(req, res, next) {
  var statNum = req.query.statnum;
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

/*wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      /*if (client.readyState === WebSocket.OPEN) {
        client.send(data);

      }
    });
console.log("NEW DATA from client = " + data);
  });
});
*/
  res.render('state-machine', { title: 'State Machine', statData : data});
});

wss.on('connection', function connection(ws,req) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
	const ip = req.socket.remoteAddress;
        client.send(data);
console.log("Some DATA from client = " + data + "IP= " + ip);
      }
    });
  });
});



module.exports = router;
