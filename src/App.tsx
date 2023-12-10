import { For, createSignal } from "solid-js";
import "./App.css";

interface Message {
  message: string;
  username: string | null;
}

function App() {
  const [messages, setMessages] = createSignal<Message[]>([
    { message: "You got this", username: "Ljuljo" },
    { message: "You got this", username: null },
    { message: "You got this", username: "Marko" },
    { message: "You got this", username: "Vidoje" },
  ]);
  return (
    <>
      <div class="introduction">
        <h1>Has Ognjen found love yet? No &#x1F61E;</h1>
        <p>
          Leave him a message of support and encouragement, and remind him that
          true love is worth the wait. &#x2764;&#xFE0F;
        </p>
      </div>
      <main class="container">
        <h3>Your lovley messages:</h3>
        <div class="messagesContainer">
          <For each={messages()}>
            {(message, _i) => (
              <div class="message">
                <p>{message.message}</p>
                <p class="username">- {message.username ?? "Anonymous"}</p>
              </div>
            )}
          </For>
        </div>
      </main>
    </>
  );
}

export default App;
