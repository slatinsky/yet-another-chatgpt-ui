import { writableString } from "./localstorageStores";


export const apiToken = writableString("gptui-apitoken", "");
export const apiModel = writableString("gptui-apimodel", "gpt-3.5-turbo");
