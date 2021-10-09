import React,{useState,useContext,useEffect} from "react";
import { fapp } from "../firebase";
import { AuthContext } from "./auth";
import { Redirect,Link,useHistory } from "react-router-dom";
import validator from 'validator';

function Login(){

    const [now,setNow] = useState("");
    const [emailcheck, setEmailcheck] = useState("");
    const [passwordcheck, setPasswordcheck] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();
    const { currentUser } = useContext(AuthContext);



    const handleSubmit = (e) => {
        e.preventDefault();
        fapp.auth().signInWithEmailAndPassword(emailcheck, passwordcheck)
            .then(user => {
                console.log(user)
                if(user.user.emailVerified){
                    setNow(true);
                    console.log("Login Successfully !")
                }else{
                    setNow(false);
                    fapp.auth().signOut();
                    setError("Your email is not verified. Please check your mail-id and verify.")
                }
                
            })
            .catch((error) => {
                console.log(error.code);
                if(error.code===("auth/user-not-found")){
                    setError("Email not found. Create new account");
                }else{
                    setError("Invalid Credentials");
                }
                
            });

    }

    function inputcheck(){
        if (emailcheck !== "") {
            if (validator.isEmail(emailcheck)) {
                if (emailcheck.length !== 0 && passwordcheck.length !== 0) {
                    document.getElementById("logbtn").disabled = false;
                } else {
                    document.getElementById("logbtn").disabled = true;
                }
            }else{
                document.getElementById("logbtn").disabled = true;
            }
        }else{
            document.getElementById("logbtn").disabled = true;
        }
    }


   

    
    
    if (currentUser) {
      if(now){
            console.log(currentUser)
            return <Redirect to="/home" />;
      }
    }

    return(
        <div class="bg-red-50 min-h-screen flex items-center justify-center">
            <div class = "w-11/12 sm:w-3/5 bg-white text-black rounded-2xl flex justify-center mb-28 h-auto">
                <div class="text-black"><h1 class="flex justify-center font-bold text-2xl sm:text-xl my-8">Hello Again</h1>
                <form class="flex flex-col" onSubmit={handleSubmit}>
                <div class="mb-5">
                    <label class="mr-24 text-grey-darker text-sm font-bold ml-5 sm:text-lg mb-2" htmlFor="email">
                       Email
                    </label>
                    <input class=" mt-2 shadow  rounded w-11/12 ml-5 py-1 px-3 text-grey-darker focus:outline-none focus:border-red-400 border" id="username" type="text" placeholder="Email-id" onKeyUp={inputcheck} onChange={(e) => setEmailcheck(e.target.value)} />
                </div>
               
                <div class="">
                    <label class=" text-grey-darker text-sm font-bold ml-5 mb-2 sm:text-lg" htmlFor="password">
                        Password
                    </label>
                    <input class="shadow mt-2   rounded w-11/12 ml-5 py-1 px-3 mb-2 text-grey-darker focus:outline-none border focus:border-red-400" id="password" type="password" placeholder="Password" onKeyUp={inputcheck} onChange={(e) => setPasswordcheck(e.target.value)} />
                </div>
                <div class="mb-5 ml-auto mr-9 text-red-500">
                    <p class="text-xs sm:text-sm">
                    Forgot Your Passoword ?</p>
                </div>
                <div class="mb-6">
                    <button type="submit" class="flex justify-center items-center focus:outline-none text-white text-sm sm:text-base bg-red-600 disabled:opacity-50 rounded  w-5/6 transition ml-8 py-2 px-3 duration-150 ease-in" id="logbtn" disabled>LOGIN</button>
                </div>
                <div class="text-gray-500 flex  text-justify justify-center mx-14 mb-4">
                    {error}
                </div>
                <div class="inline-flex justify-center items-center font-bold text-red-500 mb-5 text-xs sm:text-sm text-center"><p class="text-sm sm:text-lg">
                 <Link to="/signup">You don't have an account ? Sign Up</Link></p>
                </div>
                </form>
                </div>
            </div>
        </div>
    );
}
export default Login;