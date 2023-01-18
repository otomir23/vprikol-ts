import {
    ApiOptions,
    CreateFindTaskAPIResponse,
    FindTaskAPIResponse, IpAPIResponse,
    MembersAPIResponse, RatingAPIResponse,
    RequestResponse,
    ServerStatusAPIResponse,
    CheckRPUsernameAPIResponse, RPUsernameGender, RPUsernameNation, GenerateRPUsernameAPIResponse,
} from './types';
import { request } from './api';

// noinspection JSUnusedGlobalSymbols
export class VprikolAPI {
    private readonly token: string;

    constructor({ token }: ApiOptions) {
        this.token = token;
    }

    async members(fraction: number, server: number): Promise<RequestResponse<MembersAPIResponse>> {
        return request<MembersAPIResponse>('https://api.vprikol.dev/members', {
            method: 'GET',
            query: {
                token: this.token,
                fraction_id: fraction,
                server,
            },
        });
    }

    async serverStatus(server: number): Promise<RequestResponse<ServerStatusAPIResponse>> {
        return request<ServerStatusAPIResponse>('https://api.vprikol.dev/status', {
            method: 'GET',
            query: {
                token: this.token,
                server,
            },
        });
    }

    async allStatus(): Promise<RequestResponse<ServerStatusAPIResponse[]>> {
        return request<ServerStatusAPIResponse[]>('https://api.vprikol.dev/status', {
            method: 'GET',
            query: {
                token: this.token,
            },
        });
    }

    async find(username: string, server: number): Promise<RequestResponse<FindTaskAPIResponse>> {
        const task = await request<CreateFindTaskAPIResponse>('https://api.vprikol.dev/find/createTask', {
            method: 'POST',
            query: {
                token: this.token,
                nick: username,
                server,
            },
        });

        if (task.success === false) {
            return task;
        }

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const result = await request<FindTaskAPIResponse>('https://api.vprikol.dev/find/getTaskResult', {
                method: 'GET',
                query: {
                    token: this.token,
                    request_id: task.data.request_id,
                },
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
        return request<RatingAPIResponse>('https://api.vprikol.dev/rating', {
            method: 'GET',
            query: {
                token: this.token,
                type,
                subtype: subtype || undefined,
                server,
            },
        });
    }

    async ip(ip?: string): Promise<RequestResponse<IpAPIResponse>> {
        return request<IpAPIResponse>('https://api.vprikol.dev/ip', {
            method: 'GET',
            query: {
                token: this.token,
                ip,
            },
        });
    }

    async checkRPUsername(username: string): Promise<RequestResponse<CheckRPUsernameAPIResponse>> {
        return request<CheckRPUsernameAPIResponse>('https://api.vprikol.dev/checkrp', {
            method: 'GET',
            query: {
                token: this.token,
                nick: username,
            },
        });
    }

    async generateRPUsername(gender: RPUsernameGender, nation: RPUsernameNation): Promise<RequestResponse<GenerateRPUsernameAPIResponse>> {
        return request<GenerateRPUsernameAPIResponse>('https://api.vprikol.dev/rpnick', {
            method: 'GET',
            query: {
                token: this.token,
                gender,
                nation,
            },
        });
    }
}