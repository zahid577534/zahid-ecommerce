'use client'
import { Bounce } from "react-toastify"

export const showToast = (type, message)=>{
   let options = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false, 
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,    
        theme: "light",
        Transition:Bounce
    }
    switch (type) {
        case "success":
            options = {...options, type:"success"}
            break
        case "error":
            options = {...options, type:"error"}
            break
        case "warning":
            options = {...options, type:"warning"}
            break
        case "info":
            options = {...options, type:"info"}
            break
        default:            options = {...options, type:"default"}
        break
    }
    return options;
}