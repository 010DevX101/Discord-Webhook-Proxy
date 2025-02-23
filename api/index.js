import express, { json } from "express";
const app = express();

// Constants
const PORT = 3000;
const SERVER_ERROR = 500;
const NO_CONTENT = 204;
const NODE_ENV = process.env.NODE_ENV || "production";
const ALLOWED_WEBHOOKS = process.env.ALLOWED_WEBHOOKS.split(",").map((webhook) => webhook.trim());

app.use(json());
app.post("/api/webhooks/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const webhook = `https://discord.com/api/webhooks/${id}/${token}`;
  if (!ALLOWED_WEBHOOKS.includes(webhook)) return res.status(401).send({"data": "Unauthorized webhook."});
  try {
    const response = await fetch(webhook, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: {"Content-Type": "application/json"}
    });
    if (response.status !== NO_CONTENT) return res.status(response.status).send({"data": response.statusText});
    return res.sendStatus(NO_CONTENT);
  } catch (error) {
    return res.status(SERVER_ERROR).send({"data": error.message});
  }
});

if (NODE_ENV === "dev") {
  app.listen(PORT, () => console.log(`Server initialized on port ${PORT}`));
}

export default app;