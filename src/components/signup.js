import React, { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { fapp } from "../firebase";
import validator from 'validator';
import { AuthContext } from "./auth";

function Signup(){


    const [email, setEmail] = useState("");
    const [displayname, setDisplayname] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const [now, setNow] = useState(true);
    const [userExists, alreadyUserExists] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        fapp.auth().createUserWithEmailAndPassword(email, password)
            .then(user => {
                console.log(user)
                setNow(false);
                alert("Account created Successfully")
                fapp.firestore().collection("users").doc(user.user.uid).set({ Email: email, password: password, Displayname: displayname, PhoneNumber: phone, Username:username}).then(() => {
                    
                    user.user.sendEmailVerification().then(() => {
                        alert("Verification Email is send");
                        setRedirect(true);    
                        fapp.auth().signOut();
                    }).catch((err) => {
                        setError("Try after some time");
                        alert(err.message)
                    })
                }).catch((err) => {
                    setError(err.message);
                })
            }).catch(err => {
                console.log(err)
                alert("User already existes")
                alreadyUserExists(true)
            });
    }

    if (redirect) {
        return <Redirect to="/Login" />;
    }

    if (currentUser) {
        if (now) {
            return <Redirect to="/login" />;
        }
    }
    
    if (userExists) {
        return <Redirect to="/Login" />;
    }



    function inputcheck(){
        if (email !== "") {
            if (validator.isEmail(email)) {
                var name   = email.substring(0, email.lastIndexOf("@"));
                setUsername(name);
                if (password.length >= 6) {
                    if(displayname.length >= 5){
                        if(phone.length ===10){
                            document.getElementById("logbtn").disabled = false;
                        }else{
                            document.getElementById("logbtn").disabled = true;
                        }
                    }else{
                        document.getElementById("logbtn").disabled = true;
                    }
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



    return(
        <div class="bg-red-50 min-h-screen flex items-center justify-center">
            <div class = "w-11/12 sm:w-9/12 bg-white text-black rounded-2xl flex justify-center h-auto">
                <div class="text-black"><h1 class="flex justify-center font-bold text-2xl sm:text-xl mb-6 mt-4">WELCOME !</h1>
                <form class="flex flex-col" onSubmit={handleSubmit} >
                <div class="mb-2">
                    <label class="mr-24 text-grey-darker text-sm font-bold ml-5  mb-2" htmlFor="email">
                        Email
                    </label>
                    <input class=" mt-2 shadow  rounded w-11/12 ml-5 py-1 px-3 text-grey-darker focus:outline-none focus:border-red-400 border" type="text" placeholder="Email-id" onKeyUp={inputcheck} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div class="mb-2">
                    <label class="mr-24 text-grey-darker text-sm font-bold ml-5 mb-2" htmlFor="username">
                        Displayname
                    </label>
                    <input class=" mt-2 shadow  rounded w-11/12 ml-5 py-1 px-3 text-grey-darker focus:outline-none focus:border-red-400 border" id="username" type="text" placeholder="Displayname" onKeyUp={inputcheck} onChange={(e) => setDisplayname(e.target.value)} />
                </div>
                <div class="mb-2">
                    <label class="mr-24 text-grey-darker text-sm font-bold ml-5 mb-2" htmlFor="phonenumber">
                        PhoneNumber
                    </label>
                    <input class=" mt-2 shadow  rounded w-11/12 ml-5 py-1 px-3 text-grey-darker focus:outline-none focus:border-red-400 border" type="number" placeholder="Phonenumber" onKeyUp={inputcheck} onChange={(e) => setPhone(e.target.value)} />
                </div>
               
                <div class="mb-6">
                    <label class=" text-grey-darker text-sm font-bold ml-5 mb-2" htmlFor="password">
                        Password
                    </label>
                    <input class="shadow mt-2   rounded w-11/12 ml-5 py-1 px-3 mb-2 text-grey-darker focus:outline-none border focus:border-red-400" id="password" type="password" placeholder="Password" onKeyUp={inputcheck} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div class="mb-6">
                    <button type="submit" class="flex justify-center items-center focus:outline-none text-white text-sm sm:text-base bg-red-600 disabled:opacity-50 rounded  w-5/6 transition ml-8 py-2 px-3 duration-150 ease-in" id="logbtn" disabled>Sign Up</button>
                </div>
                <div class="text-gray-500 flex  text-justify justify-center mx-14 mb-4">
                   {error} 
                </div>
                <div class="inline-flex justify-center items-center font-bold text-red-500 mb-5 text-xs sm:text-sm text-center"><p class="text-sm sm:text-lg">
                 <Link to="/login">Already have an account ? Sign In</Link></p>
                </div>
                </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;