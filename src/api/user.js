import config from './config';

const request = {
    login: async (formData) => {
        const response = await fetch(`${config.back}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const resp = await response.json();
        
        if (resp.status == true) {
            localStorage.setItem('token', resp.data.token);
            const user = resp.data.user;

            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
    }
}

export default request;