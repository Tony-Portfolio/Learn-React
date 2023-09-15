import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const Register = ({ supabase }: any) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // Validate password length
        if (formData.password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return;
        }

        try {
            const { user, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                // Handle registration error
                console.error('Registration Error:', error.message);
            } else {
                // Registration successful
                console.log('Registration Successful:', user);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'A confirmation email has been sent to your inbox.',
                    timer: 10000,
                    willClose: () => {
                        navigate('/login');
                    },
                    showConfirmButton: false,
                    footer: '<a href="https://mail.google.com/mail/u/0/" target="_blank" style="text-decoration:underline" class="text-indigo-600">Open your email</a> to complete the registration process.'
                });
                // Redirect or perform other actions upon successful registration
            }
        } catch (error: any) {
            // Handle any unexpected errors
            console.error('Unexpected Error:', error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                        Create an account
                    </h2>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 p-3 w-full border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 p-3 w-full border rounded-md"
                                required
                            />
                            {passwordError && (
                                <p className="mt-1 text-red-600">{passwordError}</p>
                            )}
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 hover:underline">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
