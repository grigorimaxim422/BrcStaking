
export const BACKEND_URL = 'http://localhost:5000/api';

export const SIGNINGMESSAGE = 'This is test Site.';

export type WalletListener = (accounts: string[]) => void;

export async function sendHttpRequest(url: string, postParam = {}) {
    try {
        const response = await fetch(url, postParam);
        return await response.json();
    } catch(error){
        console.error('Getting info error', error);
    }
}

export async function postHttpRequest(postBody: {})
{
    let postParam = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postBody)
    };

    return sendHttpRequest(BACKEND_URL, postParam);
}