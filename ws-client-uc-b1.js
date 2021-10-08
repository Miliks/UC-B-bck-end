//questo è il client per TAIP simulato e il server per UI: TAIP simuliamo sulla porta 8300 e il server per il UI facciamo sulal porta 8200

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8200 });
const url = 'ws://localhost:8300'
const connection_taip = new WebSocket(url);
var basic_message;
var stat_num;
var bh;
var request = require('request')
var generic_uri = 'http://192.168.1.146:8080/events?'

connection_taip.onopen = () => {
  console.log("On open.....");

}
//ascoltiamo se il client HMI si è collegato sulla porta 8200 e 
wss.on('connection', function connection(ws) {

  ws.send('{"statNum":"S000","stat_descr":"Start", "status":"OK"}', function (response) {
    console.log("SEND Start message to the HMI connected cli  ent....")
  })
  //message arrived from HMI
  ws.on('message', function (mesasge) {
    var msg_recieved = JSON.parse(mesasge)
    //var array_colla = ["S005","S009","S013","S017","S021","S025","S031","S035","S040","S044","S048","S052"]
    console.log("msg recieved = " + JSON.stringify(msg_recieved))
    if (msg_recieved.state == "S002") {
      console.log("MSG state 2")
      //at this point i can try to connect to the TAIP WebSocket server and send it message with the start
      connection_taip.send('{"State": 1,"Origin":"HMI","Body":"Start","Status":""}')
    }
    else if ((msg_recieved.state == "S001")&&(msg_recieved.body=="")) {
      console.log("MSG state 1")
      //at this point i can try to connect to the TAIP WebSocket server and send it message with the start
      var event_uri = 'login=laura'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
    }
    else if (msg_recieved.state == "S005")
      connection_taip.send('{"State": 5,"Origin":"HMI","Status":"OK","Body":"Replacement completed"}');
    else if (msg_recieved.state == "S009")
      connection_taip.send('{"State": 9,"Origin":"HMI","Status":"OK","Body":"Replacement completed"}');
    else if (msg_recieved.state == "S013")
      connection_taip.send('{"State": 13,"Origin":"HMI","Status":"OK","Body":"Replacement completed"}');
    else if (msg_recieved.state == "S017")
      connection_taip.send('{"State": 17,"Origin":"HMI","Status":"OK","Body":"Replacement completed"}');
    else if (msg_recieved.state == "S021")
      connection_taip.send('{"State":21,"Origin":"HMI","Status":"OK","Body":"Replacement completed"}');
    else if (msg_recieved.state == "S025")
      connection_taip.send('{"State": 25,"Origin":"HMI","Status":"OK","Body":"Replacement completed"}');
    else if (msg_recieved.state == "S031")
      connection_taip.send('{"State": 31,"Origin":"HMI","Status":"OK","Body":"Replacement completed"}');
    else if (msg_recieved.state == "S035")
      connection_taip.send('{"State": 35,"Origin":"HMI","Status":"OK","Body":"Replacement completed"}');
    else if (msg_recieved.state == "S040")
      connection_taip.send('{"State": 40,"Origin":"HMI","Status":"OK","Body":"Replacement completed"}');
    else if (msg_recieved.state == "S044")
      connection_taip.send('{"State": 44,"Origin":"HMI","Status":"OK","Body":"Replacement completed"}');
    else if (msg_recieved.state == "S048")
      connection_taip.send('{"State": 48,"Origin":"HMI","Status":"OK","Body":"Replacement completed"}');
    else if (msg_recieved.state == "S052")
      connection_taip.send('{"State": 52,"Origin":"HMI","Status":"OK","Body":"Replacement completed"}');
    else if (msg_recieved.state == "S026") {
      connection_taip.send('{"State": 26,"Origin":"HMI", "Cobot":"Auto","BH":"BH006","Operation":"Hand over","Status":"OK"}')

    }
    else if (msg_recieved.state == "S100") {
      connection_taip.send('{"State": 100,"Origin":"HMI", "Body":"Paused","Status":"OK"}')

    }
    else if ((msg_recieved.state == "S001")&&(msg_recieved.body=="Exit")) {
      
      var event_uri = 'task_name=exit&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
// request(generic_uri + event_uri , function(er, resp, req){

// })
      //connection_taip.send('{"State": 100,"Origin":"HMI", "Body":"Paused","Status":"OK"}')

    }
    else if (msg_recieved.state == "S101") {
      connection_taip.send('{"State": 101,"Origin":"HMI", "Body":"UnPaused","Status":"OK"}')

    }
    else if (msg_recieved.state == "S036") {
      connection_taip.send('{"State": 36,"Origin":"HMI", “Cobot”:”Auto”,”BH”:”BH009",”Operation":"Hand guidance", "Status":"OK"}')

    }
     else if(msg_recieved.state == "S055"){
      // var msg_to_hmi = '{\"uc\":\"uc-b\",\"statNum\":\"S056\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":,\"Operation\":\"Generate report\",\"status\":\"OK\"}';
      //           ws.send(msg_to_hmi)
      ws.send('{"uc":"uc-b","statNum":"S056","Origin":"MW","Cobot":"Auto","BH":"","Operation":"Generate report", "status":"OK"}');
      console.log("Abbiamo ricevuto l'ACK from S055............")
    }

  })

  connection_taip.onerror = (error) => {
    console.log(`WebSocket error: ${error}`)
  }
  connection_taip.on('close', function () {
    console.log('TAIP socket close');
    setTimeout(connect, 5000);
  });
  //listen for the messages from TAIP and forward them to the UI
  connection_taip.onmessage = function (message) {
    var msg2 = JSON.parse(message.data)
    console.log("message =" + message.data)

    if (msg2.State == 2) {
      console.log("WE ARE in state S002")
      var msg_to_hmi = '{\"uc\":\"uc-b\",\"statNum\":\"S002\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"\",\"Operation\":\"Verifica Positioning reciproco\",\"status\":\"OK\"}';
      ///'{"Origin":"MW","Cobot":"Auto", "BH":"","Operation":"Verifica Positioning reciproco"'
      ws.send(msg_to_hmi);
    }
    else if (msg2.State == 3) {
      console.log("WE ARE in state S003")
      var msg_to_hmi = '{\"uc\":\"uc-b\",\"statNum\":\"S003\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"\",\"Operation\":\"Positioning scocca OK\",\"status\":\"OK\"}';
      ///'{"Origin":"MW","Cobot":"Auto", "BH":"","Operation":"Verifica Positioning reciproco"'
      ws.send(msg_to_hmi);
    }
    //BH001
    else if (msg2.Body.includes("BH001 Picking") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato 4 BH001 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S004\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH001\",\"Operation\":\"BH001 Picking OK\",\"status\":\"OK\"}';
      connection_taip.send('{"State": 4,"Origin":"HMI","ACK":1}');
      connection_taip.send('{"State": 5,"Origin":"HMI","Glue":1,"Body":"Glue BH001", "Status":"OK"}');
      ws.send(basic_message1);
    }
    else if (msg2.Body.includes("BH001 Picking") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato 4 BH001 NOK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S004\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH001\",\"Operation\":\"BH001 Picking NOK\",\"status\":\"NOK\"}';
      connection_taip.send('{"State": 4,"Origin":"HMI","ACK":1}');
      ws.send(basic_message1);
      var event_uri = 'task_name=presa&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
    }
    else if (msg2.Body.includes("Erogazione colla BH001") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Attesa adesivo BH001 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S005\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH001\",\"Operation\":\"BH001 Erogazione adesivo\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 5,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Erogazione colla BH001") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Attesa adesivo BH001 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S005\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH001\",\"Operation\":\"BH001 Attesa adesivo\",\"status\":\"NOK\"}';
      ws.send(basic_message1);
      var event_uri = 'task_name=rilascio colla&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
      connection_taip.send('{"State": 5,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Positioning BH001") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH001 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S006\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH001\",\"Operation\":\"BH001 Positioning\",\"Position\":\"POI 1\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 6,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("BH001 Cobot OOS") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH001 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S007\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH001\",\"Operation\":\"Cobot fuori ingombro\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 7,"Origin":"HMI","ACK":1}');
    }
    //BH002
    else if (msg2.Body.includes("BH002 Picking") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato 8 BH002 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S008\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH002\",\"Operation\":\"BH002 Picking OK\",\"status\":\"OK\"}';
      connection_taip.send('{"State": 8,"Origin":"HMI","ACK":1}');
      connection_taip.send('{"State": 9,"Origin":"HMI","Glue":1,"Body":"Glue BH002", "Status":"OK"}');
      ws.send(basic_message1);
    }
    else if (msg2.Body.includes("BH002 Picking") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato 8 BH002 NOK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S008\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH002\",\"Operation\":\"BH002 Picking NOK\",\"status\":\"NOK\"}';
      connection_taip.send('{"State": 8,"Origin":"HMI","ACK":1}');
      var event_uri = 'task_name=presa&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
      ws.send(basic_message1);
    }
    else if (msg2.Body.includes("Erogazione colla BH002") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Attesa adesivo BH001 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S009\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH002\",\"Operation\":\"BH002 Erogazione adesivo\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 9,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Erogazione colla BH002") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Attesa adesivo BH001 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S009\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH002\",\"Operation\":\"BH002 Attesa adesivo\",\"status\":\"NOK\"}';
      ws.send(basic_message1);
      var event_uri = 'task_name=rilascio colla&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
      connection_taip.send('{"State": 9,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Positioning BH002") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH001 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S010\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH002\",\"Operation\":\"BH002 Positioning\",\"Position\":\"POI 2\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 10,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("BH002 Cobot OOS") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH002 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S011\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH002\",\"Operation\":\"Cobot fuori ingombro\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 11,"Origin":"HMI","ACK":1}');
    }
    //BH003
    else if (msg2.Body.includes("BH003 Picking") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato 12 BH003 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S012\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH003\",\"Operation\":\"BH003 Picking OK\",\"status\":\"OK\"}';
      connection_taip.send('{"State": 12,"Origin":"HMI","ACK":1}');
      connection_taip.send('{"State": 13,"Origin":"HMI","Glue":1,"Body":"Glue BH003", "Status":"OK"}');
      ws.send(basic_message1);
    }
    else if (msg2.Body.includes("BH003 Picking") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato 12 BH003 NOK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S012\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH003\",\"Operation\":\"BH003 Picking NOK\",\"status\":\"NOK\"}';
      connection_taip.send('{"State": 12,"Origin":"HMI","ACK":1}');
      ws.send(basic_message1);
      var event_uri = 'task_name=presa&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
    }
    else if (msg2.Body.includes("Erogazione colla BH003") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Attesa adesivo BH003 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S013\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH003\",\"Operation\":\"BH003 Erogazione adesivo\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 13,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Erogazione colla BH003") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Attesa adesivo BH003 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S013\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH003\",\"Operation\":\"BH003 Attesa adesivo\",\"status\":\"NOK\"}';
      ws.send(basic_message1);
      var event_uri = 'task_name=rilascio colla&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
      connection_taip.send('{"State": 13,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Positioning BH003") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH003 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S014\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH003\",\"Operation\":\"BH003 Positioning\",\"Position\":\"POI 3\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 14,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("BH003 Cobot OOS") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH003 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S015\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH003\",\"Operation\":\"Cobot fuori ingombro\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 15,"Origin":"HMI","ACK":1}');
    }
    //BH004
    else if (msg2.Body.includes("BH004 Picking") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato 16 BH004 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S016\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH004\",\"Operation\":\"BH004 Picking OK\",\"status\":\"OK\"}';
      connection_taip.send('{"State": 16,"Origin":"HMI","ACK":1}');
      connection_taip.send('{"State": 17,"Origin":"HMI","Glue":2,"Body":"Glue BH004", "Status":"OK"}');
      ws.send(basic_message1);
    }
    else if (msg2.Body.includes("BH004 Picking") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato 16 BH004 NOK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S016\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH004\",\"Operation\":\"BH004 Picking NOK\",\"status\":\"NOK\"}';
      connection_taip.send('{"State": 16,"Origin":"HMI","ACK":1}');
      ws.send(basic_message1);
      var event_uri = 'task_name=presa&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
    }
    else if (msg2.Body.includes("Erogazione colla BH004") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Attesa adesivo BH004 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S017\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH004\",\"Operation\":\"BH004 Erogazione adesivo\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 17,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Erogazione colla BH004") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Attesa adesivo BH004 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S017\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH004\",\"Operation\":\"BH004 Attesa adesivo\",\"status\":\"NOK\"}';
      ws.send(basic_message1);
      var event_uri = 'task_name=rilascio colla&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
      connection_taip.send('{"State": 17,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Positioning BH004") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH004 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S018\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH004\",\"Operation\":\"BH004 Positioning\",\"Position\":\"POI 4\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 18,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("BH004 Cobot OOS") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH003 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S019\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH004\",\"Operation\":\"Cobot fuori ingombro\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 19,"Origin":"HMI","ACK":1}');
    }
    //BH005
    else if (msg2.Body.includes("BH005 Picking") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato 20 BH005 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S020\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH005\",\"Operation\":\"BH005 Picking OK\",\"status\":\"OK\"}';
      connection_taip.send('{"State": 20,"Origin":"HMI","ACK":1}');
      connection_taip.send('{"State": 21,"Origin":"HMI","Glue":1,"Body":"Glue BH005", "Status":"OK"}');
      ws.send(basic_message1);
    }
    else if (msg2.Body.includes("BH005 Picking") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato 20 BH005 NOK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S020\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH005\",\"Operation\":\"BH005 Picking NOK\",\"status\":\"NOK\"}';
      connection_taip.send('{"State": 20,"Origin":"HMI","ACK":1}');
      ws.send(basic_message1);
      var event_uri = 'task_name=presa&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
    }
    else if (msg2.Body.includes("Erogazione colla BH005") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Attesa adesivo BH005 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S021\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH005\",\"Operation\":\"BH005 Erogazione adesivo\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 21,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Erogazione colla BH005") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Attesa adesivo BH005 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S021\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH005\",\"Operation\":\"BH005 Attesa adesivo\",\"status\":\"NOK\"}';
      ws.send(basic_message1);
      var event_uri = 'task_name=rilascio colla&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
      connection_taip.send('{"State": 21,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Positioning BH005") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH005 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S022\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH005\",\"Operation\":\"BH005 Positioning\",\"Position\":\"POI 5\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 22,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("BH005 Cobot OOS") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH005 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S023\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH005\",\"Operation\":\"Cobot fuori ingombro\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 23,"Origin":"HMI","ACK":1}');
    }

    //BH006
    else if (msg2.Body.includes("BH006 Picking") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato 24 BH006 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S024\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH006\",\"Operation\":\"BH006 Picking OK\",\"status\":\"OK\"}';
      connection_taip.send('{"State": 24,"Origin":"HMI","ACK":1}');
      connection_taip.send('{"State": 25,"Origin":"HMI","Glue":1,"Body":"Glue BH006", "Status":"OK"}');
      ws.send(basic_message1);
    }
    else if (msg2.Body.includes("BH006 Picking") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato 24 BH006 NOK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S024\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH006\",\"Operation\":\"BH006 Picking NOK\",\"status\":\"NOK\"}';
      connection_taip.send('{"State": 24,"Origin":"HMI","ACK":1}');
      ws.send(basic_message1);
      var event_uri = 'task_name=presa&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
    }
    else if (msg2.Body.includes("Erogazione colla BH006") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Attesa adesivo BH006 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S025\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH006\",\"Operation\":\"BH006 Erogazione adesivo\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 25,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Erogazione colla BH006") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Attesa adesivo BH006 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S025\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH006\",\"Operation\":\"BH006 Attesa adesivo\",\"status\":\"NOK\"}';
      ws.send(basic_message1);
      var event_uri = 'task_name=rilascio colla&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
      connection_taip.send('{"State": 25,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Positioning BH006") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH005 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S026\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH006\",\"Operation\":\"BH006 Positioning\",\"Position\":\"POI 6\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 26,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Positioning BH006") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Positioning BH006 NOK")
      var error_val = msg2.Error;
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S026\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH006\",\"Operation\":\"BH006 Positioning\",\"Position\":\"POI 6\",\"Suggestions\":[\"POI 6\"],\"status\":\"NOK\",\"Error\":\"' + error_val + '\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 26,"Origin":"HMI","ACK":1}');
      var event_uri = 'task_name=inserimento&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })

    }
    else if (msg2.Body.includes("BH006 Cobot HO") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato HO BH006 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S026\",\"Origin\":\"MW\",\"Cobot\":\"Hand Over\",\"BH\":\"BH006\",\"Operation\":\"BH006 Hand Over\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 26,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("BH006 Cobot OOS") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH005 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S029\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH006\",\"Operation\":\"Cobot fuori ingombro\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 29,"Origin":"HMI","ACK":1}');
    }
    //BH007
    else if (msg2.Body.includes("BH007 Picking") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato 30 BH007 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S030\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH007\",\"Operation\":\"BH007 Picking OK\",\"status\":\"OK\"}';
      connection_taip.send('{"State": 30,"Origin":"HMI","ACK":1}');
      connection_taip.send('{"State": 31,"Origin":"HMI","Glue":2,"Body":"Glue BH007", "Status":"OK"}');
      ws.send(basic_message1);
    }
    else if (msg2.Body.includes("BH007 Picking") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato 30 BH007 NOK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S030\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH007\",\"Operation\":\"BH007 Picking NOK\",\"status\":\"NOK\"}';
      connection_taip.send('{"State": 30,"Origin":"HMI","ACK":1}');
      ws.send(basic_message1);
      var event_uri = 'task_name=presa&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
    }
    else if (msg2.Body.includes("Erogazione colla BH007") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Attesa adesivo BH007 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S031\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH007\",\"Operation\":\"BH007 Erogazione adesivo\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 31,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Erogazione colla BH007") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Attesa adesivo BH007 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S031\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH007\",\"Operation\":\"BH007 Attesa adesivo\",\"status\":\"NOK\"}';
      ws.send(basic_message1);
      var event_uri = 'task_name=rilascio colla&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
      connection_taip.send('{"State": 31,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Positioning BH007") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH007 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S032\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH007\",\"Operation\":\"BH007 Positioning\",\"Position\":\"POI 7\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 32,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("BH007 Cobot OOS") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH007 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S033\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH007\",\"Operation\":\"Cobot fuori ingombro\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 33,"Origin":"HMI","ACK":1}');
    }
    //BH008
    else if (msg2.Body.includes("BH008 Picking") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato 34 BH008 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S034\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH008\",\"Operation\":\"BH008 Picking OK\",\"status\":\"OK\"}';
      connection_taip.send('{"State": 34,"Origin":"HMI","ACK":1}');
      connection_taip.send('{"State": 35,"Origin":"HMI","Glue":1,"Body":"Glue BH008", "Status":"OK"}');
      ws.send(basic_message1);
    }
    else if (msg2.Body.includes("BH008 Picking") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato 34 BH008 NOK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S034\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH008\",\"Operation\":\"BH008 Picking NOK\",\"status\":\"NOK\"}';
      connection_taip.send('{"State": 34,"Origin":"HMI","ACK":1}');
      ws.send(basic_message1);
      var event_uri = 'task_name=presa&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
    }
    else if (msg2.Body.includes("Erogazione colla BH008") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Attesa adesivo BH008 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S035\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH008\",\"Operation\":\"BH008 Erogazione adesivo\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 35,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Erogazione colla BH008") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Attesa adesivo BH008 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S035\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH008\",\"Operation\":\"BH008 Attesa adesivo\",\"status\":\"NOK\"}';
      ws.send(basic_message1);
      var event_uri = 'task_name=rilascio colla&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
      connection_taip.send('{"State": 35,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Positioning BH008") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH008 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S036\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH008\",\"Operation\":\"BH008 Positioning\",\"Position\":\"POI 8\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 36,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Positioning BH008") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Positioning BH008 NOK, Error = ")
      var error_val = msg2.Error;
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S036\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH008\",\"Operation\":\"BH008 Positioning\",\"Position\":\"POI 8\",\"Suggestions\":[\"POI 9\",\"POI 10\"],\"status\":\"NOK\",\"Error\":\"' + error_val + '\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 36,"Origin":"HMI","ACK":1}');
      var event_uri = 'task_name=inserimento&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })

    }
    else if (msg2.Body.includes("BH008 Cobot HG") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato HG BH008 OK - + msg2.Error" + msg2.Error)
      var error_val = msg2.Error;
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S036\",\"Origin\":\"MW\",\"Cobot\":\"Hand Guidance\",\"BH\":\"BH008\",\"Operation\":\"BH008 Hand Guidance\",\"status\":\"OK\",\"Error\":\"' + error_val + '\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 36,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("POI BH009") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato POI BH008 OK")

      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S036\",\"Origin\":\"MW\",\"Cobot\":\"Hand Guidance\",\"BH\":\"BH008\",\"Operation\":\"BH008 Hand Guidance\",\"Position\":[\"POI 9\"],\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 36,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("BH008 Cobot OOS") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Cobot OOS BH008 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S037\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH008\",\"Operation\":\"Cobot fuori ingombro\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 37,"Origin":"HMI","ACK":1}');
    }
    //BH010
    else if (msg2.Body.includes("BH010 Picking") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato 39 BH010 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S039\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH010\",\"Operation\":\"BH010 Picking OK\",\"status\":\"OK\"}';
      connection_taip.send('{"State": 39,"Origin":"HMI","ACK":1}');
      connection_taip.send('{"State": 40,"Origin":"HMI","Glue":1,"Body":"Glue BH010", "Status":"OK"}');
      ws.send(basic_message1);
    }
    else if (msg2.Body.includes("BH010 Picking") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato 39 BH010 NOK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S039\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH010\",\"Operation\":\"BH010 Picking NOK\",\"status\":\"NOK\"}';
      connection_taip.send('{"State": 39,"Origin":"HMI","ACK":1}');
      ws.send(basic_message1);
      var event_uri = 'task_name=presa&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
    }
    else if (msg2.Body.includes("Erogazione colla BH010") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Attesa adesivo BH010 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S040\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH010\",\"Operation\":\"BH010 Erogazione adesivo\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 40,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Erogazione colla BH010") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Attesa adesivo BH010 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S040\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH010\",\"Operation\":\"BH010 Attesa adesivo\",\"status\":\"NOK\"}';
      ws.send(basic_message1);
      var event_uri = 'task_name=rilascio colla&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
      connection_taip.send('{"State": 40,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Positioning BH010") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH007 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S041\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH010\",\"Operation\":\"BH010 Positioning\",\"Position\":\"POI 10\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 41,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("BH010 Cobot OOS") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH010 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S042\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH010\",\"Operation\":\"Cobot fuori ingombro\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 42,"Origin":"HMI","ACK":1}');
    }
    //BH011
    else if (msg2.Body.includes("BH011 Picking") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato 43 BH011 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S043\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH011\",\"Operation\":\"BH011 Picking OK\",\"status\":\"OK\"}';
      connection_taip.send('{"State": 43,"Origin":"HMI","ACK":1}');
      connection_taip.send('{"State": 44,"Origin":"HMI","Glue":2,"Body":"Glue BH011", "Status":"OK"}');
      ws.send(basic_message1);
    }
    else if (msg2.Body.includes("BH011 Picking") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato 43 BH011 NOK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S043\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH011\",\"Operation\":\"BH011 Picking NOK\",\"status\":\"NOK\"}';
      connection_taip.send('{"State": 43,"Origin":"HMI","ACK":1}');
      ws.send(basic_message1);
      var event_uri = 'task_name=presa&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
    }
    else if (msg2.Body.includes("Erogazione colla BH011") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Attesa adesivo BH010 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S044\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH011\",\"Operation\":\"BH011 Erogazione adesivo\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 44,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Erogazione colla BH011") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Attesa adesivo BH011 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S044\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH011\",\"Operation\":\"BH011 Attesa adesivo\",\"status\":\"NOK\"}';
      ws.send(basic_message1);
      var event_uri = 'task_name=rilascio colla&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
      connection_taip.send('{"State": 44,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Positioning BH011") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH011 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S045\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH011\",\"Operation\":\"BH011 Positioning\",\"Position\":\"POI 11\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 45,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("BH011 Cobot OOS") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH011 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S046\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH011\",\"Operation\":\"Cobot fuori ingombro\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 46,"Origin":"HMI","ACK":1}');
    }
    //BH012
    else if (msg2.Body.includes("BH012 Picking") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato 47 BH012 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S047\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH012\",\"Operation\":\"BH012 Picking OK\",\"status\":\"OK\"}';
      connection_taip.send('{"State": 47,"Origin":"HMI","ACK":1}');
      connection_taip.send('{"State": 48,"Origin":"HMI","Glue":2,"Body":"Glue BH012", "Status":"OK"}');
      ws.send(basic_message1);
    }
    else if (msg2.Body.includes("BH012 Picking") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato 47 BH012 NOK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S047\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH012\",\"Operation\":\"BH012 Picking NOK\",\"status\":\"NOK\"}';
      connection_taip.send('{"State": 47,"Origin":"HMI","ACK":1}');
      ws.send(basic_message1);
      var event_uri = 'task_name=presa&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
    }
    else if (msg2.Body.includes("Erogazione colla BH012") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Attesa adesivo BH012 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S048\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH012\",\"Operation\":\"BH012 Erogazione adesivo\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 48,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Erogazione colla BH012") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Attesa adesivo BH012 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S048\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH012\",\"Operation\":\"BH012 Attesa adesivo\",\"status\":\"NOK\"}';
      ws.send(basic_message1);
      var event_uri = 'task_name=rilascio colla&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
      connection_taip.send('{"State": 48,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Positioning BH012") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH012 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S049\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH012\",\"Operation\":\"BH012 Positioning\",\"Position\":\"POI 12\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 49,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("BH012 Cobot OOS") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH012 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S050\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH012\",\"Operation\":\"Cobot fuori ingombro\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 50,"Origin":"HMI","ACK":1}');
    }
    //BH013
    else if (msg2.Body.includes("BH013 Picking") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato 51 BH012 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S051\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH013\",\"Operation\":\"BH013 Picking OK\",\"status\":\"OK\"}';
      connection_taip.send('{"State": 51,"Origin":"HMI","ACK":1}');
      connection_taip.send('{"State": 52,"Origin":"HMI","Glue":2,"Body":"Glue BH013", "Status":"OK"}');
      ws.send(basic_message1);
    }
    else if (msg2.Body.includes("BH013 Picking") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato 51 BH012 NOK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S051\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH013\",\"Operation\":\"BH013 Picking NOK\",\"status\":\"NOK\"}';
      connection_taip.send('{"State": 51,"Origin":"HMI","ACK":1}');
      ws.send(basic_message1);
      var event_uri = 'task_name=presa&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
    }
    else if (msg2.Body.includes("Erogazione colla BH013") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Attesa adesivo BH013 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S052\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH013\",\"Operation\":\"BH013 Erogazione adesivo\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 52,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Erogazione colla BH013") && (msg2.Status == "NOK")) {
      console.log("Siamo nello stato Attesa adesivo BH013 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S052\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH013\",\"Operation\":\"BH013 Attesa adesivo\",\"status\":\"NOK\"}';
      ws.send(basic_message1);
      var event_uri = 'task_name=rilascio colla&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })
      connection_taip.send('{"State": 52,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("Rotation BH013") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Rotazione scocca BH013 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S053\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH013\",\"Operation\":\"BH013 Rotazione scocca\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 53,"Origin":"HMI","ACK":1}');
      var event_uri = 'task_name=rotazione&status=NOK'
      var uri = generic_uri + event_uri
      console.log("URI = " + uri)
      request(uri, function(er, resp,request){
        console.log("REQUEST = " + request)
      })

    }
    else if (msg2.Body.includes("Positioning BH013") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH013 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S054\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH013\",\"Operation\":\"BH013 Positioning\",\"Position\":\"POI 13\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      connection_taip.send('{"State": 54,"Origin":"HMI","ACK":1}');

    }
    else if (msg2.Body.includes("BH013 Cobot OOS") && (msg2.Status == "OK")) {
      console.log("Siamo nello stato Positioning BH013 OK")
      var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S055\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH013\",\"Operation\":\"Cobot fuori ingombro\",\"status\":\"OK\"}';
      ws.send(basic_message1);
      //connection_taip.send('{"State": 55,"Origin":"HMI","ACK":1}');  
      console.log("BEFORE REPORT");
      // var msg_to_hmi = '{\"uc\":\"uc-b\",\"statNum\":\"S056\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":,\"Operation\":\"Generate report\",\"status\":\"OK\"}';
      // ws.send(msg_to_hmi);
    }
    // else if(msg2.Body.includes("Positioning BH001")&&(msg2.Status=="NOK")){
    //   console.log("Siamo nello stato Positioning BH001 OK")
    //   var basic_message1 = '{\"uc\":\"uc-b\",\"statNum\":\"S006\",\"Origin\":\"MW\",\"Cobot\":\"Auto\",\"BH\":\"BH001\",\"Operation\":\"BH001 Positioning\",\"Position\":\"POI 1\",\"status\":\"OK\"}';
    //   ws.send(basic_message1);    
    //   connection_taip.send('{"State": 6,"Origin":"HMI","ACK":1}');    

    // }

  }

})





