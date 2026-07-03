import { registerAs } from "@nestjs/config";

export interface AppConfig {
    messagePrefix: string;
}

export const appConfig = registerAs('app', () => ({

    messagePrefix: process.env.MESSAGE_PREFIX || 'Default Prefix',
}));