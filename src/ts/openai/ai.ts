import { apiModel, apiToken } from "$ts/stores/settingsStores";
import type { AIcomplete, AImessage } from "$ts/types";
import { Configuration, OpenAIApi } from "openai";
import { get } from "svelte/store";
import { SSE } from "sse.js";
import { temporaryMessageText } from "$ts/stores/conversationsStores";


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

    async completeStream(messages: AImessage[]): Promise<AIcomplete> {
        return new Promise((resolve, reject) => {
            let stream = new SSE("https://api.openai.com/v1/chat/completions", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${get(apiToken)}`,
                },
                method: "POST",
                payload: JSON.stringify({
                    model: get(apiModel),
                    messages: messages,
                    stream: true,
                }),
            });

            temporaryMessageText.set("")  // streamedText

            stream.addEventListener("message", (event) => {
                if (event.data === "[DONE]") {  // stream is finished
                    const response = {
                        message: {
                            role: 'assistant',
                            content: get(temporaryMessageText),
                        },
                        promptTokens: 0,
                        completionTokens: 0
                    }

                    // clean up
                    temporaryMessageText.set("")
                    stream.close();

                    resolve(response);
                    return;
                }



                const payload = JSON.parse(event.data);
                const newText = payload.choices[0].delta.content;

                if (newText === undefined) {  // "thinking"
                    return;
                }

                temporaryMessageText.update((streamedText) => streamedText + newText);
            });


            stream.addEventListener("error", (event) => {
                try {
                    const payload = JSON.parse(event.data)

                    const response = {
                        message: {
                            role: 'warning',
                            content: payload.error.message,
                        },
                        promptTokens: 0,
                        completionTokens: 0
                    }

                    resolve(response);
                }
                catch (error) {
                    const response = {
                        message: {
                            role: 'warning',
                            content: "Unknown error, see console",
                        },
                        promptTokens: 0,
                        completionTokens: 0
                    }
                    console.log(event);
                    console.log(error);
                    resolve(response);
                }
            });

            stream.stream();
        });
    }

    // not used now - makes request to API and waits for response instead of streaming
    // async complete(messages: AImessage[]): Promise<AIcomplete> {
    //     const token = get(apiToken);
    //     if (token === null) {
    //         return {
    //             message: {
    //                 role: 'warning',
    //                 content: "Token is not set. Please set it in Settings.",
    //             },
    //             promptTokens: 0,
    //             completionTokens: 0
    //         }
    //     }

    //     try {
    //         let completions = await this.api.createChatCompletion({
    //             model: get(apiModel),
    //             messages: messages,
    //         })
    //         let message = completions.data.choices[0].message;
    //         let promptTokens = completions.data.usage?.prompt_tokens ?? 0;
    //         let completionTokens = completions.data.usage?.completion_tokens ?? 0;
    //         console.log(completions);

    //         if (message === undefined) {
    //             return {
    //                 message: {
    //                     role: 'warning',
    //                     content: "No response from API",
    //                 },
    //                 promptTokens: 0,
    //                 completionTokens: 0
    //             }
    //         }
    //         return {
    //             message,
    //             promptTokens,
    //             completionTokens
    //         };
    //     }
    //     catch (error) {
    //         console.log(error);
    //         const msg = error?.response?.data?.error?.message ?? "Unknown error, see console for details";

    //         return {
    //             message: {
    //                 role: 'warning',
    //                 content: msg,
    //             },
    //             promptTokens: 0,
    //             completionTokens: 0
    //         }
    //     }
    // }
}


export const ai = new AI();