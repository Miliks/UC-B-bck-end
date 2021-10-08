var express = require('express');
var router = express.Router();

var WebSocketServer = require("ws").Server;

var wss = new WebSocketServer({port:8300});
wss.on("connection", function connection(ws) {
ws.on("message", function incoming(message) {
console.log("MESASGE = " + JSON.stringify(message))
})
})
var msg;
wss.broadcast = function broadcast(msg) {
  console.log("IN broadcast = " + msg);
  wss.clients.forEach(function each(client) {
      client.send(msg);
   });
};

/*S004 - S007 si ripetono 8 volte*/

  var data = [
   // {stat_numb:'S000',stat_descr:'Start'},
   // {stat_numb:'S001',stat_descr:'Login'},

    {stat_numb:'S002',stat_descr:'Verifica Positioning reciproco'},
    {stat_numb:'S003',stat_descr:'Positioning scocca OK'},

    {stat_numb:'S004', stat_descr:'Prelievo BH001 da Kit',bh:'BH001'},//HMI manda un messaggio della quantita della colla
    {stat_numb:'S005', stat_descr:'Attesa adesivo',bh:'BH001'},
    {stat_numb:'S006', stat_descr:'Positioning BH001',bh:'BH001'},
    {stat_numb:'S007',stat_descr:'Cobot in posizione fuori ingombro',bh:'BH001'},
   
    {stat_numb:'S008',stat_descr:'Prelievo BH002 da Kit',bh:'BH002'},
    {stat_numb:'S009',stat_descr:'Attesa adesivo',bh:'BH002'},
    {stat_numb:'S010', stat_descr:'Positioning BH002',bh:'BH002'},
    {stat_numb:'S011', stat_descr:'Cobot in posizione fuori ingombro',bh:'BH002'},

    {stat_numb:'S012', stat_descr:'Prelievo BH003 da Kit',bh:'BH003'},
    {stat_numb:'S013', stat_descr:'Attesa adesivo',bh:'BH003'},
    {stat_numb:'S014', stat_descr:'Positioning BH003',bh:'BH003'},
    {stat_numb:'S015',stat_descr:'Cobot in posizione fuori ingombro',bh:'BH003'},

    {stat_numb:'S016', stat_descr:'Prelievo BH004 da Kit',bh:'BH004'},
    {stat_numb:'S017', stat_descr:'Attesa adesivo',bh:'BH004'},
    {stat_numb:'S018', stat_descr:'Positioning BH004',bh:'BH004'},
    {stat_numb:'S019',stat_descr:'Cobot in posizione fuori ingombro',bh:'BH004'},
    
    {stat_numb:'S020', stat_descr:'Prelievo BH005 da Kit',bh:'BH005'},
    {stat_numb:'S021', stat_descr:'Attesa adesivo',bh:'BH005'},
    {stat_numb:'S022', stat_descr:'Positioning BH005',bh:'BH005'},
    {stat_numb:'S023',stat_descr:'Cobot in posizione fuori ingombro',bh:'BH005'},

    {stat_numb:'S024', stat_descr:'Prelievo BH006 da Kit',bh:'BH006'},
    {stat_numb:'S025', stat_descr:'Attesa adesivo',bh:'BH006'},
    {stat_numb:'S026', stat_descr:'Positioning BH006',bh:'BH006'},//con l'errore 
    {stat_numb:'S026.1', stat_descr:'Cobot HO',bh:'BH006'},
    {stat_numb:'S029',stat_descr:'Cobot in posizione fuori ingombro',bh:'BH006'},

    {stat_numb:'S030', stat_descr:'Prelievo BH007 da Kit',bh:'BH007'},
    {stat_numb:'S031', stat_descr:'Attesa adesivo',bh:'BH007'},
    {stat_numb:'S032', stat_descr:'Positioning BH007',bh:'BH007'},
    {stat_numb:'S033',stat_descr:'Cobot in posizione fuori ingombro',bh:'BH007'},

    {stat_numb:'S034', stat_descr:'Prelievo BH008 da Kit',bh:'BH008'},
    {stat_numb:'S035', stat_descr:'Attesa adesivo',bh:'BH008'},
    {stat_numb:'S036', stat_descr:'Positioning BH008',bh:'BH008'},//con l'errore
    {stat_numb:'S036.1',stat_descr:'Cobot HG',bh:'BH008'},//con suggestions
    {stat_numb:'S036.2',stat_descr:'POI BH009',bh:'BH008'},//POI riconosciuta//HMI manda un messaggio di modalita automatica S038
    {stat_numb:'S037',stat_descr:'Cobot in posizione fuori ingombro',bh:'BH008'},
    //{stat_numb:'S111',stat_descr:'Generate report'}
    
    {stat_numb:'S039', stat_descr:'Prelievo BH010 da Kit',bh:'BH010'},
    {stat_numb:'S040', stat_descr:'Attesa adesivo',bh:'BH010'},
    {stat_numb:'S041', stat_descr:'Positioning BH010',bh:'BH010'},
    {stat_numb:'S042',stat_descr:'Cobot in posizione fuori ingombro',bh:'BH010'},
 
    {stat_numb:'S043', stat_descr:'Prelievo BH011 da Kit',bh:'BH011'},
    {stat_numb:'S044', stat_descr:'Attesa adesivo',bh:'BH011'},
    {stat_numb:'S045', stat_descr:'Positioning BH011',bh:'BH011'},
    {stat_numb:'S046',stat_descr:'Cobot in posizione fuori ingombro',bh:'BH011'},

    {stat_numb:'S047', stat_descr:'Prelievo BH012 da Kit',bh:'BH012'},
    {stat_numb:'S048', stat_descr:'Attesa adesivo',bh:'BH012'},
    {stat_numb:'S049', stat_descr:'Positioning BH012',bh:'BH012'},
    {stat_numb:'S050',stat_descr:'Cobot in posizione fuori ingombro',bh:'BH012'},

    {stat_numb:'S051', stat_descr:'Prelievo BH013 da Kit',bh:'BH013'},
    {stat_numb:'S052', stat_descr:'Attesa adesivo',bh:'BH013'},
    {stat_numb:'S053', stat_descr:'Rotazione',bh:'BH013'},
    {stat_numb:'S054', stat_descr:'Positioning BH013',bh:'BH013'},
    {stat_numb:'S055',stat_descr:'Cobot in posizione fuori ingombro',bh:'BH013'}


  ];

