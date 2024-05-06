import smtplib
from smtplib import SMTPException
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import base64
from dotenv import dotenv_values
import os

config = dotenv_values()

smtp_port = os.getenv("SMTP_PORT")
smtp_server = os.getenv("SMTP_SERVER")
smtp_username = os.getenv("SMTP_USERNAME")
smtp_password = os.getenv("SMTP_PASSWORD")
smtp_sender_email = os.getenv("SMTP_SENDER_EMAIL")


def mail_setup(receiver, subject):
    message = MIMEMultipart("alternative")
    message["From"] = smtp_sender_email
    message["Subject"] = subject
    message["To"] = receiver

    return message


def mail_send(receiver, message):
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.sendmail(smtp_sender_email, receiver, message.as_string())

            print("Successfully sent email")

            return True
    except SMTPException as e:
        print(e)
        return False


def get_styles():
    return """\
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        .body {
            max-width: 600px;
            width: 100%;
            margin: auto;
        }

        .body .header {
            width: 100%;
        }

        .body .header .img {
            height: 100%;
            width: 100%;
            object-fit: contain;
        }

        .body .main {
            margin-top: 32px;
            padding: 16px;
            padding-top: 0px;
        }
        .body .p {
            color: #171e26;
            font-family: Inter, Roboto, sans-serif;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            margin: 0;
        }

        .body .semibold {
            font-weight: 600;
        }

        .body .bold {
            font-weight: 600;
        }

        .body .red {
            color: #D82727;
        }

        .body .green {
            color: #35CA3B
        }
        
        .body .link {
            color: #288dd7;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: 24px;
            text-decoration: none;
        }

        .body .indent {
            margin-left: 40px;
        }
        
        .body .spacer {
            height: 16px;
        }
        
        .body .list {
            list-style-type: none;
            padding-inline-start: 0;
        }

        .body .list .list-indent {
            padding-inline-start: 20px;
        }
    </style>     
    """


