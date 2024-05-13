import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import '../Stylesheet/Form.css'

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (fieldName, value) => {
        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldName]: ""
        }));
        switch (fieldName) {
            case 'username':
                setUsername(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = {};
        if (!username.trim()) {
            validationErrors.username = "Username is required!";
        }
        if (!password.trim()) {
            validationErrors.password = "Password is required!";
        }
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const res = await axios.post('http://localhost:3000/auth/login', { username, password });
                if (res.data.success) {
                    alert("Login successfully");
                    const { lecturerID } = res.data;
                    navigate('/dashboardlayout', { state: { lecturerID } }); 
                    console.log(lecturerID);
                } else {
                    setErrors("Username or password is incorrect");
                }
            } catch (err) {
                console.error('Login error:', err);
                setErrors("An error occurred while logging in. Please try again later.");
            }
        }
    };

    return (
        <div className="sign-up-container">
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <label>Username</label>
                <input type="text" autoComplete="off" placeholder="Username" value={username} onChange={(e) => handleInputChange('username', e.target.value)} />
                {errors.username && <span>{"*" + errors.username}</span>}
                
                <label>Password</label>
                <input type="password" placeholder="********" value={password} minLength={6} maxLength={8} onChange={(e) => handleInputChange('password', e.target.value)} />
                {errors.password && <span>{"*" + errors.password}</span>}
                
                <button type="submit">Login</button>
                <br />
                <Link to="/forgotPassword">Forgot Password?</Link>
                <p>Don't have an account? <Link to="/signup">Signup</Link></p>
            </form>
        </div>
    );
}
