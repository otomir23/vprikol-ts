import { BodyInit, HeadersInit, RequestInfo, RequestInit } from 'node-fetch';
import { dynamicImport } from 'tsimportlib';

const fetchPackage = dynamicImport('node-fetch', module) as Promise<typeof import('node-fetch')>;
const fetch = (url: RequestInfo, init?: RequestInit) => fetchPackage.then(({ default: f }) => f(url, init));

export type RequestError = {
    error_code: number;
    message: string;
} | {
    detail: {
        loc: string[];
        msg: string;
        type: string;
    }[];
}

export type RequestResponse<R> = {
    success: boolean;
    data?: R;
    error?: RequestError;
} & {
    success: true;
    data: R;
} | {
    success: false;
    error: RequestError;
};

export async function request<R>(url: string, params: {
    method: 'GET' | 'POST';
    query?: Record<string, unknown>;
    headers?: HeadersInit;
    body?: BodyInit;
    token?: string;
}): Promise<RequestResponse<R>> {
    const queryString = new URLSearchParams(
        Object.entries(params.query ?? {}).map(([key, value]) => [String(key), String(value)]),
    ).toString();

    const response =
        await fetch(url + '?' + queryString, {
            method: params.method,
            headers: {
                ...(params.token && {
                    'Authorization': `Bearer ${params.token}`,
                }),
                ...params.headers,
            },
            body: params.body,
        });

    try {
        return response.ok ? {
            success: true,
            data: (await response.json()) as R,
        } : {
            success: false,
            error: (await response.json()) as RequestError,
        };
    } catch (e) {
        return {
            success: false,
            error: {
                error_code: -1,
                message: `Invalid response with status ${response.status}: ${await response.text()}`,
            },
        };
    }
}