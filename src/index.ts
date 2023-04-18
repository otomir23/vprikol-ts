import {
    CreateFindTaskAPIResponse,
    FindTaskAPIResponse, IpAPIResponse,
    MembersAPIResponse, RatingAPIResponse,
    ServerStatusAPIResponse,
    CheckRPUsernameAPIResponse, RPUsernameGender, RPUsernameNation, GenerateRPUsernameAPIResponse,
} from './schemas';
import { request, RequestResponse } from './api';

export type ApiOptions = {
    token: string;
    baseUrl?: string;
};

// noinspection JSUnusedGlobalSymbols
export class VprikolAPI {
    private readonly baseUrl: string;
    private readonly token: string;

    constructor({ token, baseUrl }: ApiOptions) {
        this.baseUrl = baseUrl || 'https://api.vprikol.dev';
        this.token = token;
    }

    async members(fraction: number[], server: number): Promise<RequestResponse<MembersAPIResponse>> {
        return request<MembersAPIResponse>(this.baseUrl + '/members', {
            method: 'GET',
            query: {
                fraction_id: fraction,
                server_id: server,
            },
            token: this.token,
        });
    }

    async serverStatus(server: number): Promise<RequestResponse<ServerStatusAPIResponse>> {
        return request<ServerStatusAPIResponse>(this.baseUrl + '/status', {
            method: 'GET',
            query: {
                server,
            },
            token: this.token,
        });
    }

    async allStatus(): Promise<RequestResponse<ServerStatusAPIResponse[]>> {
        return request<ServerStatusAPIResponse[]>(this.baseUrl + '/status', {
            method: 'GET',
            token: this.token,
        });
    }

    async find(username: string, server: number): Promise<RequestResponse<FindTaskAPIResponse>> {
        const task = await request<CreateFindTaskAPIResponse>(this.baseUrl + '/find/createTask', {
            method: 'POST',
            query: {
                nick: username,
                server,
            },
            token: this.token,
        });

        if (task.success === false) {
            return task;
        }

        // eslint-disable-next-line no-constant-condition
        while (true) {
            // 1s delay
            await new Promise(r => setTimeout(r, 1000));

            const result = await request<FindTaskAPIResponse>(this.baseUrl + '/find/getTaskResult', {
                method: 'GET',
                query: {
                    request_id: task.data.request_id,
                },
                token: this.token,
            });

            if (
                result.success === false &&
                'error_code' in result.error &&
                result.error.error_code === 425
            ) continue;

            return result;
        }
    }

    async rating(type: 1 | 2 | 3, subtype: null | 1 | 2 | 3, server: number): Promise<RequestResponse<RatingAPIResponse>> {
        return request<RatingAPIResponse>(this.baseUrl + '/rating', {
            method: 'GET',
            query: {
                type,
                subtype: subtype || undefined,
                server,
            },
            token: this.token,
        });
    }

    async ip(ip?: string): Promise<RequestResponse<IpAPIResponse>> {
        return request<IpAPIResponse>(this.baseUrl + '/ip', {
            method: 'GET',
            query: {
                ip,
            },
            token: this.token,
        });
    }

    async checkRPUsername(username: string): Promise<RequestResponse<CheckRPUsernameAPIResponse>> {
        return request<CheckRPUsernameAPIResponse>(this.baseUrl + '/checkrp', {
            method: 'GET',
            query: {
                nick: username,
            },
            token: this.token,
        });
    }

    async generateRPUsername(gender: RPUsernameGender, nation: RPUsernameNation): Promise<RequestResponse<GenerateRPUsernameAPIResponse>> {
        return request<GenerateRPUsernameAPIResponse>(this.baseUrl + '/rpnick', {
            method: 'GET',
            query: {
                gender,
                nation,
            },
            token: this.token,
        });
    }
}