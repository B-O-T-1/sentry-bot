const dayjs = require("../bot/node_modules/dayjs");
const {
  Webhook,
  MessageBuilder,
} = require("../bot/node_modules/discord-webhook-node");

const LEVEL_VARIANTS = {
  fatal: ["0xff2222", "🎇"],
  error: ["0xff3a3a", "🔥"],
  warning: ["0xfaff13", "⛔️"],
  info: ["0x215fff", "💬"],
};

const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL);

hook.setUsername("SENTRY");
hook.setAvatar("https://i.ibb.co/BN36fFk/sentry-icon-130834.png");

exports.handler = async (event) => {
  const { exception, title, datetime, web_url, location, user, level } =
    event.data.event;

  const [date, time] = dayjs(datetime.replaceAll("T", " ").split(".")[0])
    .add(9, "hour")
    .format("YYYY-MM-DD,HH:mm:ss")
    .split(",");

  const errorEmbed = new MessageBuilder()
    .setColor(LEVEL_VARIANTS[level][0] || LEVEL_VARIANTS["info"][0])
    .setTitle(`${LEVEL_VARIANTS[level][1] || "💬"} ${title || "title 없음"}`)
    .setURL(web_url || "URL 없음")
    .setDescription(exception?.values[0]?.value || "상세 설명 없음")
    .addField("발생일자", date || "date 없음", true)
    .addField("발생시간", time.split(".")[0] || "time 없음", true)
    .addField("사용자", user?.username || "사용자 알 수 없음", true)
    .setFooter(location || "경로 알 수 없음");

  hook
    .send(errorEmbed)
    .then(() => {
      console.log("webhook send success");
    })
    .catch((e) => {
      console.log("webhook send error", e);
    });
};
