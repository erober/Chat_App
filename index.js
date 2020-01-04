const express=require('express')
const parser=require('body-parser')
const app=express()
const server=require('http').createServer(app)
const io=require('socket.io').listen(server)
const helmet=require('helmet')
const cors=require('cors')
const port=4000;

users=[]
connections=[]





app.use('*',(req,res,next)=>{
    res.set('Allow-Control-Allow-Origin','*')
    res.set('Allow-Control-Allow-Header','content-type')
    next()
})

app.use(helmet())
app.use(cors())
app.use(helmet.noCache())
app.use(parser.json())
app.use(parser.urlencoded({extended:true}))
app.use(cors({credentials: true, origin: 'http://localhost:4000'}));
app.use(express.static(__dirname+'/public'))

app.get('/',(req,res)=>
{
    res.sendFile(__dirname+'/index.html')
})

io.sockets.on('connection',function(socket)
{
    //On Connecting
    connections.push(socket)
    console.log("Connected. Now Online : "+connections.length)

    //On Disconnecting
    socket.on('disconnect',(data)=>
    {
        users.splice(users.indexOf(socket.username),1)
        updateUsernames()
        connections.splice(connections.indexOf(socket),1)
        console.log("Disconnected.Now Online"+connections.length)    
    })

    //On Message Sending
    socket.on('send message',(username,data)=>{
        
        if(!users.includes(username))
        {users.push(username);
        socket.username=username;
        updateUsernames();
        
        console.log(users);}
        io.sockets.emit('new message',username,data);
        
        });

        //Function For Updating Users
        function updateUsernames(){
            io.sockets.emit('get users',users);
        }




})



server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);