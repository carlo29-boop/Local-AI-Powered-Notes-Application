from textblob import TextBlob


def analyze_sentiment(content: str) -> dict:
    blob = TextBlob(content)

    polarity = blob.sentiment.polarity

    if polarity > 0.1:
        sentiment = "positive"

    elif polarity < -0.1:
        sentiment = "negative"

    else:
        sentiment = "neutral"

    return {
        "sentiment": sentiment,
        "polarity": polarity
    }