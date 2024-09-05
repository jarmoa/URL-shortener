## RUN
npx tsc
node dist/index.js


### Functional requirements 

User can shorten any URL using your service by submitting it to your ‘/shorten’ HTTP endpoint using POST method
User can add additional parameter in ‘/shorten’ requests to propose a code, e.g. my123 . If the code is free, it will be allocated to that user and its URL.
User-defined codes need to be at least 4 characters long
System-assigned codes are always 6 characters long
User can call ‘/<short code>’ using GET method , e.g. /my1234 and be redirected to the URL that was assigned to it
Your service should assign a shortening code that consists of only digits and english alphabet characters (case sensitive) e.g. abc123
Shortening code needs to be unique and pointing at 1 URL
System needs to keep track of how many times each short code was used in redirection
User can access their short codes through ‘/stats’ GET endpoint and get information about their codes, URLs and counters


### Non-functional requirements

Availability: We want our system to be available at all times at any cost because we want our users to access any URL anytime.
Scalability: We want our system to be capable enough to handle an increasing number of URLs.
Readability: We want our system to generate short URLs that can easily be read, distinguished, and typed.
Latency: We want our system to perform at low latency to give users a better experience.
Unpredictability: We want our system to generate highly unpredictable and unique short URLs to increase security.


Database: For services like URL shortening, there isn’t a lot of data to store. However, the storage has to be horizontally scalable. The types of data we need to store include:

### User details
Mappings of the URLs (the long URLs that are mapped onto short URLs)
Since the stored records will have no relationships among themselves other than linking the URL-creating user’s details, so we don’t need structured storage for record keeping. Also, our system will be read-heavy, so NoSQL is a suitable choice for storing data. In particular, MongoDB is a good choice for the following reasons:

It uses leader-follower protocol, making it possible to use replicas for heavy reading.
MongoDB ensures atomicity in concurrent write operations and avoids collisions by returning a duplicate key errors for record-duplication issues.

for encode nanoid https://www.npmjs.com/package/nanoid
Key features of nanoid include:

Compactness: IDs generated by nanoid are shorter than UUIDs, making them suitable for use in URLs.
Security: The generated IDs are secure and resistant to collision attacks.
Customizability: You can configure the length and character set of the IDs.
In the URL shortening service, nanoid is used to generate the short codes (e.g., abc123) that correspond to original URLs. These short codes are then stored and used to redirect users to the original URLs.



### Fulfilling no functional requirements 

### Availability

The Amazon S3 service backs up the storage and cache servers daily. We can restore them upon fault occurrence.
Global server load balancing to handle the system's traffic
Rate limiters to limit each user's resource allocation


### Scalability

Horizontal sharding of the database
Distribution of the data based on consistent hashing
MongoDB as the NoSQL database

### Readability

Encoding URL winth nanoId
Removal of non-alphanumeric characters
Removal of look-alike characters

### Latency

Unnoticeable delay in the overall operation
MongoDB because of its low latency and high throughput in reading tasks
Distributed cache to minimize the service delays

### Unpredictability

Randomly selecting and associating an ID to each request from the pool of unused and readily available unique IDs

### Nice to have

Load balancing: We can employ Global Server Load Balancing (GSLB) apart from local load balancing to improve availability. Since we have plenty of time between a short URL being generated and subsequently accessed, we can safely assume that our database is geographically consistent and that distributing requests globally won’t cause any issues.

Cache: For our specific read-intensive design problem, Memcached is the best choice for a cache solution. We require a simple, horizontally scalable cache system with minimal data structure requirements. Moreover, we’ll have a datacenter-specific caching layer to handle native requests. Having a global caching layer will result in higher latency.

Rate limiter: Limiting each user’s quota is preferable for adding a security layer to our system. We can achieve this by uniquely identifying users through their unique api_dev_key. Considering our system’s simplicity and requirements, the fixed window counter algorithm would serve the purpose. We can assign a set number of shortening and redirection operations per api_dev_key for a specific timeframe.

## Test
Check postman collection 

