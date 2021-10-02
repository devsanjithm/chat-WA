import React,{useContext,useState} from "react";
import { AuthContext } from "./auth";
import { fapp } from "../firebase";
import { Redirect,Link } from "react-router-dom";

function Home(){

    const [error, setError] = useState([]);
    const [name,setName] = useState("");
    const { currentUser } = useContext(AuthContext);


    if (!currentUser) {
        console.log(currentUser)
        return <Redirect to="/" />;
    }else{
        fapp.firestore().collection(currentUser.uid).doc("users").get().then((doc) => {
         
          setName(doc.data().Displayname);
        }).catch((err) => {
          setError(err.message);
        });
    }


      function handlesubmit(e){
        e.preventDefault();
        fapp.auth().signOut().then(() => {

        }).catch((error) => {
            console.log(error.message);
        });
        return;
      }

      if (!currentUser) {
        console.log(currentUser)
        return <Redirect to="/" />;
    }



    return(
        <div>
            welcome to the chat app {name}.
            {error}
            <button onClick={handlesubmit}>Logout</button>
        </div>
    );
}
export default Home;