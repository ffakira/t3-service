declare global {
    namespace NodeJS {
        export interface ProcessEnv {
            PORT: string | number;
            NODE_ENV: "development" | "production" | "test"
            SENTRY_DNS: string
            POSTGRES_USER: string
            POSTGRES_PASSWORD: string
            POSTGRES_DB: string
            COOKIE_SECRET: string | string[]
            JWT_SECRET: string
        }
    }
}

export {};
