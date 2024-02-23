<script lang="ts">
  export let counter = 0;
  const urlToGetYtMessages = `http://localhost:3000/api/yt-messages`;
  let stream: EventSource;

  export async function handleStartGetMessage() {
    stream = new EventSource(urlToGetYtMessages);

    stream.onmessage = (event) => {
      const data = JSON.parse(event.data);
      counter = data;
    };

    stream.onerror = (event) => {
      console.log(event);
    };
  }

  export async function handleResetGetMessage() {
    counter = 0;
    stream.close();
    handleStartGetMessage();
  }

  export async function handleStopGetMessage() {
    stream.close();
  }
</script>

<div
  class="flex items-center justify-center h-screen bg-gray-50 flex-col gap-6"
>
  <div class="text-4xl font-bold">Counter: {counter}</div>

  {#if stream}
    <div class="flex gap-4">
      <button
        on:click={handleStopGetMessage}
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >Stop
      </button>
      <button
        on:click={handleResetGetMessage}
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >Reset
      </button>
    </div>
  {:else}
    <button
      on:click={handleStartGetMessage}
      class="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >Start
    </button>
  {/if}
</div>
