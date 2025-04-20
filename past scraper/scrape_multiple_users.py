import time
import random
import pickle
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

USERNAMES = [
    "TABASCOweb3", "vaibhavchellani", "intern", "0xMert_",
    "cryptolyxe", "blknoiz06", "MustStopMurad", "gianinaskarlett",
    "frankdegods", "notthreadguy", "_TJRTrades", "0xNairolf", "rajgokal"
]
MAX_TWEETS = 1000

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument(
        "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option("useAutomationExtension", False)

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return driver

def parse_number(text):
    if not text:
        return 0
    text = text.upper().replace(',', '').strip()
    try:
        if 'K' in text:
            return int(float(text.replace('K', '')) * 1_000)
        elif 'M' in text:
            return int(float(text.replace('M', '')) * 1_000_000)
        return int(text)
    except:
        return 0

def extract_engagement(tweet):
    try:
        container = tweet.find_element(By.XPATH, './/div[@role="group"]')
        buttons = container.find_elements(By.XPATH, './div')
        replies = retweets = likes = 0
        if len(buttons) >= 3:
            for idx, label in zip([0, 1, 2], ["Replies", "Retweets", "Likes"]):
                try:
                    count_span = buttons[idx].find_element(By.XPATH, './/span/span/span')
                    count = parse_number(count_span.text.strip())
                    if label == "Replies": replies = count
                    elif label == "Retweets": retweets = count
                    elif label == "Likes": likes = count
                except:
                    continue
        return replies, retweets, likes
    except:
        return 0, 0, 0

def scroll_and_collect(driver, username, max_tweets):
    tweet_data = []
    tweet_ids = set()
    scroll_pause = 4
    max_retry_attempts = 5

    def load_profile():
        driver.get(f"https://twitter.com/{username}")
        time.sleep(10)

    load_profile()
    last_height = driver.execute_script("return document.body.scrollHeight")

    while len(tweet_data) < max_tweets:
        tweets = driver.find_elements(By.XPATH, '//article[@role="article"]')
        print(f"🧵 {username}: {len(tweets)} tweets on screen. Total collected: {len(tweet_data)}")

        for tweet in tweets:
            try:
                tweet.location_once_scrolled_into_view
                time.sleep(random.uniform(0.5, 1.0))  # Human-like delay
                try:
                    content_elem = tweet.find_element(By.XPATH, './/div[@data-testid="tweetText"]')
                except:
                    content_elem = tweet.find_element(By.XPATH, './/div[@lang]')
                content = content_elem.text.strip()
                tweet_id = hash(content)
                if tweet_id not in tweet_ids and content:
                    replies, retweets, likes = extract_engagement(tweet)
                    tweet_data.append({
                        "username": username,
                        "content": content,
                        "likes": likes,
                        "retweets": retweets,
                        "replies": replies
                    })
                    tweet_ids.add(tweet_id)
            except:
                continue

        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(random.uniform(scroll_pause, scroll_pause + 2))

        new_height = driver.execute_script("return document.body.scrollHeight")

        if new_height == last_height:
            print(f"⚠️ {username}: No new tweets loaded. Trying retry clicks...")

            for attempt in range(1, max_retry_attempts + 1):
                print(f"🔁 Retry attempt {attempt}/{max_retry_attempts}")
                try:
                    retry_btn = driver.find_element(By.XPATH, '//span[contains(text(), "Try again") or contains(text(), "Retry")]')
                    retry_btn.click()
                    time.sleep(10 + attempt * 2)  # Increase wait on each attempt
                    new_height = driver.execute_script("return document.body.scrollHeight")
                    if new_height != last_height:
                        print("✅ Retry worked!")
                        break
                except:
                    time.sleep(6 + attempt)

            else:
                print(f"⛔ Giving up on @{username} after {max_retry_attempts} retries.")
                break
        else:
            last_height = new_height

    print(f"✅ Final count for @{username}: {len(tweet_data)} tweets")
    return tweet_data[:max_tweets]

def main():
    driver = setup_driver()
    driver.get("https://twitter.com")
    time.sleep(4)

    cookies = pickle.load(open("twitter_cookies.pkl", "rb"))
    for cookie in cookies:
        driver.add_cookie(cookie)

    all_tweets = []
    for username in USERNAMES:
        print(f"\n🔍 Scraping @{username}...")
        tweets = scroll_and_collect(driver, username, MAX_TWEETS)
        all_tweets.extend(tweets)
        print(f"✅ Saved {len(tweets)} tweets for @{username}")

        sleep_between = random.uniform(10, 20)
        print(f"😴 Sleeping for {sleep_between:.1f} seconds before next user...")
        time.sleep(sleep_between)

    df = pd.DataFrame(all_tweets)
    df.to_csv("tweets_all_accounts.csv", index=False)
    print(f"\n✅ Done. Total tweets saved: {len(df)}")
    driver.quit()

if __name__ == "__main__":
    main()
