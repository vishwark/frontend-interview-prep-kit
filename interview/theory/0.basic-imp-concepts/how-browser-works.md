# How Browser Works

![Browser Architecture Overview](./browser-architecture.webp)

## Definition
A browser is the way to connect to the internet and access information from around the world. Every day millions of web pages are visited. Understanding how browsers work is essential for web developers to optimize performance and improve user experience.

---

## 🧱 Browser Overview

- Users request a web page by entering the URL in the address bar.

- If it is for the first time, the Browser sends the request to DNS (Domain Name Server) and gets the IP address of the place where the information is stored.

- Based on the IP address, it creates a secure TCP connection.

- The network layer sends the request to the Server to share the webpage resources.

- Server then verifies and analyzes the request and sends the data (HTML, CSS, Javascript, Images, Fonts, etc.).

- The browser receives the data and using the Rendering Engine renders the web page content.

- If there is any script to be executed, the browser will use Javascript Engine to compile and execute.

- If any data needs to be persisted, that will be cached for further use (So that website performance can be increased by reducing the network calls).

---

## 🏗️ Browser Components

The browser has a high-level infrastructure with the following components:

- **User Interface** — Address bar, buttons, menus, etc.
- **Network Layer** — Handles DNS, TCP, HTTPS connections
- **Browser Engine** — Manages browser functionality
- **Rendering Engine** — Converts HTML/CSS to pixels
- **Javascript Engine** — Compiles and executes JavaScript
- **Data Storage Layer** — Caches and persists data

---

## 4️⃣ Browser's 4 Basic Steps

1. **Request** — User requests a web page
2. **Render** — Browser renders the page
3. **Display** — Page is displayed to user
4. **Store** — Data is cached for future use

---

## 📡 1. Request Phase

Users request a web page by entering the URL in the address bar. The browser connects with the server and requests the page resource to display it on the screen.

### Network Layer

When the browser receives a web page URL from the address bar:

- It checks if the requested page address is already there in the DNS cache.

- If not, Network Layer establishes the connection with DNS and requests for the IP address of the server.

- Network Layer uses this IP address to create the TCP connection with the Server.

- If the TCP connection is established over HTTPS, one more roundabout trip happens with the server to build the secure connection (TLS/SSL).

- Here server and client decide what kind of cipher will be used to encrypt the communication.

- The server will send the digital certificate to confirm its identity.

- Once it is verified by the client, secure connection is established.

- Once the secure connection is established, Network Layer sends the initial HTTPS GET request on behalf of the browser.

- Most often, an HTML file of the webpage is requested.

- The server receives the request and responds with relevant headers and content of HTML.

---

## 🎨 2. Render Phase

The server sends the data. It will be processed using the Render Engine and displayed on the screen.

### Render Engine

Render Engine uses Critical Rendering Path to convert data into pixels on the screen.

#### Building DOM

- The received HTML document will be parsed using an HTML parser.

- The parser converts content into tokens, using tokenization.

- These tokens will be used to create the DOM tree.

- The DOM tree will have the nodes.

- These nodes contain the content and attributes of each element in the Document.

#### Building CSSOM

- Style sheet data will be parsed by a CSS parser.

- The parser converts data into tokens, tokens into CSSOM tree.

- Though DOM Tree creation and CSSOM creation look similar, underneath both use different algorithms.

- CSSOM is a Tree of nodes with respective style data.

#### Creating Render Tree

- By combining DOM and CSSOM a new tree called Render Tree is created.

- The Render tree will have all the elements except the element with `display: none` property.

- It is a hierarchy of nodes, and each node has content, style properties, and attributes to render the elements on the screen.

#### Layout Process

- Based on the availability of Elements in the Render Tree, the Layout process starts.

- In this process dimensions and position of each element will be calculated to paint where each element should appear on the screen.

#### Painting Process

- After the Layout, the Painting process starts.

- In painting, Pixels are drawn based on the node information.

- This is done layer by layer.

- These layers will be composed.

#### Incremental Rendering

- The rendering engine does this chunk by chunk.

- The moment it gets the data it will start the process of layout and painting.

- It will not wait until all the data is downloaded.

---

## ⚙️ 3. Javascript Engine

While parsing HTML document data, we will come across some blocking (Javascript) and non-blocking resources (CSS, fonts, images).

### Blocking vs Non-Blocking Resources

- **Non-blocking resources** will be handled by parsers.

- **Blocking resources** — Javascript files are compiled and executed by the Javascript Engine.

### Javascript Engine Components

The Javascript Engine has two components:

- **Memory Heap** — The place where all the javascript code is stored.

- **Call Stack** — A stack data structure that keeps track of function calls and manages their execution order by Last in First out manner.

### Single-Threaded Execution

- Javascript is a single-threaded language, it executes one task at a time.

- If it gets multiple tasks, it won't entertain until it finishes the existing task at hand.

### Handling Multiple Tasks

- The Javascript engine has to handle multiple tasks like I/O events, data fetching, etc.

- In such scenarios the task will get stuck and users can see a blank screen or a jank effect on the screen.

- This blocking issue can be handled by running these tasks asynchronously.

- For that, the JS engine uses some browser-provided features like `setTimeout`, `Fetch`, `DOM API`, `HTTP`, etc.

- Tasks are executed asynchronously using a process called **Event Loop**.

---

## 🖥️ 4. Display Phase

### User Interface

- Basically, it is about how the User Interface of any browser should look like.

- Such as the address bar, Forward/Backward buttons, Home Button, Bookmark menu, Input, etc.

- Over the period, after many iterations, the whole industry has come to a common design and specification.

- Along with these, we have a large viewport to display content fetched from the server.

### Browser Engine

The Browser Engine takes care of most of the browser functionality either directly or indirectly.

- It handles primitive functionalities like forward, reload, backward, navigation, bookmarks, alerts, etc.

- Any kind of user interaction on the screen will be communicated to the Render Engine.

- It uses the Network Layer to communicate with the server.

- It manages the browser extension, add-ons, tab handling, history management, etc.

- It handles browser security. It not only prevents malicious activity but also protects user privacy.

---

## 💾 5. Storage Phase

### Data Storage Layer

Data Storage Layer is the persistence layer, which is used by the browser to save data locally. It could be used to cache data or persist the data or other usages.

### Types of Storage

#### 🍪 Cookies

- Key-value pair Javascript object data.

- Stored in the browser memory.

- Max size: 5 MB.

- Used during communication between Client and Server.

#### 📦 Local Storage

- Key-value Javascript object.

- Maximum size: 50 MB.

- Used to store user data, state, auth tokens, etc.

- The stored data is not cleared, unless the user deletes it.

#### ⏱️ Session Storage

- Key-value pair javascript object and function.

- The data remains stored until the browser session is active.

- Once the browser is closed the stored data will be deleted.

- Max size: 5 MB.

#### 🗄️ IndexedDB

- Used for storing large amounts of structured data in the browser.

#### 📁 FileSystem

- Provides access to a sandboxed file system within the browser.

- For reading, writing, and manipulating files.

#### 🔄 Service Workers

- Service Workers are often used to implement offline caching strategies.

- Used for intercepting and caching network requests.

- Enables offline functionality and performance optimizations in web applications.

---

## 🧠 Key Takeaways

- Browser architecture consists of multiple layers working together seamlessly.

- Understanding the request-render-display-store cycle helps optimize web performance.

- The rendering engine's critical rendering path is crucial for fast page loads.

- Javascript execution can block rendering — use async/defer for non-critical scripts.

- Storage mechanisms allow for better performance through caching and offline support.
