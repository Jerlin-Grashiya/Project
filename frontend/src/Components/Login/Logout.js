import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/auth/logout');

            // Clear token cookie locally
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            // Redirect to login page or any other desired destination
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
