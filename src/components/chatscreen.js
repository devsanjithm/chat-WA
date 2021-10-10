import React,{useContext,useState,useEffect} from "react";
import { AuthContext } from "./auth";
import { fapp } from "../firebase";
import moment from 'moment';
import { onSnapshot,collection } from "firebase/firestore";


function Chatscreen(props){


    const { currentUser } = useContext(AuthContext);
   const [listMessage,setListMessage] = useState([]);
    const [inputValue,setInputValue] = useState("");
    const [load,setLoad] = useState(true);
    const [val, setval] = useState(0);
    const [groupchatid,setGroupchatid] = useState("");
    var chatid="";
    var cupp = props.name.id;
    var removeListener = "";

    useEffect(() => {
        if (val === 0) {
            setval(1);
            nnew();
          }else{
            cupp = props.name.id;
            nnew();
          }
          return () => {
            if (removeListener) {
              removeListener = "";
            }
        }
      }, [props])

   function nnew (){
            if (removeListener) {
                removeListener = "";
            }
            if (
                
                hashString(currentUser.uid) <=
                hashString(cupp)
            ) {
                setGroupchatid(`${currentUser.uid}-${cupp}`)
                chatid=`${currentUser.uid}-${cupp}`;
            } else {
                setGroupchatid(`${cupp}-${currentUser.uid}`)
                chatid=`${cupp}-${currentUser.uid}`;
            }
            setListMessage([])
            const nstub =collection(fapp.firestore(),"messages", chatid,chatid);

            const unsubscribe = onSnapshot(nstub, (querySnapshot) => {
                querySnapshot.docChanges().forEach((doc) => {
                    var data = doc.doc.data();
                    if(doc.type === "added"){
                        setListMessage(listMessage=>listMessage.concat(data));
                    }
                });

            });
            setLoad(false)
            removeListener=unsubscribe;
    }

    if(load){
        return <p>loading...</p>
    }

    function hashString (str) {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
          hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
          hash = hash & hash // Convert to 32bit integer
      }
      return hash
    }
    
    function renderListMessage () {
       
      
      if (listMessage.length > 0) {
    
         var viewListMessage=[]

          listMessage.forEach((item, index) => {
              if (item.idFrom === currentUser.uid) {
                  // Item right (my message)
                 
                  if (item.type === 0) {
                      viewListMessage.push(
                        <div className="flex left">
                            <div className="m-2 grid bg-red-600 pl-2 pr-2 pt-1 pb-1 mr-2  text-black rounded-xl">
                                <span className="text-sm">{item.content}</span>
                            </div>
                        </div>
                    
                      )
                      }
                  
              } else {
                  // Item left (peer message)
                  if (item.type === 0) {
                      viewListMessage.push(
                        <div className="flex ">
                        <div className="m-2 grid bg-red-400 pl-2 pr-2 pt-1 pb-1 text-black rounded-xl">
                            <span className="text-sm">{item.content}</span>
                        </div>
                    </div>
                      )
                  
                  } 
              }
          })
          return viewListMessage
      }
    }
    
    
   
    
    const onSendMessage = (content, type) => {

      if (content.trim() === '') {
          return
      }
    
      const timestamp = moment()
          .valueOf()
          .toString()
    
      const itemMessage = {
          idFrom: currentUser.uid,
          idTo: cupp,
          timestamp: timestamp,
          content: content.trim(),
          type: type
      }
    console.log(groupchatid)
      fapp.firestore()
          .collection("messages")
          .doc(groupchatid)
          .collection(groupchatid)
          .doc(timestamp)
          .set(itemMessage)
          .then(() => {
             setInputValue("");
             
          })
          .catch(err => {
              console.log(err.message);
          })

          
    }
    
    function onKeyboardPress(event) {
        if (event.key === 'Enter') {
            onSendMessage(inputValue, 0)
        }
      }


    return(
           <div className="w-9/12 flex flex-col bg-green-50" >
             <div className="p-2 text-center text-xl border border-black font-medium bg-white">
                 {props.name.Displayname}
             </div>
             <div className="bg-gray-500 flex flex-col h-screen">
                <div className="overflow-y-scroll">
                        {renderListMessage()}
                    </div>
                </div>
             <div className="absolute flex justify-center border border-black bottom-0 w-9/12 p-4 right-0 bg-white">
                 <input type="text" onKeyUp={onKeyboardPress} onChange={(e)=>setInputValue(e.target.value)} placeholder="Type your messages" className=" p-2 border border-black w-8/12" value={inputValue} />
                 <span className="pl-4"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
               </svg></span>
             </div>
           </div>
    );

    
}




export default Chatscreen;