const axios = require("axios").default;
import { WebClient } from "@slack/web-api";
const S1 = require('s1db')
const db = new S1(process.env.S1_TOKEN)

export default async (req, res) => {
  const client = new WebClient();
  let frame = await db.get('frame')
  frame += 1
  if(frame > 15) frame = 0
  let photo = req.query.photo || `https://dj-pfp-hc.vercel.app/images/frame_${frame.toString().padStart(2, '0')}_delay-0.06s.jpg`
  const image = await axios.get(photo, {
    responseType: "arraybuffer",
  });
  const slackRequest = await client.users.setPhoto({
    image: image.data,
    token: process.env.SLACK_TOKEN,
  });
  await db.set('frame', frame)
  res.redirect('https://dj-pfp-hc.vercel.app/api/set-profile');
};
