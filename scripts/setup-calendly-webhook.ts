// This script demonstrates how to register a webhook with Calendly
// You can run this using `npx ts-node scripts/setup-calendly-webhook.ts`

// Required Environment Variables:
// CALENDLY_PAT: Your Calendly Personal Access Token
// NEXT_PUBLIC_APP_URL: The base URL of your deployed application (e.g., https://your-domain.com)

async function setupWebhook() {
  const calendlyPat = process.env.CALENDLY_PAT;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-ngrok-url.app"; // Change for local testing

  if (!calendlyPat) {
    console.error("Missing CALENDLY_PAT environment variable");
    process.exit(1);
  }

  try {
    // 1. Get the current user's organization URI
    console.log("Fetching Calendly organization details...");
    const userRes = await fetch("https://api.calendly.com/users/me", {
      headers: {
        Authorization: `Bearer ${calendlyPat}`,
      },
    });
    
    if (!userRes.ok) throw new Error("Failed to fetch user");
    
    const userData = await userRes.json();
    const organizationUri = userData.resource.current_organization;

    // 2. Create the webhook subscription
    console.log("Creating webhook subscription...");
    const webhookRes = await fetch("https://api.calendly.com/webhook_subscriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${calendlyPat}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: `${appUrl}/api/webhooks/calendly`,
        events: ["invitee.created", "invitee.canceled"],
        organization: organizationUri,
        scope: "organization",
      }),
    });

    if (!webhookRes.ok) {
      const errorData = await webhookRes.json();
      console.error("Failed to create webhook:", errorData);
      process.exit(1);
    }

    const webhookData = await webhookRes.json();
    console.log("Webhook subscription created successfully!");
    console.log("Webhook ID:", webhookData.resource.uri);
    
  } catch (error) {
    console.error("Error setting up webhook:", error);
  }
}

// setupWebhook();
