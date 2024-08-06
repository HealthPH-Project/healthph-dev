from datetime import datetime, timedelta, timezone


def get_ph_datetime():
    ph_timezone = timezone(timedelta(hours=8))

    return datetime.now(ph_timezone).replace(tzinfo=None)


def iso3166_2_to_region(ph_code):
    codes = {
        "PH-00": "NCR",
        "PH-01": "I",
        "PH-02": "II",
        "PH-03": "III",
        "PH-05": "V",
        "PH-06": "VI",
        "PH-07": "VII",
        "PH-08": "VIII",
        "PH-09": "IX",
        "PH-10": "X",
        "PH-11": "XI",
        "PH-12": "XII",
        "PH-13": "XIII",
        "PH-14": "BARMM",
        "PH-15": "CAR",
        "PH-40": "IVA",
        "PH-41": "IVB",
    }
    
    return codes[ph_code]
