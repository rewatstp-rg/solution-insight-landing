export interface AuthTokenPayload {
    username: string;
    adminCode: string;
    email: string;
    firstname: string;
    lastname: string;
    fullName: string;
    id: number;
    status: string;
    accessToken?: string;

    // JWT fields
    iat: number;
    exp: number;
}

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

const encodeBase64 = (data: object) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(data))));

export const generateMockToken = (
    payload: Omit<AuthTokenPayload, 'iat' | 'exp'>
): string => {
    const now = Math.floor(Date.now() / 1000);

    const header = {
        alg: 'none',
        typ: 'JWT',
    };

    const body: AuthTokenPayload = {
        ...payload,
        iat: now,
        exp: now + ONE_YEAR_IN_SECONDS,
    };

    return `${encodeBase64(header)}.${encodeBase64(body)}.`;
};