import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const isAdmin = currentUser && currentUser.roles && currentUser.roles.includes('ADMIN');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">University Lost & Found</Link>
                <div className="flex items-center space-x-4">
                    <Link to="/" className="hover:text-blue-200">Home</Link>
                    {currentUser ? (
                        <>
                            <Link to="/post" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">Post Item</Link>
                            {isAdmin && (
                                <Link to="/admin" className="bg-yellow-400 text-gray-900 px-3 py-1 rounded hover:bg-yellow-300 font-semibold">
                                    Admin Dashboard
                                </Link>
                            )}
                            <span className="text-sm">Hi, {currentUser.name || currentUser.universityId}</span>
                            <button
                                onClick={handleLogout}
                                className="hover:text-blue-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-200">Login</Link>
                            <Link to="/register" className="hover:text-blue-200">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
