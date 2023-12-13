import { For, createEffect, createResource, createSignal } from "solid-js";
import "./App.css";
import { supabase } from "./utils/supabaseClient";

interface Message {
  id: number;
  createdAt: string;
  message: string;
  username: string;
}

async function getMessages() {
  const { data } = await supabase.from("publicMessages").select();
  return data;
}

function App() {
  const [allMessages] = createResource(getMessages);
  const [message, setMessage] = createSignal<string>("");
  const [username, setUsername] = createSignal<string>("");

  async function sendMessage() {
    const { data, error } = await supabase
      .from("publicMessages")
      .insert({ message: message(),  username: username() })
      .select();

    if(data){
      alert('sjajno')
    }else{
      alert(error)
    }
  }

  return (
    <>
      <div class="introduction">
        <h1>Has Ognjen found love yet? No &#x1F61E;</h1>
        <p>
          Leave him a message of support and encouragement, and remind him that
          true love is worth the wait. &#x2764;&#xFE0F;
        </p>
        <div class="inputField">
          <input
            id="inputMessage"
            value={message()}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            type="text"
            placeholder="Your message go here..."
          />
          <input
            id="inputUsername"
            value={username()}
            type="text"
            placeholder="Your username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <button class="sendButton" onclick={() => sendMessage()}>
            Send!
          </button>
        </div>
      </div>
      <main class="container">
        <h3>Your lovley messages:</h3>
        <div class="messagesContainer">
          <For each={allMessages()}>
            {(message, _i) => (
              <div class="message">
                <p>{message.message}</p>
                <p class="username">
                  - {message.username !== "" ? message.username : "Anonymous"}
                </p>
              </div>
            )}
          </For>
        </div>
      </main>
    </>
  );
}

export default App;
