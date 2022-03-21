# UC-B-bck-end
Node js software developed to send events from shoopfloor to UI and smartwatch using SSE e WebSocket technology
the folders view and routes needs for running the simulator for UC-B. it is running on localhost:3000 to allow sending messages simulated from shopfloor to the back end.
ws-client-uc-b1.js connecting to the WebServer created in the node project (DS created by other partner of the project) and listening for the messages delivered from the framework of the control for the cobot (realized using ROS environment, initialli simulated by the stub) and forward them to the WebSocket port opened for communicating withthe GUI client running on Angular framework.
sse-server create a Server Sent events server to publish specific events generated for the smartwatch update, for instanse the user login to the UI, the errors on the glue erogation or BH positioning.
