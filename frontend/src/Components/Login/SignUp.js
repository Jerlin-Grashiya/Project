import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (fieldName, value) => {
        // Clear the error message for the corresponding field
        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldName]: ""
        }));
        // Update the state with the new value
        switch (fieldName) {
            case 'email':
                setEmail(value);
                break;
            case 'id':
                setId(value);
                break;
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

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validation logic
        const validationErrors = {};
        if (!email.trim()) {
            validationErrors.email = "Email is required!";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = "Email is not valid";
        }
        if (!id.trim()) {
            validationErrors.id = "ID is required!";
        }
        if (!username.trim()) {
            validationErrors.username = "Username is required!";
        }
        if (!password.trim()) {
            validationErrors.password = "Password is required!";
        } else if (password.length < 6) {
            validationErrors.password = "Password is not valid!";
        }
        setErrors(validationErrors);

        // If no validation errors, submit the form
        if (Object.keys(validationErrors).length === 0) {
            // Send signup request
            axios.post('http://localhost:3000/auth/signup', { email, id, username, password })
                .then(res => {
                    if (res.data.status) {
                        // Redirect to login page after successful registration
                        navigate('/login');
                    } else {
                        alert("Error: " + res.data.message);
                    }
                })
                .catch(err => {
                    console.error('Signup error:', err);
                    alert("An error occurred while signing up. Please try again later.");
                });
        }
    };

    return (
        <div className="sign-up-container">
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <h2>SignUp</h2>
                <label>Email</label>
                <input type="email" autoComplete="off" placeholder="Email" value={email} onChange={(e) => handleInputChange('email', e.target.value)} />
                {errors.email && <span>{"*" + errors.email}</span>}

                <label>Lecturer ID</label>
                <input type="text" autoComplete="off" placeholder="Lecturer ID" value={id} onChange={(e) => handleInputChange('id', e.target.value)} />
                {errors.id && <span>{"*" + errors.id}</span>}

                <label>Username</label>
                <input type="text" placeholder="Username" maxLength={10} value={username} onChange={(e) => handleInputChange('username', e.target.value)} />
                {errors.username && <span>{"*" + errors.username}</span>}

                <label>Password</label>
                <input type="password" placeholder="********" maxLength={8} value={password} onChange={(e) => handleInputChange('password', e.target.value)} />
                {errors.password && <span>{"*" + errors.password}</span>}

                <button type="submit">Signup</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
}
