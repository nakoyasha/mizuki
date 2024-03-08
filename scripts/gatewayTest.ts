import { WebSocket as _WebSocket } from "ws";

const ws = new _WebSocket("wss://gateway.discord.gg/?encoding=json&v=9");
const lastSValueWhateverTheHellThatIs = undefined;
const token =
  "MTA3Njk2ODAwMDc1NTg1OTQ1Ng.GiA4hc.fMkwTVvPodIgr2OJufwOHYl3-BZXhQ2TrAzbMY";

type UserObject = {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string;
  accent_color?: number;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
  avatar_decoration?: string;
};
type UnavailableGuild = {
  id: string;
  unavailable: boolean;
};

type PartialApplication = {
  id: string;
  flags: number;
};

type ReadyEvent = {
  v: number;
  user: UserObject;
  guilds: UnavailableGuild[];
  session_id: string;
  resume_gateway_url: string;
  shard?: boolean;
  application: PartialApplication;
};

function sendMessage(message: string) {
  console.log(`Sending ${message}`);
  ws.send(message);
}

function sendHello() {
  // oi fuck off mate
  // eslint-disable-next-line prettier/prettier
  sendMessage("{\"op\": 1,\"d\": null}");
}

function updatePresence() {
  sendMessage(
    JSON.stringify({
      op: 3,
      d: {
        activities: [
          {
            name: "yayatube",
            details: "infinite yayas",
            type: 1,
            url: "https://google.com",
            buttons: {
              label: "amia cute",
            },
          },
        ],
        status: "online",
        since: Date.now().toFixed(),
        afk: false,
      },
    }),
  );
}

function sendMyIdCard() {
  // eslint-disable-next-line quotes
  sendMessage(
    JSON.stringify({
      op: 2,
      d: {
        token: token,
        intents: 513,
        properties: {
          os: "Windows",
          browser:
            "Discord Client",
          device: "mobile",
        },
        presence: {
          activities: [
            {
              name: "yayatube",
              details: "infinite yayas",
              type: 1,
              url: "https://google.com",
            },
          ],
          status: "dnd",
          since: 91879201,
          afk: false,
        },
      },
    }),
  );
}

function maintainConnection(interval: number) {
  setTimeout(() => {
    sendHello();
    maintainConnection(interval);
  }, interval);
}

ws.on("open", () => {
  console.log("hello server i am the real discord client yaya");
});

ws.on("message", (message: string) => {
  const object = JSON.parse(message);

  // hello !!
  if (object.op == 10) {
    console.log(`Received message from server: ${message}`);
    sendHello();
    sendMyIdCard();
    maintainConnection(object.d.heartbeat_interval);
    // event dispatch
  } else if (object.op == 0) {
    if (object.t == "READY") {
      const readyEvent = object.d as ReadyEvent;
      console.log(readyEvent.user.username);
      updatePresence();
    }
  }
});

ws.on("close", () => {
  console.log("disconnect");
});
