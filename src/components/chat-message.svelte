<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  const urlToGetYtMessages = `http://localhost:3000/api/yt-messages`;
  let stream: EventSource;

  type Message = {
    channel: string;
    author: string;
    text: string;
    thumbnail: string;
    timestamp: string;
  };
  let messages: Message[] = [];

  function handleMessage(message: Message) {
    messages = [message, ...messages];
  }

  onMount(() => {
    stream = new EventSource(urlToGetYtMessages);

    stream.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleMessage(data);
    };

    stream.onerror = (event) => {
      console.log(event);
    };
  });

  onDestroy(() => {
    stream.close();
  });
</script>

<div class="flex flex-col gap-4 mx-auto px-6 pt-3 pb-8 items-center h-screen">
  <h1 class="text-3xl">
    Connected on: <span class="font-bold">LofiGirl</span>
  </h1>

  <div
    class="w-full rounded-lg overflow-y-scroll flex-col-reverse min-h-[calc(100vh-6rem)] bg-slate-200 px-4 py-2 flex gap-3"
  >
    {#each messages as message}
      <div class="bg-slate-100 px-3 py-2 rounded-lg w-fit">
        <span class="font-bold">{message.author}</span>:
        <span class="text-slate-700">{message.text}</span>
      </div>
    {/each}
  </div>
</div>
