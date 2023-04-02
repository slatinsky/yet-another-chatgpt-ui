import { apiModel, apiToken } from "$ts/stores";
import type { AIcomplete, AImessage, Message } from "$ts/types";
import { json } from "@sveltejs/kit";
import { Configuration, OpenAIApi } from "openai";
import { get } from "svelte/store";


class AI {
    private api: OpenAIApi;
    private _tokenUnsubscribe: () => void;
    constructor() {
        this._tokenUnsubscribe = apiToken.subscribe((token) => {
            const config: Configuration = new Configuration({
                apiKey: token,
            });

            this.api = new OpenAIApi(config);
        });
    }

    destroy() {
        this._tokenUnsubscribe();
    }

    async complete(messages: AImessage[]): Promise<AIcomplete> {
        const token = get(apiToken);
        if (token === null) {
            return;
        }

        try {
            let completions = await this.api.createChatCompletion({
                model: get(apiModel),
                messages: messages,
            })
            let message = completions.data.choices[0].message;
            let totalTokens = completions.data.usage?.total_tokens ?? 0;
            console.log(completions);

            if (message === undefined) {
                return {
                    message: {
                        role: 'warning',
                        content: "No response from API",
                    },
                    totalTokens: 0
                }
            }
            return {
                message,
                totalTokens
            };
        }
        catch (error) {
            console.log(error);
            const msg = error?.response?.data?.error?.message ?? "Unknown error, see console for details";

            return {
                message: {
                    role: 'warning',
                    content: msg,
                },
                totalTokens: 0
            }
        }
    }
}


export const ai = new AI();