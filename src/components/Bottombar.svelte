<script lang="ts">
	import type { ConversationModel } from "$ts/ConversationModel";
	import { conversationsManager } from "$ts/ConversationsManager";
	import { scrollDown } from "$ts/helpers";
	import { ai } from "$ts/openai/ai";
	import type { Writable } from "svelte/store";
	import { apiModel } from "$ts/stores/settingsStores";


    let message = "";

    const selectedConversation = conversationsManager.selectedConversation as Writable<ConversationModel | null>;  // store

    $: systemMessage = $selectedConversation?.systemMessage;    // store
    $: allMessages = $selectedConversation?.messages;            // store
    $: memoryId = $selectedConversation?.memoryId;              // store

    $: messagesInMemory = $allMessages?.filter((message: any) => message.id >= ($memoryId ?? 0));

    function simulateUser() {
        if (!$selectedConversation) {
            return null;
        }
        if (message) {
            const newMessage = $selectedConversation.addMessage(message, "user", 0, 0);
            message = "";

            setTimeout(() => {
                scrollDown()
            }, 0);

            return newMessage;
        }

        return null;
    }

    function simulateAssistant() {
        if (!$selectedConversation) {
            return null;
        }
        if (message) {
            const newMessage = $selectedConversation.addMessage(message, "assistant", 0, 0);
            message = "";
            return newMessage;
        }
    }

    async function aiComplete() {
        if (!$selectedConversation) {
            return;
        }

        let messages = []

        if ($systemMessage !== '') {
            messages.push({role: 'system', content: $systemMessage})
        }

        for (const message of messagesInMemory) {
            messages.push({role: message.role, content: message.content})
        }

        // remove messages that have different role than system/user/assistant
        messages = messages.filter((message) => {
            return message.role === "user" || message.role === "assistant" || message.role === "system";
        });


        console.log("messages to api", messages);
        const res = await ai.completeStream(messages);
        // const res = await ai.complete(messages);        // ALTERNATIVE
        $selectedConversation.addMessage(res.message.content, res.message.role, res.promptTokens, res.completionTokens);
    }

    async function send() {
        const newMessage = simulateUser()
        if (!newMessage) {
            console.warn("No message to send");
            return;
        }
        setTimeout(async() => {   // wait for store to update
            await aiComplete()
            setTimeout(() => {
                scrollDown()
            }, 0);
        }, 0);
    }

    async function sendWithoutHistory() {
        const newMessage = simulateUser()

        if (!newMessage) {
            console.warn("No message to send");
            return;
        }

        $memoryId = newMessage.id  // reset memory

        setTimeout(async() => {   // wait for store to update
            await aiComplete()
            setTimeout(() => {
                scrollDown()
            }, 0);
        }, 0);
    }

    function keydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            if (event.shiftKey) {
                return;
            }
            if (event.ctrlKey) {
                sendWithoutHistory();
            }
            else {
                event.preventDefault();
                send();
            }
        }
    }
</script>


<div class="w-full flex text-white">
    <textarea on:keydown={keydown} class="w-full bg-gray-500 px-2" name="" id="" rows="3" placeholder="Type your message here. To insert new line, press shift+enter." bind:value={message} />
    <button on:click={send} class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Send <span class="text-xs text-gray-300">[enter]</span></button>
    <button on:click={sendWithoutHistory} class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Send without history <span class="text-xs text-gray-300">[ctrl+enter]</span></button>
    <div class="flex flex-col  items-stretch content-stretch">
        <button on:click={() => $apiModel = "gpt-4" } class:active={$apiModel == "gpt-4"} class="bg-gray-600 hover:bg-gray-500 px-1 py-1 flex-1" title="gpt-4">4</button>
        <button on:click={() => $apiModel = "gpt-3.5-turbo" } class:active={$apiModel == "gpt-3.5-turbo"} class="bg-gray-600 hover:bg-gray-500 px-1 py-1 flex-1" title="gpt-3.5-turbo">3.5</button>
    </div>

    <!-- <button on:click={scrollDown} class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Scroll down</button> -->
    <!-- <button on:click={simulateUser} class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Simulate user</button> -->
    <!-- <button on:click={simulateAssistant} class="bg-gray-600 hover:bg-gray-500 px-1 py-1">Simulate ChatGPT</button> -->
</div>

<style>
    button.active {
        background-color: #1a202c;
        outline: none;
    }
</style>
