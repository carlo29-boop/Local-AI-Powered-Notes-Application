from app.services.sentiment import analyze_sentiment


def test_positive_sentiment():
    result = analyze_sentiment(
        "I absolutely love this wonderful experience!"
    )

    assert result["sentiment"] == "positive"


def test_negative_sentiment():
    result = analyze_sentiment(
        "I hate this terrible and horrible experience."
    )

    assert result["sentiment"] == "negative"


def test_neutral_sentiment():
    result = analyze_sentiment(
        "The table is located beside the window."
    )

    assert result["sentiment"] == "neutral"