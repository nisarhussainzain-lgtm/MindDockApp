# 📧 Real Gmail Verification Setup Guide

To make the verification codes actually arrive in a user's Gmail inbox, you need to connect your website to **EmailJS** (a free service).

### Step 1: Create an Account
1. Go to [emailjs.com](https://www.emailjs.com/) and sign up for a free account.

### Step 2: Add Email Service
1. In the EmailJS dashboard, click **"Email Services"** -> **"Add New Service"**.
2. Select **Gmail** and connect your Gmail account.
3. Once connected, copy the **Service ID** (e.g., `service_abc123`).

### Step 3: Create Email Template
1. Go to **"Email Templates"** -> **"Create New Template"**.
2. In the "Message" or "Subject" area, use `{{otp_code}}` to show the verification code.
3. Example Body:
   > Hello {{user_name}},
   > 
   > Your StudyHub verification code is: **{{otp_code}}**
   > 
   > If you did not request this, please ignore this email.
4. Click **"Save"**.
5. Copy the **Template ID** (e.g., `template_xyz456`).

### Step 4: Get Public Key
1. Go to **"Account"** (or click on your profile).
2. Look for **"API Keys"** or **"Public Key"**.
3. Copy the **Public Key**.

### Step 5: Provide Your Keys
Please paste your keys below and tell me to update the website. I will then plug them into the code for you!

- **Service ID:** `PASTE_HERE`
- **Template ID:** `PASTE_HERE`
- **Public Key:** `PASTE_HERE`

---
**Note:** Until you provide these keys, the system will run in **Simulation Mode** (the code will show up in a popup on the screen so you can still test it). Once the keys are added, it will send real emails!