def mail_forgot_password(receiver, data: dict):
    message = mail_setup(receiver, "Forgot Password")

    first_name, reset_pwd_link = data.values()

    plain_text = f"""\
    This email contains that you requested a RESET PASSWORD LINK to access your account and continue using HealthPH. Please securely open this link:
    
    Reset Password Link: {reset_pwd_link}
    
    May we remind you that you only have 10 minutes to reset your password by using the link above.
    If you did not reset your password within that duration, you will be required to send your email again at Sign In > Forgot Password.
    
    If you need further assistance, please visit or email the DOH Systems Office at:
    
    San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines
    (632) 8651-7800 local 1427
    doh@healthph.org
    
    Regards,
    HealthPH
    """

    encoded = base64.b64encode(
        open("assets/images/mail-header.png", "rb").read()
    ).decode()

    html = f"""\
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>HealthPH</title>
    </head>
    <head>
        {get_styles()}
    </head>
    <body class="body">
        <div class="header">
          <img class="img" src="cid:Header" alt="" />
        </div>
        <div class="main">
          <p class="p">
            This email contains that you requested a{" "}
            <span class="semibold">RESET PASSWORD LINK</span> to access your
            account and continue using HealthPH. Please securely open this link:
          </p>
          <div class="spacer"></div>
          <p class="p">
            <span class="bold">Reset Password Link</span>:{" "}
            <a class="link" href="{reset_pwd_link}">Password Link</a>
          </p>
          <div class="spacer"></div>
          <p class="p">
            May we remind you that you only have{" "}
            <span class="bold red">10 minutes</span> to reset your password
            by using the link above. If you did not reset your password within
            that duration, you will be required send your email again at{" "}
            <span class="bold"> Sign In &gt; Forgot Password.</span>
          </p>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <p class="p">
            If you need further assistance, please visit or email the DOH
            Systems Office at:
          </p>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="indent">
            <p class="p">San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines</p>
            <div class="spacer"></div>
            <p class="p">(632) 8651-7800 local 1427</p>
            <div class="spacer"></div>
            <p class="p">doh@healthph.org</p>
          </div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <p class="p">Regards</p>
          <div class="spacer"></div>
          <p class="p">HealthPH</p>
        </div>
    </body>
    </html>
    """

    part1 = MIMEText(plain_text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    fp = open("assets/images/mail-header.png", "rb")
    header = MIMEImage(fp.read())
    fp.close()

    header.add_header("Content-ID", "<Header>")
    message.attach(header)

    return mail_send(receiver=receiver, message=message)


def mail_add_user(receiver, data: dict):
    message = mail_setup(receiver, "User Account Created")

    last_name, first_name, region, organization, email, password = data.values()

    plain_text = f"""\
    This email contains your credentials to access HealthPH. 
    While working with us, you will be using these credentials to Protect Filipinos, One Disease At A Time.
    Please securely keep this information:
    
    User Type: USER
    HealthPH Email: {email}
    HealthPH Password: {password}
    
    Last Name: {last_name}
    First Name: {first_name}
    Regional Office: {region}
    Organization: {organization}
    
    You will be using the same password to all these systems. The system created this during the account activation process. 
    To allow you to change your password, sign in to HealthPH and go to the Settings > Edit Password. 
    If you have forgotten your password, navigate to Sign In > Forgot Password.
    
    As a USER at HealthPH, you have access to several modules such as:
    
    1. Analytics
    a. The user is able to visualize summary of data about perceived symptoms.
    2. Trends Map
    a. The user is able to monitor perceived symptoms using a map preview or in list view.
    3. Help
    a. The user is able to read manuals or instructions in utilizing HealthPH.
    4. Settings
    a. The user is able to edit their full name, department, organization, email address, and password.
    b. The user is able to delete their account when not in use.
    
    If you need further assistance, please visit or email the DOH Systems Office at:
    
    San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines
    (632) 8651-7800 local 1427
    doh@healthph.org
    
    Regards,
    HealthPH
    """

    html = f"""\
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>HealthPH</title>
    </head>
    <head>
        {get_styles()}
    </head>
    <body class="body">
        <div class="header">
          <img class="img" src="cid:Header" alt="" />
        </div>
        <div class="main">
            <p class="p">
                This email contains your credentials to access HealthPH. While working with us, you will be 
                using these credentials to Protect Filipinos, One Disease At A Time. Please securely keep 
                this information:
            </p>
            <div class="spacer"></div>
            <p class="p">
                <span class="bold">User Type</span>:{" "}
                <span class="green">USER</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                <span class="bold">HealthPH Email</span>:{" "}
                <span class="link">{email}</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                <span class="bold">HealthPH Password</span>:{" "}
                <span class="link">{password}</span>
            </p>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <p class="p">
                <span class="bold">Last Name</span>:{" "}
                <span class="link">{last_name}</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                <span class="bold">First Name</span>:{" "}
                <span class="link">{first_name}</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                <span class="bold">Regional Office</span>:{" "}
                <span class="link">{region}</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                <span class="bold">Organization</span>:{" "}
                <span class="link">{organization }</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                You will be using the same password to all these systems. The system created this during the account activation process. 
                To allow you to change your password, sign in to HealthPH and go to the{" "}
                <span class="semibold">Settings &gt; Edit Password</span>. 
                If you have forgotten your password, navigate to 
                <span class="semibold">Sign In &gt; Forgot Password</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                As a <span class="green semibold">USER</span> at HealthPH, you have access to several modules such as:
            </p>
            <div class="p">
                 <ul class="list">
                    <li><span class="semibold">1. Analytics</span></li>
                    <li class="list-indent">a. The user is able to visualize summary of data about perceived symptoms</li>
                    <li><span class="semibold">2. Trends Map</span></li>
                    <li class="list-indent">a. The user is able to monitor perceived symptoms using a map preview or in list
                        view.</li>
                    <li><span class="semibold">3. Help</span></li>
                    <li class="list-indent">a. The user is able to read manuals or instructions in utilizing HealthPH.</li>
                    <li><span class="semibold">4. Settings</span></li>
                    <li class="list-indent">a. The user is able to edit their full name, department, organization, email address, and password.</li>
                    <li class="list-indent">b. The user is able to delete their account when not in use.</li>
                </ul>
            </div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <p class="p">
                If you need further assistance, please visit or email the DOH
                Systems Office at:
            </p>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="indent">
                <p class="p">San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines</p>
                <div class="spacer"></div>
                <p class="p">(632) 8651-7800 local 1427</p>
                <div class="spacer"></div>
                <p class="p">doh@healthph.org</p>
            </div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <p class="p">Regards</p>
            <div class="spacer"></div>
            <p class="p">HealthPH</p>
        </div>
    </body>
    </html>
    """

    part1 = MIMEText(plain_text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    fp = open("assets/images/mail-header.png", "rb")
    header = MIMEImage(fp.read())
    fp.close()

    header.add_header("Content-ID", "<Header>")
    message.attach(header)

    return mail_send(receiver=receiver, message=message)


def mail_add_admin(receiver, data: dict):
    message = mail_setup(receiver, "Admin Account Created")

    email, password = data.values()

    plain_text = f"""\
    This email contains your credentials to access HealthPH. 
    While working with us, you will be using these credentials to Protect Filipinos, One Disease At A Time.
    Please securely keep this information:
    
    User Type: ADMIN
    HealthPH Email: {email}
    HealthPH Password: {password}
    
    You will be using the same password to all these systems. The system created this during the account activation process. 
    To allow you to change your password, sign in to HealthPH and go to the Settings > Edit Password. 
    If you have forgotten your password, navigate to Sign In > Forgot Password.
    
    As an ADMIN at HealthPH, you have access to several modules such as:
    
    1. Analytics
    a. The admin is able to visualize summary of data about perceived symptoms.
    2. Trends Map
    a. The admin is able to monitor perceived symptoms using a map or in list view.
    3. Users
    a. The admin is able to verify users based on their personal information to receive access to HealthPH.
    4. Help
    a. The admin is able to read manuals or instruction in utilizing HealthPH.
    5. Activity Logs
    a. The admin is able to monitor users' activities in using HealthPH. 
    6. Settings
    a. The admin is able to edit their full name, department, organization, email address, and password.
    b. The admin is able to delete their account when not in use. 
    
    If you need further assistance, please visit or email the DOH Systems Office at:
    
    San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines
    (632) 8651-7800 local 1427
    doh@healthph.org
    
    Regards,
    HealthPH
    """

    html = f"""\
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>HealthPH</title>
    </head>
    <head>
        {get_styles()}
    </head>
    <body class="body">
        <div class="header">
          <img class="img" src="cid:Header" alt="" />
        </div>
        <div class="main">
            <p class="p">
                This email contains your credentials to access HealthPH. While working with us, you will be 
                using these credentials to Protect Filipinos, One Disease At A Time. Please securely keep 
                this information:
            </p>
            <div class="spacer"></div>
            <p class="p">
                <span class="bold">User Type</span>:{" "}
                <span class="green">ADMIN</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                <span class="bold">HealthPH Email</span>:{" "}
                <span class="link">{email}</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                <span class="bold">HealthPH Password</span>:{" "}
                <span class="link">{password}</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                You will be using the same password to all these systems. The system created this during the account activation process. 
                To allow you to change your password, sign in to HealthPH and go to the{" "}
                <span class="semibold">Settings &gt; Edit Password</span>. 
                If you have forgotten your password, navigate to 
                <span class="semibold">Sign In &gt; Forgot Password</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                As an <span class="green semibold">ADMIN</span> at HealthPH, you have access to several modules such as:
            </p>
            <div class="p">
                <ul class="list">
                    <li><span class="semibold">1. Analytics</span></li>
                    <li class="list-indent">a. The admin is able to visualize summary of data about perceived symptoms</li>
                    <li><span class="semibold">2. Trends Map</span></li>
                    <li class="list-indent">a. The admin is able to monitor perceived symptoms using a map preview or in list
                        view.</li>
                    <li><span class="semibold">3. Users</span></li>
                    <li class="list-indent">a. The admin is able to verify users based on their personal information to receive access to HealthPH.</li>
                    <li><span class="semibold">4. Help</span></li>
                    <li class="list-indent">a. The admin is able to read manuals or instructions in utilizing HealthPH.</li>
                    <li><span class="semibold">5. Activity Logs</span></li>
                    <li class="list-indent">a. The admin is able to monitor users' activities in using HealthPH.</li>
                    <li><span class="semibold">6. Settings</span></li>
                    <li class="list-indent">a. The admin is able to edit their full name, department, organization, email address, and password.</li>
                    <li class="list-indent">b. The admin is able to delete their account when not in use.</li>
                </ul>
            </div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <p class="p">
                If you need further assistance, please visit or email the DOH
                Systems Office at:
            </p>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="indent">
                <p class="p">San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines</p>
                <div class="spacer"></div>
                <p class="p">(632) 8651-7800 local 1427</p>
                <div class="spacer"></div>
                <p class="p">doh@healthph.org</p>
            </div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <p class="p">Regards</p>
            <div class="spacer"></div>
            <p class="p">HealthPH</p>
        </div>
    </body>
    </html>
    """

    part1 = MIMEText(plain_text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    fp = open("assets/images/mail-header.png", "rb")
    header = MIMEImage(fp.read())
    fp.close()

    header.add_header("Content-ID", "<Header>")
    message.attach(header)

    return mail_send(receiver=receiver, message=message)


def mail_add_superadmin(receiver, data: dict):
    message = mail_setup(receiver, "Superadmin Account Created")

    email, password = data.values()

    plain_text = f"""\
    This email contains your credentials to access HealthPH. 
    While working with us, you will be using these credentials to Protect Filipinos, One Disease At A Time.
    Please securely keep this information:
    
    User Type: SUPERADMIN
    HealthPH Email: {email}
    HealthPH Password: {password}
    
    You will be using the same password to all these systems. The system created this during the account activation process. 
    To allow you to change your password, sign in to HealthPH and go to the Settings > Edit Password. 
    If you have forgotten your password, navigate to Sign In > Forgot Password.
    
    As a SUPERADMIN at HealthPH, you have full access to every modules such as:
    
    1. Analytics
    a. The superadmin is able to visualize summary of data about perceived symptoms.
    2. Trends Map
    a. The superadmin is able to monitor perceived symptoms using a map or in list view.
    3. Admins 
    a. The superadmin is able to add, verify, and delete an admin.
    3. Users
    a. The superadmin is able to verify users based on their personal information to receive access to HealthPH.
    4. Help
    a. The superadmin is able to read manuals or instruction in utilizing HealthPH.
    5. Activity Logs
    a. The superadmin is able to monitor users' activities in using HealthPH. 
    6. Settings
    a. The superadmin is able to edit their full name, department, organization, email address, and password.
    b. The superadmin is able to delete their account when not in use. 
    
    If you need further assistance, please visit or email the DOH Systems Office at:
    
    San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines
    (632) 8651-7800 local 1427
    doh@healthph.org
    
    Regards,
    HealthPH
    """

    html = f"""\
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>HealthPH</title>
    </head>
    <head>
        {get_styles()}
    </head>
    <body class="body">
        <div class="header">
          <img class="img" src="cid:Header" alt="" />
        </div>
        <div class="main">
            <p class="p">
                This email contains your credentials to access HealthPH. While working with us, you will be 
                using these credentials to Protect Filipinos, One Disease At A Time. Please securely keep 
                this information:
            </p>
            <div class="spacer"></div>
            <p class="p">
                <span class="bold">User Type</span>:{" "}
                <span class="green">SUPERADMIN</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                <span class="bold">HealthPH Email</span>:{" "}
                <span class="link">{email}</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                <span class="bold">HealthPH Password</span>:{" "}
                <span class="link">{password }</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                You will be using the same password to all these systems. The system created this during the account activation process. 
                To allow you to change your password, sign in to HealthPH and go to the{" "}
                <span class="semibold">Settings &gt; Edit Password</span>. 
                If you have forgotten your password, navigate to 
                <span class="semibold">Sign In &gt; Forgot Password</span>
            </p>
            <div class="spacer"></div>
            <p class="p">
                As a <span class="green semibold">SUPERADMIN</span> at HealthPH, you have access to several modules such as:
            </p>
            <div class="p">
                <ul class="list">
                    <li><span class="semibold">1. Analytics</span></li>
                    <li class="list-indent">a. The superadmin is able to visualize summary of data about perceived symptoms</li>
                    <li><span class="semibold">2. Trends Map</span></li>
                    <li class="list-indent">a. The superadmin is able to monitor perceived symptoms using a map preview or in list
                        view.</li>
                    <li><span class="semibold">3. Admins</span></li>
                    <li class="list-indent">a. The superadmin is able to add, verify, and delete an admin.</li>
                    <li><span class="semibold">3. Users</span></li>
                    <li class="list-indent">a. The superadmin is able to verify users based on their personal information to receive access to HealthPH.</li>
                    <li><span class="semibold">4. Help</span></li>
                    <li class="list-indent">a. The superadmin is able to read manuals or instructions in utilizing HealthPH.</li>
                    <li><span class="semibold">5. Activity Logs</span></li>
                    <li class="list-indent">a. The superadmin is able to monitor users' activities in using HealthPH.</li>
                    <li><span class="semibold">6. Settings</span></li>
                    <li class="list-indent">a. The superadmin is able to edit their full name, department, organization, email address, and password.</li>
                    <li class="list-indent">b. The superadmin is able to delete their account when not in use.</li>
                </ul>
            </div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <p class="p">
                If you need further assistance, please visit or email the DOH
                Systems Office at:
            </p>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="indent">
                <p class="p">San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines</p>
                <div class="spacer"></div>
                <p class="p">(632) 8651-7800 local 1427</p>
                <div class="spacer"></div>
                <p class="p">doh@healthph.org</p>
            </div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <p class="p">Regards</p>
            <div class="spacer"></div>
            <p class="p">HealthPH</p>
        </div>
    </body>
    </html>
    """

    part1 = MIMEText(plain_text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    fp = open("assets/images/mail-header.png", "rb")
    header = MIMEImage(fp.read())
    fp.close()

    header.add_header("Content-ID", "<Header>")
    message.attach(header)

    return mail_send(receiver=receiver, message=message)


def mail_enabled(receiver):
    message = mail_setup(receiver, "Account Enabled")

    plain_text = f"""\
    This email contains that your account has been ENABLED. You will now be able to sign in to HealthPH and fully utilize HealthPH and its modules. 
    
    If you need further assistance, please visit or email the DOH Systems Office at:
    
    San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines
    (632) 8651-7800 local 1427
    doh@healthph.org
    
    Regards,
    HealthPH
    """

    html = f"""\
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>HealthPH</title>
    </head>
    <head>
        {get_styles()}
    </head>
    <body class="body">
        <div class="header">
          <img class="img" src="cid:Header" alt="" />
        </div>
        <div class="main">
          <p class="p">
            This email contains that your account has been{" "}
            <span class="semibold green">ENABLED </span>. You will now be able to sign in to 
            HealthPH and fully utilize HealthPH and its modules.
          </p>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <p class="p">
            If you need further assistance, please visit or email the DOH
            Systems Office at:
          </p>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="indent">
            <p class="p">San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines</p>
            <div class="spacer"></div>
            <p class="p">(632) 8651-7800 local 1427</p>
            <div class="spacer"></div>
            <p class="p">doh@healthph.org</p>
          </div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <p class="p">Regards</p>
          <div class="spacer"></div>
          <p class="p">HealthPH</p>
        </div>
    </body>
    </html>
    """

    part1 = MIMEText(plain_text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    fp = open("assets/images/mail-header.png", "rb")
    header = MIMEImage(fp.read())
    fp.close()

    header.add_header("Content-ID", "<Header>")
    message.attach(header)

    return mail_send(receiver=receiver, message=message)


def mail_disabled(receiver):
    message = mail_setup(receiver, "Account Disabled")

    plain_text = f"""\
    This email contains that your account has been DISABLED. You will be unable to sign in to HealthPH and lose access to its modules. 
    
    If you think this is not the case, please contact us.
    
    If you need further assistance, please visit or email the DOH Systems Office at:
    
    San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines
    (632) 8651-7800 local 1427
    doh@healthph.org
    
    Regards,
    HealthPH
    """

    html = f"""\
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>HealthPH</title>
    </head>
    <head>
        {get_styles()}
    </head>
    <body class="body">
        <div class="header">
          <img class="img" src="cid:Header" alt="" />
        </div>
        <div class="main">
          <p class="p">
            This email contains that your account has been{" "}
            <span class="semibold red">DISABLED</span>. You will be unable to sign in to 
            HealthPH and lose access to its modules.
          </p>
          <div class="spacer"></div>
          <p class="p">
            If you think this is not the case, please contact us.
          </p>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <p class="p">
            If you need further assistance, please visit or email the DOH
            Systems Office at:
          </p>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="indent">
            <p class="p">San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines</p>
            <div class="spacer"></div>
            <p class="p">(632) 8651-7800 local 1427</p>
            <div class="spacer"></div>
            <p class="p">doh@healthph.org</p>
          </div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <p class="p">Regards</p>
          <div class="spacer"></div>
          <p class="p">HealthPH</p>
        </div>
    </body>
    </html>
    """

    part1 = MIMEText(plain_text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    fp = open("assets/images/mail-header.png", "rb")
    header = MIMEImage(fp.read())
    fp.close()

    header.add_header("Content-ID", "<Header>")
    message.attach(header)

    return mail_send(receiver=receiver, message=message)


def mail_delete_account(receiver):
    message = mail_setup(receiver, "Account Deleted")

    plain_text = f"""\
    This email contains that your account has been DELETED. You are still allowed to create another account if you wan to use HealthPH in another time.
    
    If you need further assistance, please visit or email the DOH Systems Office at:
    
    San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines
    (632) 8651-7800 local 1427
    doh@healthph.org
    
    Regards,
    HealthPH
    """

    html = f"""\
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>HealthPH</title>
    </head>
    <head>
        {get_styles()}
    </head>
    <body class="body">
        <div class="header">
          <img class="img" src="cid:Header" alt="" />
        </div>
        <div class="main">
          <p>
            This email contains that your account has been 
            <span class="bold red">DELETED</span>. 
            You are still allowed to create another account if you wan to use HealthPH in another time.
          </p>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <p class="p">
            If you need further assistance, please visit or email the DOH
            Systems Office at:
          </p>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="indent">
            <p class="p">San Lazaro Compound, Tayuman, Sta. Cruz, Manila, Philippines</p>
            <div class="spacer"></div>
            <p class="p">(632) 8651-7800 local 1427</p>
            <div class="spacer"></div>
            <p class="p">doh@healthph.org</p>
          </div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <p class="p">Regards</p>
          <div class="spacer"></div>
          <p class="p">HealthPH</p>
        </div>
    </body>
    </html>
    """

    part1 = MIMEText(plain_text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    fp = open("assets/images/mail-header.png", "rb")
    header = MIMEImage(fp.read())
    fp.close()

    header.add_header("Content-ID", "<Header>")
    message.attach(header)

    return mail_send(receiver=receiver, message=message)
