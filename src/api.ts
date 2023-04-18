import { BodyInit, HeadersInit, RequestInfo, RequestInit } from 'node-fetch';
import { dynamicImport } from 'tsimportlib';

const fetchPackage = dynamicImport('node-fetch', module) as Promise<typeof import('node-fetch')>;
const fetch = (url: RequestInfo, init?: RequestInit) => fetchPackage.then(({ default: f }) => f(url, init));

export type RequestError = {
    error_code: number;
    detail: string;
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
    const processArg = (k, v) => [String(k), String(v)];

    const queryString = new URLSearchParams(
        Object.entries(params.query ?? {})
            .reduce(
                (arr, [key, value]) => {
                    if (!Array.isArray(value)) return [...arr, processArg(key, value)];
                    return [...arr, ...value.map(v => processArg(key, v))];
                }, [],
            ),
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
                detail: `Invalid response with status ${response.status}: ${await response.text()}`,
            },
        };
    }
}