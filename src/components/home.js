import React,{useContext,useState, useEffect} from "react";
import { AuthContext } from "./auth";
import { fapp } from "../firebase";
import Welcomeboard from "./welcomeboard";
import Chatscreen from "./chatscreen";
import { Redirect,Link } from "react-router-dom";

function Home(){

    const [error, setError] = useState([]);
    const [info, setInfo] = useState([]);
    const [name,setName] = useState([]);
    const[boo,setboo] = useState(0);
    const { currentUser } = useContext(AuthContext);


    useEffect(() => {
      fapp.firestore().collection("users").get().then((doc)=>{
          doc.forEach(element => {
            var data = element.data();
            setInfo(arr => [
                ...arr,
                data
            ]);
        });
          
      });
      
      
    }, [])



     function renderListUser () {
      if (info.length > 0) {
          let viewListUser = []
          info.forEach((item, index) => {
              if (item.id!==currentUser.uid) {
                  viewListUser.push(
                    <div className="flex mb-2 m-2">
                      <button
                          key={index}
                          className="flex"
                          onClick={() => {
                              setName(item.id);
                              setboo(1);
                          }}
                      >
                          <span className="p-1 h-18 w-18"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Google_Contacts_icon.svg/1200px-Google_Contacts_icon.svg.png" alt="image1" className="h-11 w-11 rounded-full" /></span>
                          <div className=" flex flex-col truncate">
            <p className=" truncate pt-2 text-lg pl-2 font-medium text-gray-800">{item.Displayname}</p>
          </div>
                      </button>
                      </div>
                  )
              }
          })
          return viewListUser
      } else {
          return null
      }
  }


  if (!currentUser) {
        return <Redirect to="/" />;
}




    return(
      <div className="flex ">
           <div className="h-screen overflow-y-scroll w-3/12 border border-black ">
              <div className="flex  flex-col mt-20">
                    {renderListUser()}
              </div>
           </div>
            {boo?(<Chatscreen name={name}/>):(<Welcomeboard />)}
      </div>
    );
}

export default Home;