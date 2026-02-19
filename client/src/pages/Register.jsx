import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, CheckCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const { username, email, password, confirmPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await register(username, email, password);
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.errors 
                ? err.response.data.errors.map(e => e.msg).join(', ') 
                : (err.response?.data?.msg || 'Registration failed');
            setError(errorMsg);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                         <div className="flex items-center border rounded shadow-sm">
                            <User className="w-5 h-5 text-gray-400 ml-3" />
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={onChange}
                                className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <div className="flex items-center border rounded shadow-sm">
                            <Mail className="w-5 h-5 text-gray-400 ml-3" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <div className="flex items-center border rounded shadow-sm">
                            <Lock className="w-5 h-5 text-gray-400 ml-3" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <div className="flex items-center border rounded shadow-sm">
                            <CheckCircle className="w-5 h-5 text-gray-400 ml-3" />
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={onChange}
                                className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-700">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
