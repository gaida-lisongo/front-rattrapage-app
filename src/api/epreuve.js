import config from './config';

const request = {
    getEpreuve: async (id) => {
        const response = await fetch(`${config.back}/${id}`);
        const resp = await response.json();

        console.log(resp);
        return resp;
    },
    getCheckAnswer: async (id, answer) => {
        const response = await fetch(`${config.back}/check/${id}/${answer}`);
        const resp = await response.json();

        console.log(resp);
        return resp;
    },
    setResult: async ({ studentId, examId, score, url }) => {
        try {
            const response = await fetch(`${config.back}/results`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentId, examId, score, url }),
            });

            const resp = await response.json();
            console.log(resp);
            return resp;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du résultat:', error);
        }
    },
    getResults: async (studentId) => {
        const response = await fetch(`${config.back}/results/student/${studentId}`);
        const resp = await response.json();

        console.log(resp);
        return resp;
    },
}

export default request;