import { Link } from "react-router-dom";

export default function Home(){
    return(
        <div>
            <div className="sign-up-container">
                <div className="sign-up-form">
                    <h1>Welcome to</h1>
                    <h1>Student Result Management System</h1>
                    <Link to={"/login"}><button>→</button></Link>
                </div>
            </div>
        </div>
    )
}