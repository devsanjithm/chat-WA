import React from "react";


function Welcomeboard(){
    return(
        <div className="w-9/12 flex items-center justify-center bg-green-50 " >
             <div className="absolute">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Google_Contacts_icon.svg/1200px-Google_Contacts_icon.svg.png" className="h-28 w-28 -mt-36"></img>
             </div>
             <p className="text-xl font-semibold ml-6 mt-6">Welcome To The chat App</p>
        </div>
    );
}
export default Welcomeboard;