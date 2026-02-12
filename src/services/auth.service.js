import api from './api';

const register = (universityId, name, contactInfo, phoneNumber, password) => {
    return api.post('/auth/signup', {
        universityId,
        name,
        contactInfo,
        phoneNumber,
        password,
    });
};

const login = async (universityId, password) => {
    const response = await api.post('/auth/signin', {
        universityId,
        password,
    });

    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
