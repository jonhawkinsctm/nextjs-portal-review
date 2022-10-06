if (typeof process.env.DOG_API_BASE_URL !== "string") {
    throw new Error(`process.env.DOG_API_BASE_URL must be set`);
}

const baseUrl = process.env.DOG_API_BASE_URL;

export async function callApi(
    resource: string,
    options?: {
        method?: "GET" | "POST" | "DELETE" | "PATCH";
        payload?: object;
        query?: string;
    }
) {
    const url = new URL(baseUrl);
    url.pathname = resource;

    if (options?.query) {
        url.search = options.query;
    }

    if (options?.payload) {
        console.log("PAYLOAD", options.payload);
    }

    const res = await fetch(url, {
        method: options?.method ?? "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: options?.payload ? JSON.stringify(options.payload) : undefined,
    });

    return res.json();
}
