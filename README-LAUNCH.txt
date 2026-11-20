LEADERCORE WEBSITE (leader-core.com) - LAUNCH NOTES

WHAT THIS IS
A static 5-page site: Home, About, Services (includes Leader Practicum), Resources (Featured Book + 5-Minute Coach), Contact.
No shop, no cart, and no email address is published. No build step: the folder can be uploaded to any static host as is.
To preview: unzip, then double-click index.html.

BEFORE LAUNCH CHECKLIST
1. Images: the client logos and the headshot currently load from the Squarespace site. Those links stop working when the
   Squarespace site is switched off. On a computer with internet, run:  python3 localize-images.py
   (it downloads every image into /images and rewrites the HTML).
2. Fonts: the site uses Gelion (files in /fonts: Regular, Medium, SemiBold, Bold, plus Regular, SemiBold and Bold Italic, as .woff). Nothing loads from Google Fonts.
   Gelion is a commercial font. Confirm your license covers use on a website before launch.
3. Forms (two Google Forms). STATUS: both forms are connected in js/site-config.js. Test each once after launch.
   (Original instructions follow.) The sign-up form and the book-request form send to Google Forms, so you receive the answers
   the way Square used to forward them.
   a. In Google Forms (your Workspace account) create two forms:
      - Sign-up: First Name, Last Name, Email Address (short answer).
      - Book request: First Name, Last Name, Street Address, City, State, ZIP Code, Email Address (short answer). U.S. addresses only.
   b. In each form's Responses tab, three-dot menu > "Get email notifications for new responses".
   c. For each form: three-dot menu > "Get pre-filled link". Type any text in every field, click "Get link", open the link.
      The address ends in /viewform and each field shows as entry.NNNNNNNNN=text.
   d. Edit js/site-config.js: action = that form address with /viewform changed to /formResponse, and fields = the
      entry.NNNNNNNNN code for each question. Or send me the two pre-filled links and I will fill it in.
   Shortcut: create-leadercore-forms.gs.txt is a one-time script that creates both forms in your Google account, emails you each
   response, and prints the settings for js/site-config.js. Instructions are at the top of that file. It has not been tested
   here (no Google access), so if it errors, use steps a to d instead.
   Until this is done the forms say they are not connected. Google gives the page no confirmation, so the page always
   shows "Thank you!" after sending. Test each form once after launch.
   The book request collects a home address, so keep that Google Form private to your account.

HOSTING (free): GitHub Pages is the best fit because the domain stays at Square.
 - Create a GitHub account and a public repository (for example leadercore-site). Upload the contents of this folder.
 - Repository Settings > Pages > Source: deploy from the main branch, root folder. The CNAME file already says leader-core.com.
 - At Square (Squarespace Domains) > leader-core.com > DNS settings, add custom records:
     A     @    185.199.108.153
     A     @    185.199.109.153
     A     @    185.199.110.153
     A     @    185.199.111.153
     CNAME www  <your-github-username>.github.io
   Confirm these values against GitHub's current "Managing a custom domain for your GitHub Pages site" page before saving.
 - Do NOT delete or edit the existing MX / TXT records. They carry Google Workspace email. Only add the records above.
 - Back in GitHub Pages settings tick "Enforce HTTPS" once the certificate is issued (can take up to an hour or so).
