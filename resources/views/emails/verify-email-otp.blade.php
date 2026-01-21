<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your email</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #0f172a;
            max-width: 640px;
            margin: 0 auto;
            padding: 24px;
            background-color: #f3f4f6;
        }
        .container {
            background-color: #ffffff;
            border-radius: 14px;
            padding: 32px;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
            border: 1px solid #e5e7eb;
        }
        .header {
            text-align: center;
            margin-bottom: 22px;
        }
        .badge {
            width: 56px;
            height: 56px;
            border-radius: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
            margin-bottom: 14px;
        }
        .title {
            margin: 0;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -0.02em;
        }
        .subtitle {
            margin: 6px 0 0;
            color: #475569;
            font-size: 14px;
        }
        .otpWrap {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 18px;
            text-align: center;
            margin: 18px 0 6px;
        }
        .otp {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 10px;
            color: #0b1220;
        }
        .hint {
            color: #64748b;
            font-size: 12px;
            margin-top: 10px;
        }
        .content p {
            margin: 10px 0;
            color: #0f172a;
            font-size: 14px;
        }
        .footer {
            margin-top: 22px;
            padding-top: 14px;
            border-top: 1px solid #e5e7eb;
            color: #64748b;
            font-size: 12px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="badge" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6.5V17.5C4 18.3284 4.67157 19 5.5 19H18.5C19.3284 19 20 18.3284 20 17.5V6.5C20 5.67157 19.3284 5 18.5 5H5.5C4.67157 5 4 5.67157 4 6.5Z" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M6 7.5L12 12L18 7.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h1 class="title">Verify your email</h1>
            <p class="subtitle">This is the code for verifying your account on {{ $appName }}.</p>
        </div>

        <div class="content">
            <p>Hello {{ $user->fname ?? $user->email }},</p>
            <p>Please enter the 6-digit code below to complete your registration.</p>

            <div class="otpWrap">
                <div class="otp">{{ $otp }}</div>
                <div class="hint">This code expires in {{ $expiresMinutes }} minutes.</div>
            </div>

            <p>If you didn’t request this, you can safely ignore this email.</p>
        </div>

        <div class="footer">
            <p>This is an automated message from {{ $appName }}.</p>
        </div>
    </div>
</body>
</html>

