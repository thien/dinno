# Non-Functional Requirements

## Security/Access Requirements

| Requirement Type | Description |
|------------------|-------------|
|Security|User accounts should be secured with passwords and personal data being hashed/encrypted and stored in a secure database.|
|Security|The system should prevent against common SQL injection or brute-force attacks on login pages|
|Security|The site should be able to resist at least 90% of potential DDoS attacks.|
|Security|The failure rate for password authentication on login pages should not exceed 0.005%.|
|Security|The system should provide logs on all visitor requests to the site in order to monitor potentially malicious behaviour.|
|Access|The admin login section of the site should have authentication in place to restrict access from malicious users.|

## Performance

| Requirement Type | Description |
|------------------|-------------|
|Reliability|The system should store backups of all customer and admin data which can be loaded as needed so as to ensure the website can still run if the database is corrupted.|
|Reliability|The system should be able to detect potential errors and provide warnings to users/admins.|
|Efficiency|Searches should take no more than 4 seconds for at least 95% of users.|
|Responsiveness|Response time on mobile should match or at least be no more than a second greater than on desktop for 95% of users.|
|Responsiveness|It should be the case that for normal users the response time for loading new pages should not exceed 4 seconds for at least 95% of pages.|
|Responsiveness|Private messages sent between users should be received within 1 second for at least 95% of users.|
|Responsiveness|The system should have animation/feedback on all input buttons/links to indicate to a user that the site is responding to mouse input correctly.|
|Scalability|Ensure the site has a modular design to ensure that any extra site features/pages can be implemented when needed.|
|Scalability|New database tables/records should be able to be added easily using site admin tools.|
|Robustness|The site should be able to cope with a sudden influx of requests (eg. on login page) without going down.|
|Robustness|The site should be able to deal with invalid login details by performing validation and giving appropriate error messages.|
|Robustness|There should be limits on what size image files should be uploaded to the system to prevent excessively large files being uploaded which slow down the system.|
|Robustness|The system should be maintained so as to account for changes which could potentially lead to errors, such as dead links or updates to implemented APIs.|

## Usability/Ease of Access

| Requirement Type | Description |
|------------------|-------------|
|Usability|At least 80% of users shall rate the system as easy to use.|
|Usability|The site should have a navigation system that is easy to understand as according to at least 80% of users.|
|Usability|Any error messages given to the user for things such as incorrect input should be as specific and clear as possible so as to prevent confusion as to what has occurred, and should provide a possible solution depending on the error|
|Accessibility|The system should have colour schemes which do not cause problems for people with colour blindness.|
|Accessibility|The system should be accessible on all major desktop & mobile operating systems (Chrome, Safari, IE, Firefox)|
|Accessibility|The site should adjust the size and position of content appropriately depending on the screen size of the user.|

## Maintainability

| Requirement Type | Description |
|------------------|-------------|
|Maintainability|All the site code should be well commented and documented.|
|Maintainability|The code should have low complexity with average method length not exceeding 100 lines.|
|Maintainability|The site should use modular, organised architectures which are easily modifiable and maintainable.|
|Maintainability|Installation or removal of site features should leave all database contents and all personal settings unchanged.|
