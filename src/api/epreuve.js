import config from './config';

const request = {
    getEpreuve: async (id) => {
        const response = await fetch(`${config.back}/${id}`);
        const resp = await response.json();

        console.log(resp);
        return resp;
    }
}

export default request;