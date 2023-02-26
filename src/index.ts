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
                fraction_id: fraction,
                server,
            },
            token: this.token,
        });
    }

    async serverStatus(server: number): Promise<RequestResponse<ServerStatusAPIResponse>> {
        return request<ServerStatusAPIResponse>('https://api.vprikol.dev/status', {
            method: 'GET',
            query: {
                server,
            },
            token: this.token,
        });
    }

    async allStatus(): Promise<RequestResponse<ServerStatusAPIResponse[]>> {
        return request<ServerStatusAPIResponse[]>('https://api.vprikol.dev/status', {
            method: 'GET',
            token: this.token,
        });
    }

    async find(username: string, server: number): Promise<RequestResponse<FindTaskAPIResponse>> {
        const task = await request<CreateFindTaskAPIResponse>('https://api.vprikol.dev/find/createTask', {
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

            const result = await request<FindTaskAPIResponse>('https://api.vprikol.dev/find/getTaskResult', {
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
        return request<RatingAPIResponse>('https://api.vprikol.dev/rating', {
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
        return request<IpAPIResponse>('https://api.vprikol.dev/ip', {
            method: 'GET',
            query: {
                ip,
            },
            token: this.token,
        });
    }

    async checkRPUsername(username: string): Promise<RequestResponse<CheckRPUsernameAPIResponse>> {
        return request<CheckRPUsernameAPIResponse>('https://api.vprikol.dev/checkrp', {
            method: 'GET',
            query: {
                nick: username,
            },
            token: this.token,
        });
    }

    async generateRPUsername(gender: RPUsernameGender, nation: RPUsernameNation): Promise<RequestResponse<GenerateRPUsernameAPIResponse>> {
        return request<GenerateRPUsernameAPIResponse>('https://api.vprikol.dev/rpnick', {
            method: 'GET',
            query: {
                gender,
                nation,
            },
            token: this.token,
        });
    }
}