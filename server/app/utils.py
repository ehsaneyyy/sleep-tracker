def generate_sleep_insight(entries):
    if not entries:
        return "No sleep data yet. Log your first night to get an insight."

    total = 0
    avg_quality = 0
    count = 0

    for e in entries:
        duration = (e.wake_time - e.sleep_time).total_seconds() / 3600
        total += duration
        avg_quality += e.quality
        count += 1

    avg_hours = total / count
    avg_qual = avg_quality / count

    if avg_hours < 6:
        tip = "You're sleeping less than 6 hours on average. Try going to bed 30 minutes earlier."
    elif avg_hours > 9:
        tip = "You're sleeping more than 9 hours. Oversleeping can sometimes make you feel groggy."
    else:
        tip = "Your average sleep duration looks good."

    if avg_qual < 3:
        tip += (
            " Your quality scores are low — consider reducing screen time before bed."
        )
    else:
        tip += " Keep up the consistent quality."

    return tip
