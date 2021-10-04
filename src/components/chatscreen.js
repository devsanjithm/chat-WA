import React,{useContext,useState,useEffect} from "react";
import { AuthContext } from "./auth";
import { fapp } from "../firebase";
import moment from 'moment';



function Chatscreen(props){


    const [error, setError] = useState([]);
    const [name,setName] = useState("");
    const [currentPeerUser,setCurrentPeerUser] = useState(props.name);
    const { currentUser } = useContext(AuthContext);
    const [listMessage,setListMessage] = useState([]);
    const [groupChatId,setGroupChatId] = useState("");
    const [removeListener,setRemoveListener] = useState("");
    const [inputValue,setInputValue] = useState("");


    useEffect(() => {
       getListHistory();
    }, [])

    useEffect(() => {
      return () => {
        if (this.removeListener) {
          this.removeListener()
        }
      }
    }, [])



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
          let viewListMessage = []
          listMessage.forEach((item, index) => {
              if (item.idFrom === currentUser) {
                  // Item right (my message)
                  if (item.type === 0) {
                      viewListMessage.push(
                          <div className="viewItemRight" key={item.timestamp}>
                              <span className="textContentItem">{item.content}</span>
                          </div>
                      )
                  } else if (item.type === 1) {
                      viewListMessage.push(
                          <div className="viewItemRight2" key={item.timestamp}>
                              <img
                                  className="imgItemRight"
                                  src={item.content}
                                  alt="content message"
                              />
                          </div>
                      )
                  } else {
                      viewListMessage.push(
                          <div className="viewItemRight3" key={item.timestamp}>
                              <img
                                  className="imgItemRight"
                                  src={this.getGifImage(item.content)}
                                  alt="content message"
                              />
                          </div>
                      )
                  }
              } else {
                  // Item left (peer message)
                  if (item.type === 0) {
                      viewListMessage.push(
                          <div className="viewWrapItemLeft" key={item.timestamp}>
                              <div className="viewWrapItemLeft3">
                                  {this.isLastMessageLeft(index) ? (
                                      <img
                                          src={currentPeerUser.photoUrl}
                                          alt="avatar"
                                          className="peerAvatarLeft"
                                      />
                                  ) : (
                                      <div className="viewPaddingLeft"/>
                                  )}
                                  <div className="viewItemLeft">
                                      <span className="textContentItem">{item.content}</span>
                                  </div>
                              </div>
                              {this.isLastMessageLeft(index) ? (
                                  <span className="textTimeLeft">
                  {moment(Number(item.timestamp)).format('ll')}
                </span>
                              ) : null}
                          </div>
                      )
                  } else if (item.type === 1) {
                      viewListMessage.push(
                          <div className="viewWrapItemLeft2" key={item.timestamp}>
                              <div className="viewWrapItemLeft3">
                                  {this.isLastMessageLeft(index) ? (
                                      <img
                                          src={currentPeerUser.photoUrl}
                                          alt="avatar"
                                          className="peerAvatarLeft"
                                      />
                                  ) : (
                                      <div className="viewPaddingLeft"/>
                                  )}
                                  <div className="viewItemLeft2">
                                      <img
                                          className="imgItemLeft"
                                          src={item.content}
                                          alt="content message"
                                      />
                                  </div>
                              </div>
                              {this.isLastMessageLeft(index) ? (
                                  <span className="textTimeLeft">
                  {moment(Number(item.timestamp)).format('ll')}
                </span>
                              ) : null}
                          </div>
                      )
                  } else {
                      viewListMessage.push(
                          <div className="viewWrapItemLeft2" key={item.timestamp}>
                              <div className="viewWrapItemLeft3">
                                  {this.isLastMessageLeft(index) ? (
                                      <img
                                          src={currentPeerUser.photoUrl}
                                          alt="avatar"
                                          className="peerAvatarLeft"
                                      />
                                  ) : (
                                      <div className="viewPaddingLeft"/>
                                  )}
                                  <div className="viewItemLeft3" key={item.timestamp}>
                                      <img
                                          className="imgItemLeft"
                                          src={this.getGifImage(item.content)}
                                          alt="content message"
                                      />
                                  </div>
                              </div>
                              {this.isLastMessageLeft(index) ? (
                                  <span className="textTimeLeft">
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
    
    
     function isLastMessageLeft(index) {
      if (
          (index + 1 < this.listMessage.length &&
              this.listMessage[index + 1].idFrom === this.currentUserId) ||
          index === this.listMessage.length - 1
      ) {
          return true
      } else {
          return false
      }
    }
    
     const onKeyboardPress = event => {
      if (event.key === 'Enter') {
          onSendMessage(inputValue, 0)
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
          idFrom: currentUser.id,
          idTo: currentPeerUser.id,
          timestamp: timestamp,
          content: content.trim(),
          type: type
      }
    
      fapp.firestore()
          .collection("messages")
          .doc(this.groupChatId)
          .collection(this.groupChatId)
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
          removeListener()
      }
      listMessage.length = 0
      alert("ji"+currentPeerUser);
      if (
        
          hashString(currentUser.uid) <=
          hashString(currentPeerUser  )
      ) {
          setGroupChatId(`${currentUser}-${currentPeerUser}`);
      } else {
          setGroupChatId(`${this.currentPeerUser.id}-${currentUser}`)
      }
    
      // Get history and listen new data added
      setRemoveListener(fapp.firestore()
          .collection("messages")
          .doc(groupChatId)
          .collection(groupChatId)
          .onSnapshot(
              snapshot => {
                  snapshot.docChanges().forEach(change => {
                      if (change.type === "added") {
                          listMessage.push(change.doc.data())
                      }
                  })
              },
              err => {
                  this.props.showToast(0, err.toString())
              }
      ))
    }
    
    function isLastMessageRight(index) {
      if (
          (index + 1 < listMessage.length &&
              listMessage[index + 1].idFrom !== currentUser) ||
          index === listMessage.length - 1
      ) {
          return true
      } else {
          return false
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
                 <input type="text" onChange={(e)=>setInputValue(e.target.value)} placeholder="Type your messages" className=" p-2 border border-black w-8/12" />
                 <span className="pl-4"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
</svg></span>
             </div>
           </div>
    );
}


export default Chatscreen;