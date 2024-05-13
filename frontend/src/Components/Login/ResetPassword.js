import axios from "axios"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword(){
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/resetPassword', password)
            .then(res => {
                if(res.data.status){
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
                <h2>Reset Password</h2>
                <label>Password</label>
                <input type="password" placeholder="********" onChange={(e) => setPassword(e.target.value)} /><br />

               <button type="submit">Reset</button>
            </form>

        </div>
    )
}