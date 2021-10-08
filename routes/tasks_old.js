var express = require('express');
var router = express.Router();

var WebSocketServer = require("ws").Server;

var wss = new WebSocketServer({port:8000});
var msg;
wss.broadcast = function broadcast(msg) {
  console.log(msg);
  wss.clients.forEach(function each(client) {
      client.send(msg);
   });
};

/*S004 - S007 si ripetono 8 volte*/

    var data = [
    {stat_numb:'S000',stat_descr:'Start'},
   // {stat_numb:'S001',stat_descr:'Login', "status":"OK"},
    //{stat_numb:'S002',stat_descr:'Posizionamento scocca operatore'},
    {stat_numb:'S003',stat_descr:'Posizionamento scocca operatore'},
    {stat_numb:'S004',stat_descr:'Posizionamento scocca OK'},
    
    {stat_numb:'S004', stat_descr:'Prelievo BH001 da Kit',bh:'BH001'},
    {stat_numb:'S006', stat_descr:'Attesa adesivo OK',bh:'BH001'},
    {stat_numb:'S007', stat_descr:'Posizionamento BH001',bh:'BH001'},
    {stat_numb:'S008',stat_descr:'Cobot in posizione fuori ingombro'},
    {stat_numb:'S009',stat_descr:'Prelievo BH002 da Kit',bh:'BH002'},
    {stat_numb:'S011',stat_descr:'Attesa adesivo OK',bh:'BH002'},
    {stat_numb:'S012', stat_descr:'Posizionamento BH002',bh:'BH002'},
   // {stat_numb:'S013', stat_descr:'Errore Posizionamento BH002',bh:'BH002'},
    {stat_numb:'S014', stat_descr:'Modalita hand over',bh:'BH002'},
    {stat_numb:'S015', stat_descr:'Posizionamento BH002 OK',bh:'BH002'},
    {stat_numb:'S016',stat_descr:'Cobot in posizione fuori ingombro'},
    {stat_numb:'S017', stat_descr:'Prelievo BH003 da Kit',bh:'BH003'},
    {stat_numb:'S019', stat_descr:'Attesa adesivo OK',bh:'BH003'},
    {stat_numb:'S020', stat_descr:'Posizionamento BH004',bh:'BH004'},
    {stat_numb:'S021',stat_descr:'Cobot in posizione fuori ingombro'},
    {stat_numb:'S022', stat_descr:'Prelievo BH004 da Kit',bh:'BH004'},
    {stat_numb:'S023', stat_descr:'Attesa adesivo OK',bh:'BH004'},
    {stat_numb:'S024', stat_descr:'Posizionamento BH003',bh:'BH003'},
    {stat_numb:'S025',stat_descr:'Cobot in posizione fuori ingombro'}
 
  ];

  router.get('/tasks-state', function(req, res, next) {
  var statNum = req.query.statnum;
  var status=req.query.status;
  var bh_str = req.query.bh;
  var str;
  switch (statNum) {
    case "S000":
       str = '"Origin":"MW","Cobot":"Auto", "BH":"","Operation":"Start';
       break;
       case "S002":
         str = '"Origin":"MW","Cobot":"Auto", "BH":"","Operation":"Verifica posizionamento reciproco';
         break;
         case "S003":
          str = '"Origin":"MW","Cobot":"Auto", "BH":"","Operation":"Posizionamento scocca OK';
          break;
          case "S004":
          case "S009":
          case "S017":
          case "S022":
                    
            str = '"Origin":"MW","Cobot":"Auto", "BH":"'+ bh_str+'","Operation":"Prelievo ' + bh_str+' da Kit';
            break;
            case "S007":
            case "S012":
            case "S015":
            case "S020":
            case "S024":
             str = '"Origin":"MW","Cobot":"Auto", "BH":"'+ bh_str+'","Operation":"Posizionamento ' + bh_str;
             break;
             case "S014":
              str = '"Origin":"MW","Cobot":"Manuale", "BH":"'+ bh_str+'","Operation":"Hand over ' + bh_str+'","Suggestion":"BH004,BH005';
              break;
              case "S008":
              case "S016":
              case "S021":
              case "S025":
                str = '"Origin":"MW","Cobot":"Auto", "BH":"","Operation":"Cobot fuori ingombro';
                break;
                case "S006":
                case "S011":
                case "S019":  
                case "S023":
                str = '"Origin":"MW","Cobot":"Auto", "BH":"'+ bh_str + '","Operation":"Attesa adesivo';
                break;
  }
    var stringToSend = "{\"uc\":\"uc-b\",\"statNum\":\"" + statNum + "\","+ str + "\",\"status\":\"" + status + "\"}";
    wss.broadcast(stringToSend);
  console.log("Status number =" + stringToSend);
  res.render('tasks-state', { title: 'State Machine', statData : data});
});

module.exports = router;
