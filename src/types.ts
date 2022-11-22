export type ApiOptions = {
    token: string;
};

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
    success: true;
    data: R;
} | {
    success: false;
    error: RequestError;
}

export type MembersAPIResponse = {
    server: string;
    fractionLabel: string;
    players: {
        [username: string]: {
            id: number;
            isOnline: boolean;
            isLeader: boolean;
            rank: number;
            rankLabel: string;
        }
    };
    totalPlayers: number;
    totalOnline: number;
    leaderNick: string;
    isLeaderOnline: boolean;
}

export type ServerStatusAPIResponse = {
    hostname: string;
    paydayMultiplier: number;
    onlinePlayers: number;
    maxPlayers: number;
    isClosed: boolean;
    ip: string;
    serverLabel: string;
}

export type CreateFindTaskAPIResponse = {
    request_id: string;
    request_time: number;
}

export type FindTaskAPIResponse = {
    accountId: number;
    vipLvl: number;
    vipLabel: string;
    lvl: number;
    cash: number;
    bank: number;
    deposit: number;
    individualAccount: number | null;
    totalMoney: number;
    orgId: number;
    orgLabel: string;
    rankNumber: number;
    rankLabel: string;
    isLeader: boolean;
    jobId: number;
    jobLabel: string;
    isOnline: boolean;
    playerId: number;
    phoneNumber: number;
    playerNick: string;
    playerServer: number;
    serverName: string;
    newRequest: boolean;
    updatedAt: number;
}

export type RatingAPIResponse = {
    server: string;
    players: {
        number: number;
        name: string;
        isOnline: boolean;
    }[] | null;
    families: {
        number: number;
        name: string;
        owner: string;
        lvl: number;
    }[] | null;
};

export type IpAPIResponse = {
    ip: string;
    country: string;
    city: string;
    timezone: string;
    isp: string;
}

export type CheckRPUsernameAPIResponse = {
    name: {
        rp: boolean;
        schedule: string | null;
    };
    surname: {
        rp: boolean;
        schedule: string | null;
    };
    nick: string;
}

export type GenerateRPUsernameAPIResponse = {
    name: string;
    surname: string;
    gender: RPUsernameGender;
    nation: RPUsernameNation;
}

export type RPUsernameGender = 'male' | 'female';

export type RPUsernameNation = 'russian' | 'american' | 'german' | 'french' | 'italian' | 'japanese' | 'latinos' | 'swedish' | 'danish' | 'romanian';