import {
  For,
  Show,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import "./App.css";
import { supabase } from "./utils/supabaseClient";

interface Message {
  id: number;
  created_at: string;
  message: string;
  username: string;
}

async function getMessages() {
  const { data } = await supabase.from("publicMessages").select();
  return data as Message[];
}

function NoMessages() {
  return (
    <div id="noMessages">
      <h1>No messages... &#x1F622;</h1>
    </div>
  );
}

function App() {
  const [allMessages, { refetch }] = createResource<Message[]>(getMessages);
  const [messages, setMessages] = createSignal<Message[]>([]);
  const [message, setMessage] = createSignal<string>("");
  const [username, setUsername] = createSignal<string>("");
  const [charCount, setCharCount] = createSignal(0);

  async function sendMessage() {
    if (message() !== "") {
      const { error } = await supabase
        .from("publicMessages")
        .insert({ message: message(), username: username() })
        .select();

      refetch();

      if (error) {
        console.log(error);
      }
    }else{
      alert('You need to write something in order to post it.')
    }
  }

  const updateCharCount = (e: any): void => {
    setCharCount(e.target.value.length);
  };

  createEffect(() => {
    let msgs = allMessages();
    if (messages().length === 0) {
      msgs !== undefined && msgs.length > 0
        ? setMessages((prev) => [...prev, msgs[msgs.length - 1]])
        : null;
    } else {
      msgs !== undefined ? setMessages([...msgs]) : null;
    }
  });

  return (
    <>
      <div class="introduction">
        <h1>Has Ognjen found love yet? No &#x1F61E;</h1>
        <p>
          Leave him a message of support and encouragement, and remind him that
          true love is worth the wait. &#x2764;&#xFE0F;
        </p>
        <div class="inputFields">
          <div class="inputMessageContainer">
            <textarea
              id="inputMessage"
              maxlength={200}
              value={message()}
              oninput={(e) => {
                setMessage(e.target.value);
                updateCharCount(e);
              }}
              placeholder="Your message goes here..."
            />
            <p id="charCount">{charCount()}/200</p>
          </div>
          <input
            id="inputUsername"
            value={username()}
            type="text"
            placeholder="Your username goes here..."
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <button
            disabled={message()! === ""}
            id="sendButton"
            onclick={() => sendMessage()}
          >
            SEND!
          </button>
        </div>
      </div>
      <main class="container">
        <h3>Your lovley messages:</h3>
        <Show when={messages().length > 0} fallback={<NoMessages />}>
          <div class="messagesContainer">
            <For each={messages()}>
              {(message, _i) => (
                <div class="message">
                  <p class="createAt">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                  <p
                    style={{
                      "align-self": "center",
                      "max-width": "80%",
                      "word-wrap": "break-word",
                      "font-size": "1.2em",
                    }}
                  >
                    {message.message}
                  </p>
                  <p class="username">
                    By:{" "}
                    {message.username !== "" ? message.username : "Anonymous"}
                  </p>
                </div>
              )}
            </For>
          </div>
        </Show>
      </main>
    </>
  );
}

export default App;
