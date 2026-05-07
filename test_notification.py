import os
import logging
from dotenv import load_dotenv
from tbs_utils.notifier import NotifierClient, NotifierConfig

# Configure basic logging
logging.basicConfig(level=logging.INFO)

load_dotenv()

def main():
    tbs_url = os.getenv("TBS_URL")
    secret = os.getenv("TBS_REPO_SHARED_SECRET")
    agent_name = os.getenv("AGENT_NAME")

    print(f"Configuration:")
    print(f"  URL: {tbs_url}")
    print(f"  Agent: {agent_name}")
    print(f"  Secret: {'Set' if secret and secret != 'INSERT_SECRET_HERE' else 'Not Set/Placeholder'}")

    if not secret or secret == "INSERT_SECRET_HERE":
        print("\nERROR: Please update .env with your real TBS_REPO_SHARED_SECRET before running this test.")
        return

    config = NotifierConfig(
        url=tbs_url,
        secret=secret,
        repo=agent_name
    )

    client = NotifierClient(config)

    print("\nSending test notification...")
    
    # helper to build payload
    envelope = client.build_payload(
        task="Integration Test",
        stage="test",
        summary="Test notification from AI_Consulting",
        details="This is a test message to verify the TelegramNotifications system integration.",
        next_actions=["Verify message reception in Telegram"]
    )

    try:
        response = client.send(envelope)
        print(f"Success! Response: {response.status_code}")
        print(response.text)
    except Exception as e:
        print(f"Failed to send notification: {e}")

if __name__ == "__main__":
    main()
