/** Libraries */
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async (id_token: string) => {
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
};

export { googleVerify };