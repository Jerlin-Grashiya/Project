import axios from "axios"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword(){
    const [email, setEmail] = useState('')

    const navigate = useNavigate()
    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/forgotPassword', email)
            .then(res => {
                if(res.data.status){
                    alert("Check your email")
                    navigate('/login')
                }else {
                    alert("error");
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return(
        <div className="sign-up-container">

            <form className="sign-up-form" onSubmit={handleSubmit}>
                <h2>Forgot Password</h2>
                <label>Email</label>
                <input type="email" autoComplete="off" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br />

               <button type="submit">Send</button>
            </form>

        </div>
    )
}