router.get('/tasks-state', function(req, res, next) {
  var statNum = req.query.statnum;
  var status=req.query.status;
  var bh_str = req.query.bh;
  var descr = req.query.stat_descr;
  var str;
  switch (statNum) {
    // case "S000":
    //   str = '"Origin":"MW","Cobot":"Auto", "BH":"","Operation":"Start';
    //   break;

    case "S002":
      //str = '"Origin":"MW","Cobot":"Auto", "BH":"","Operation":"Verifica Positioning reciproco';
      str = '{"State": 2,"Origin":"DS","Body":"Start Positioning"}'
      break;

    case "S003":
      //str = '"Origin":"MW","Cobot":"Auto", "BH":"","Operation":"Positioning scocca OK';
      str = '{"State": 3,"Origin":"DS","Body":"Positioning OK"}'
      break;
//BH001
    case "S004":
     str = '{"State": 4,"Origin":"DS","Body":"BH001 Picking","Status":"' + status+ '" }'
      break;
    case "S005":
        str = '{"State": 5,"Origin":"PLC","Body":"Erogazione colla BH001", "Status":"' + status+ '" }'
         break;
    case "S006":
        str = '{"State": 6,"Origin":"ROS","Body":"Positioning BH001","Status":"' + status+ '" }'
         break;
    case "S007":
          str = '{"State": 7,"Origin":"DS","Body":"BH001 Cobot OOS","Status":"' + status+ '" }'
          break;
    //BH002
            case "S008":
              str = '{"State": 8,"Origin":"DS","Body":"BH002 Picking","Status":"' + status+ '" }'
               break;
             case "S009":
                 str = '{"State": 9,"Origin":"PLC","Body":"Erogazione colla BH002", "Status":"' + status+ '" }'
                  break;
             case "S010":
                 str = '{"State": 10,"Origin":"ROS","Body":"Positioning BH002","Status":"' + status+ '" }'
                  break;
             case "S011":
                   str = '{"State": 11,"Origin":"DS","Body":"BH002 Cobot OOS","Status":"' + status+ '" }'
                 break;   
     //BH003
     case "S012":
      str = '{"State": 12,"Origin":"DS","Body":"BH003 Picking","Status":"' + status+ '" }'
       break;
     case "S013":
         str = '{"State": 13,"Origin":"PLC","Body":"Erogazione colla BH003", "Status":"' + status+ '" }'
          break;
     case "S014":
         str = '{"State": 14,"Origin":"ROS","Body":"Positioning BH003","Status":"' + status+ '" }'
          break;
     case "S015":
           str = '{"State": 15,"Origin":"DS","Body":"BH003 Cobot OOS","Status":"' + status+ '" }'
         break;   
//BH004
case "S016":
  str = '{"State": 16,"Origin":"DS","Body":"BH004 Picking","Status":"' + status+ '" }'
   break;
 case "S017":
     str = '{"State": 17,"Origin":"PLC","Body":"Erogazione colla BH004", "Status":"' + status+ '" }'
      break;
 case "S018":
     str = '{"State": 18,"Origin":"ROS","Body":"Positioning BH004","Status":"' + status+ '" }'
      break;
 case "S019":
       str = '{"State": 19,"Origin":"DS","Body":"BH004 Cobot OOS","Status":"' + status+ '" }'
     break; 
//BH005
case "S020":
  str = '{"State": 20,"Origin":"DS","Body":"BH005 Picking","Status":"' + status+ '" }'
   break;
 case "S021":
     str = '{"State": 21,"Origin":"PLC","Body":"Erogazione colla BH005", "Status":"' + status+ '" }'
      break;
 case "S022":
     str = '{"State": 22,"Origin":"ROS","Body":"Positioning BH005","Status":"' + status+ '" }'
      break;
 case "S023":
       str = '{"State": 23,"Origin":"DS","Body":"BH005 Cobot OOS","Status":"' + status+ '" }'
     break;
//BH006
case "S024":
  str = '{"State": 24,"Origin":"DS","Body":"BH006 Picking","Status":"' + status+ '" }'
   break;
 case "S025":
     str = '{"State": 25,"Origin":"PLC","Body":"Erogazione colla BH006", "Status":"' + status+ '" }'
      break;
 case "S026":
       str = '{"State": 26,"Origin":"ROS","Body":"Positioning BH006","Status":"' + status+ '" }'
       break;
    case "S026.1":
     str = '{"State": 26,"Origin":"ROS","Body":"BH006 Cobot HO","Status":"' + status+ '" }'
      break;
 case "S029":
       str = '{"State": 29,"Origin":"DS","Body":"BH006 Cobot OOS","Status":"' + status+ '" }'
     break;
//BH007
case "S030":
  str = '{"State": 30,"Origin":"DS","Body":"BH007 Picking","Status":"' + status+ '" }'
   break;
 case "S031":
     str = '{"State": 31,"Origin":"PLC","Body":"Erogazione colla BH007", "Status":"' + status+ '" }'
      break;
 case "S032":
     str = '{"State": 32,"Origin":"ROS","Body":"Positioning BH007","Status":"' + status+ '" }'
      break;
 case "S033":
       str = '{"State": 33,"Origin":"DS","Body":"BH007 Cobot OOS","Status":"' + status+ '" }'
     break;
//BH008
case "S034":
  str = '{"State": 34,"Origin":"DS","Body":"BH008 Picking","Status":"' + status+ '" }'
   break;
 case "S035":
     str = '{"State": 35,"Origin":"PLC","Body":"Erogazione colla BH008", "Status":"' + status+ '" }'
      break;
 case "S036":
     str = '{"State": 36,"Origin":"ROS","Body":"Positioning BH008","Status":"' + status+ '","Error":"Collisione con il bordo della vasca" }'
    break;
    case "S036.1":
     str = '{"State": 36,"Origin":"ROS","Body":"BH008 Cobot HG","Error":"Collisione con il bordo della vasca","Status":"' + status+ '" }'
    break;
    case "S036.2":
     str = '{"State": 36,"Origin":"ROS","Body":"POI BH009","Status":"' + status+ '" }'
      break;
 case "S037":
       str = '{"State": 37,"Origin":"DS","Body":"BH008 Cobot OOS","Status":"' + status+ '" }'
     break;
//BH010
case "S039":
  str = '{"State": 39,"Origin":"DS","Body":"BH010 Picking","Status":"' + status+ '" }'
   break;
 case "S040":
     str = '{"State": 40,"Origin":"PLC","Body":"Erogazione colla BH010", "Status":"' + status+ '" }'
      break;
 case "S041":
     str = '{"State": 41,"Origin":"ROS","Body":"Positioning BH010","Status":"' + status+ '" }'
      break;
 case "S042":
       str = '{"State": 42,"Origin":"DS","Body":"BH010 Cobot OOS","Status":"' + status+ '" }'
     break;
//BH011
case "S043":
  str = '{"State": 43,"Origin":"DS","Body":"BH011 Picking","Status":"' + status+ '" }'
   break;
 case "S044":
     str = '{"State": 44,"Origin":"PLC","Body":"Erogazione colla BH011", "Status":"' + status+ '" }'
      break;
 case "S045":
     str = '{"State": 45,"Origin":"ROS","Body":"Positioning BH011","Status":"' + status+ '" }'
      break;
 case "S046":
       str = '{"State": 46,"Origin":"DS","Body":"BH011 Cobot OOS","Status":"' + status+ '" }'
     break;
//BH012
case "S047":
  str = '{"State": 47,"Origin":"DS","Body":"BH012 Picking","Status":"' + status+ '" }'
   break;
 case "S048":
     str = '{"State": 48,"Origin":"PLC","Body":"Erogazione colla BH012", "Status":"' + status+ '" }'
      break;
 case "S049":
     str = '{"State": 49,"Origin":"ROS","Body":"Positioning BH012","Status":"' + status+ '" }'
      break;
 case "S050":
       str = '{"State": 50,"Origin":"DS","Body":"BH012 Cobot OOS","Status":"' + status+ '" }'
     break;
//BH013
case "S051":
  str = '{"State": 51,"Origin":"DS","Body":"BH013 Picking","Status":"' + status+ '" }'
   break;
 case "S052":
     str = '{"State": 52,"Origin":"PLC","Body":"Erogazione colla BH013", "Status":"' + status+ '" }'
      break;
 case "S053":
     str = '{"State": 53,"Origin":"ROS","Body":"Rotation BH013","Status":"' + status+ '" }'
      break;
  case "S054":
        str = '{"State": 54,"Origin":"ROS","Body":"Positioning BH013","Status":"' + status+ '" }'
         break;
 case "S055":
       str = '{"State": 55,"Origin":"DS","Body":"BH013 Cobot OOS","Status":"' + status+ '" }'
     break;
  
  }
  var stringToSend = "{\"uc\":\"uc-b\",\"statNum\":\"" + statNum + "\","+ str + "\",\"status\":\"" + status + "\"}";
  //wss.broadcast(stringToSend);
  wss.broadcast(str);
  console.log("MSG broadcasted =" + str);
  res.render('tasks-state', { title: 'State Machine', statData : data});
});

module.exports = router;
