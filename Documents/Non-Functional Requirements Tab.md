# Non-Functional Requirements

## Appearance/Feel Requirements

| Requirement Type | Description |
|------------------|-------------|
|Style|The logo should be lighthearted and focus on the topic of food sharing.|
|Style|The site will have a responsive design.|
|Style|The site will use system fonts as a preference with universally supported fonts as a backup.|
|Style|The website will be styled in such a manner that it has print formats inclusive in the stylesheets.|
|Style|The site will use a bespoke styling sheet.|
|Style|The site will use colour schemes that are complimentary to the colour Red.|
|Style|The logo will be visible on all pages the website.|
|Layout|The site will have a navigation system that is easy to understand.|

## Security/Access Requirements

| Requirement Type | Description |
|------------------|-------------|
|Security|The system should have a secure system for user accounts with passwords and personal data being hashed/encrypted and stored in a secure database.|
|Security|The system database should be protected by as many security features as possible to prevent attacks, including web application firewalls and other security controls.|
|Security|The system should have features in place to prevent brute-force/robot attacks on login pages, such as adding a Captcha or artificial pauses between login attempts.|
|Security|The system should prevent against rudimentary login attacks such as SQL injection.|
|Security|The system should provide logs on all visitor requests to the site in order to monitor potentially malicious behaviour.|
|Access|The admin login section of the site should have features in place to restrict access from malicious users, by for example only allowing access for trusted I.Ps/domains.|

## Performance

| Requirement Type | Description |
|------------------|-------------|
|Reliability|...|
|Reliability|...|
|Efficiency|Searches should take no more than 4 seconds for for at least 95% of users.|
|Responsiveness|Response time on mobile should match or at least be no more than a second greater than on desktop for 95% of users.|
|Responsiveness|It should be the case that for normal users the response time for loading new pages should not exceed 4 seconds for at least 95% of pages.|
|Responsiveness|Private messages sent between users should be recieved within 1 second|
|Responsiveness|The system should have animation/feedback on all input buttons/links to indicate to a user that the site is responding to mouse input correctly.|
|Scalability|Ensure the site has a modular design to ensure that any extra site features/pages can be implemented when needed.|
|Scalability|New database tables/records should be able to be added easility using site admin tools|
|Robustness|The site should be able to cope with a sudden influx of requests (eg. on login page) without going down, for example by using cloud mitigation services.|
|Robustness|The site should be able to deal with invalid login details by performing validation and give appropriate error messages.|
|Robustness|There should be limits on what size image files should be uploaded to the system to prevent excessively large files being uploaded which slow down the system.|
|Robustness|There should be limits on what size image files should be uploaded to the system to prevent excessively large files being uploaded which slow down the system.|

## Usability/Ease of Access

| Requirement Type | Description |
|------------------|-------------|
|Usability|The system should be intuitive and easy to use for all users, even those who are inexperienced in using computers. It must be ensured that any language is clear and unambiguous, and that no overtly technical terms are used.|
|Usability|The website should provide tutorials/a help page on how to use the site, aimed towards less experienced computer users.|
|Accessibility|The system should provide the ability to adjust size of text & images so that they are readable.|
|Accessibility|The system should have support for screen readers so as to make the site usable by visually impaired/blind persons|
|Accessibility|The system should be accessible on all major desktop & mobile operating systems.|

## €Maintainability

| Requirement Type | Description |
|------------------|-------------|
|Maintainability|All the site code should be well commented and documented|
|Maintainability|The site should use architectures which are easily modifyable and maintainable|


