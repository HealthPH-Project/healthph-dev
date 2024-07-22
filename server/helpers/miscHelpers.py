from datetime import datetime, timedelta, timezone


def get_ph_datetime():
    ph_timezone = timezone(timedelta(hours=8))

    return datetime.now(ph_timezone).replace(tzinfo=None)
