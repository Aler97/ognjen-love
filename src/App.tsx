import {
  For,
  Match,
  Show,
  Switch,
  createResource,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import "./App.css";
import { supabase } from "./utils/supabaseClient";
import toast, { Toaster } from "solid-toast";

async function getMessages() {
  const supabaseObject = await supabase
    .from("publicMessages")
    .select()
    .order("created_at", { ascending: false });
  return supabaseObject;
}

function NoMessages() {
  return (
    <div id="noMessages">
      <h1>No messages... &#x1F622;</h1>
    </div>
  );
}

function Loading() {
  return <div class="loader"></div>;
}

function App() {
  const [allMessages, { refetch }] = createResource(getMessages);
  const [message, setMessage] = createSignal<string>("");
  const [username, setUsername] = createSignal<string>("");
  const [charCount, setCharCount] = createSignal(0);
  const [openModal, setOpenModal] = createSignal(false);

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && openModal()) {
      setOpenModal(false);
    }
  }

  function ErrorOccured() {
    return (
      <div style={{ "text-align": "center", color: "#f9423a" }}>
        <h3>
          It appears that an error has occurred, which is unfortunate. However,
          it will likely be resolved shortly. In the meantime, feel free to
          consider a message you plan to send to Ognjen. &#128522;
        </h3>
        <button onclick={() => refetch()} style={{ padding: "0.4em" }}>
          Reload
        </button>
      </div>
    );
  }

  const errorNoti = (): void => {
    toast.error("An error occured...", {
      duration: 2000,
      position: "top-center",
    });
  };

  const successNoti = (): void => {
    toast.success("Success!", { duration: 2000, position: "top-center" });
  };

  async function sendMessage() {
    if (message() !== "" && message().length < 201) {
      const { data, error } = await supabase
        .from("publicMessages")
        .insert({ message: message(), username: username() })
        .select();

      if (data) {
        successNoti();
        setMessage("");
        refetch();
      } else if (error) {
        errorNoti();
      }
      return;
    } else {
      alert("You need to write something in order to post it.");
    }
  }

  const updateCharCount = (e: any): void => {
    setCharCount(e.target.value.length);
    console.log(allMessages);
  };

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
            onclick={() => {
              sendMessage();
            }}
          >
            SEND!
          </button>
        </div>
      </div>
      <main class="container">
        <h2>Your lovley messages:</h2>
        <Show
          when={
            allMessages.state !== "pending" &&
            allMessages.state !== "refreshing"
          }
          fallback={<Loading />}
        >
          <Switch fallback={<ErrorOccured />}>
            <Match when={allMessages()?.data?.length! > 0}>
              <div class="messagesContainer">
                <For each={allMessages()?.data}>
                  {(message, _i) => (
                    <div class="message">
                      <p class="createAt">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                      <p class="messageText">{message.message}</p>
                      <p class="username">
                        By:{" "}
                        {message.username !== ""
                          ? message.username
                          : "Anonymous"}
                      </p>
                    </div>
                  )}
                </For>
              </div>
            </Match>
            <Match when={allMessages()?.data?.length === 0}>
              <NoMessages />
            </Match>
          </Switch>
        </Show>
        <Show when={openModal() === true} fallback={null}>
          <div class="modal" id="myModal">
            <div class="modal-content">
              <p
                class="close"
                onclick={() => {
                  setOpenModal(false);
                }}
              >
                &times;
              </p>
              <h1>Privacy Policy</h1>
              <p>
                This site does not collect any user data whatsoever. Everything
                is completely anonymous.
              </p>
            </div>
          </div>
        </Show>
        <Toaster />
      </main>
      <section class="footer">
        <p>Developed with &#x2764;&#xFE0F; for Ognjen</p>
        <p
          onclick={() => {
            setOpenModal(true);
          }}
          style={{ "text-decoration": "underline", cursor: "pointer" }}
        >
          Privacy policy
        </p>
      </section>
    </>
  );
}

export default App;
