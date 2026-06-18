import axios from 'axios'
import React from 'react'

const ForgotPass = ({email}) => {


    async function handleForgotPass() {
    try {
        const res = await axios.post("https://pdp-system-backend-1.onrender.com/api/v1/auth/forgot-password", {email})
    }
    catch {}
}

  return (



    <div>


    </div>
  )
}

export default ForgotPass