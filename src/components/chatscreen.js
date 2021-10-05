import React,{useContext,useState,useEffect} from "react";
import { AuthContext } from "./auth";
import { fapp } from "../firebase";
import moment from 'moment';
import { doc, onSnapshot,collection } from "firebase/firestore";



function Chatscreen(props){


    const [error, setError] = useState(0);
    const [name,setName] = useState("");
    const [currentPeerUser,setCurrentPeerUser] = useState(props.name);
    const { currentUser } = useContext(AuthContext);
    const [listMessage,setListMessage] = useState([]);
    const [groupChatId,setGroupChatId] = useState("");
    const [removeListener,setRemoveListener] = useState("");
    const [inputValue,setInputValue] = useState("");

    let listmess=[];

    useEffect(() => {

       const timer = setTimeout(() => {
        getListHistory();
      }, 5000);
      return () => clearTimeout(timer);
    },[])

    useEffect(() => {
      return () => {
        if (removeListener) {
          setRemoveListener();
        }
      }
    },50000)

    function ds (){
        if(error!=0){
            renderListMessage();
        }
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
        console.log("logged")
        console.log(listmess)
      if (listmess.length > 0) {
          console.log(listmess)
          console.log("logged")
          let viewListMessage = []
          listmess.forEach((item, index) => {
              if (item.idFrom === currentUser.uid) {
                  // Item right (my message)
                  if (item.type === 0) {
                      viewListMessage.push(
                          <div className="w-10 h-auto bg-red-500 text-left " key={item.timestamp}>
                              <span className="text-sm">{item.content}</span>
                          </div>
                      )
                      }
                  
              } else {
                  // Item left (peer message)
                  if (item.type === 0) {
                      viewListMessage.push(
                          <div className="w-10 text-left ml-2 -mb-2" key={item.timestamp}>
                              <div className="flex flex-row -mb-2">
                                  <div className="w-10 h-auto bg-purple-500 pl-2 pr-2 pt-1 pb-1 text-white">
                                      <span className="text-sm">{item.content}</span>
                                  </div>
                              </div>
                              {this.isLastMessageLeft(index) ? (
                                  <span className="text-gray-700 text-xs ml-4">
                  {moment(Number(item.timestamp)).format('ll')}
                </span>
                              ) : null}
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
          idTo: currentPeerUser,
          timestamp: timestamp,
          content: content.trim(),
          type: type
      }
    
      fapp.firestore()
          .collection("messages")
          .doc(groupChatId)
          .collection(groupChatId)
          .doc(timestamp)
          .set(itemMessage)
          .then(() => {
             setInputValue("");
          })
          .catch(err => {
              console.log(err.message);
          })
    }
    
    const getListHistory = () => {
      if (removeListener) {
          setRemoveListener();
      }
      listMessage.length = 0
      alert(`${currentUser.uid}-${currentPeerUser}`);
      var chatid="";
      if (
        
          hashString(currentUser.uid) <=
          hashString(currentPeerUser)
      ) {
          setGroupChatId(`${currentUser.uid}-${currentPeerUser}`);
          chatid=`${currentUser.uid}-${currentPeerUser}`;
      } else {
          setGroupChatId(`${currentPeerUser}-${currentUser.uid}`)
          chatid=`${currentPeerUser}-${currentUser.uid}`;
      }
    
      console.log("group"+chatid)
      // Get history and listen new data added
      const nstub =collection(fapp.firestore(),"messages", chatid,chatid);

         const unsubscribe = onSnapshot(nstub, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(listmess);
                listmess.push(doc.data());
            });

        });


      setRemoveListener(nstub)
      setError(1);
    }
    
    
    function onKeyboardPress(event) {
        if (event.key === 'Enter') {
            onSendMessage(inputValue, 0)
        }
      }


    return(
           <div className="w-9/12 flex flex-col bg-green-50 " >
             <div className="p-2 text-center text-xl border border-black font-medium bg-white">
                 {props.name}
             </div>
             <div className="flex flex-col overflow-y-scroll">
                    {renderListMessage()}
                </div>
             <div className="absolute flex justify-center border border-black bottom-0 w-9/12 p-4 right-0 bg-white">
                 <input type="text" onKeyUp={onKeyboardPress} onChange={(e)=>setInputValue(e.target.value)} placeholder="Type your messages" className=" p-2 border border-black w-8/12" />
                 <span className="pl-4"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
</svg></span>
             </div>
           </div>
    );

    
}



export default Chatscreen;