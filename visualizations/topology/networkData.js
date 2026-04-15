/* ================================
   Network Data & Configurations
   ================================ */

const NetworkData = {
    // Network Types with Complete Configurations
    networks: {
        lan: {
            name: "Local Area Network (LAN)",
            icon: "🏠",
            description: "A network that connects computers and devices within a limited area such as a home, school, or office building.",
            devices: [
                { id: "router", type: "router", name: "Router", x: 400, y: 300, icon: "🔀" },
                { id: "pc1", type: "computer", name: "PC 1", x: 200, y: 200, icon: "💻" },
                { id: "pc2", type: "computer", name: "PC 2", x: 600, y: 200, icon: "💻" },
                { id: "laptop", type: "laptop", name: "Laptop", x: 200, y: 400, icon: "💻" },
                { id: "printer", type: "printer", name: "Printer", x: 600, y: 400, icon: "🖨️" },
                { id: "smartphone", type: "mobile", name: "Phone", x: 400, y: 500, icon: "📱" }
            ],
            connections: [
                { source: "router", target: "pc1", bandwidth: "1 Gbps", latency: 1 },
                { source: "router", target: "pc2", bandwidth: "1 Gbps", latency: 1 },
                { source: "router", target: "laptop", bandwidth: "1 Gbps", latency: 2 },
                { source: "router", target: "printer", bandwidth: "100 Mbps", latency: 2 },
                { source: "router", target: "smartphone", bandwidth: "300 Mbps", latency: 3 }
            ],
            info: {
                title: "Local Area Network (LAN)",
                content: `
                    <h4>What is a LAN?</h4>
                    <p>A Local Area Network connects devices within a small geographic area, typically within a single building or campus. LANs provide high-speed connectivity with low latency.</p>
                    
                    <h4>Key Characteristics:</h4>
                    <ul>
                        <li><strong>Geographic Scope:</strong> Usually limited to a building or campus</li>
                        <li><strong>Speed:</strong> Typically 100 Mbps to 10 Gbps</li>
                        <li><strong>Ownership:</strong> Privately owned and managed</li>
                        <li><strong>Latency:</strong> Very low (< 5ms)</li>
                        <li><strong>Cost:</strong> Low maintenance cost</li>
                    </ul>

                    <h4>Common Technologies:</h4>
                    <ul>
                        <li>Ethernet (wired connections)</li>
                        <li>Wi-Fi (wireless connections)</li>
                        <li>Network switches and routers</li>
                    </ul>

                    <h4>Use Cases:</h4>
                    <ul>
                        <li>Home networks for internet sharing</li>
                        <li>Office networks for file sharing</li>
                        <li>School computer labs</li>
                        <li>Gaming cafes</li>
                    </ul>
                `
            },
            analogy: {
                title: "LAN is like a Family Home",
                content: `
                    <p><strong>Imagine your home with multiple rooms:</strong></p>
                    <p>🏠 The <strong>router</strong> is like the main hallway that connects all rooms.</p>
                    <p>🚪 Each <strong>device</strong> is like a room in your house (bedroom, kitchen, living room).</p>
                    <p>🚶 <strong>Data packets</strong> are like family members walking between rooms to communicate.</p>
                    <p>⚡ Communication is <strong>fast and private</strong> because everyone is under the same roof!</p>
                    <p>👨‍👩‍👧‍👦 You control who enters your home, just like you control which devices connect to your LAN.</p>
                `
            }
        },

        wan: {
            name: "Wide Area Network (WAN)",
            icon: "🌍",
            description: "A network that spans a large geographic area, connecting multiple LANs across cities, countries, or continents.",
            devices: [
                { id: "city1", type: "lan", name: "New York LAN", x: 150, y: 200, icon: "🏙️" },
                { id: "city2", type: "lan", name: "London LAN", x: 650, y: 200, icon: "🏙️" },
                { id: "city3", type: "lan", name: "Tokyo LAN", x: 150, y: 450, icon: "🏙️" },
                { id: "city4", type: "lan", name: "Sydney LAN", x: 650, y: 450, icon: "🏙️" },
                { id: "isp1", type: "server", name: "ISP Router", x: 400, y: 325, icon: "🔀" }
            ],
            connections: [
                { source: "isp1", target: "city1", bandwidth: "10 Gbps", latency: 20 },
                { source: "isp1", target: "city2", bandwidth: "10 Gbps", latency: 50 },
                { source: "isp1", target: "city3", bandwidth: "10 Gbps", latency: 100 },
                { source: "isp1", target: "city4", bandwidth: "10 Gbps", latency: 150 }
            ],
            info: {
                title: "Wide Area Network (WAN)",
                content: `
                    <h4>What is a WAN?</h4>
                    <p>A Wide Area Network connects multiple LANs across large geographic distances. The Internet is the largest WAN in existence.</p>
                    
                    <h4>Key Characteristics:</h4>
                    <ul>
                        <li><strong>Geographic Scope:</strong> Cities, countries, or continents</li>
                        <li><strong>Speed:</strong> Varies from Mbps to Tbps</li>
                        <li><strong>Ownership:</strong> Usually managed by ISPs or telecom companies</li>
                        <li><strong>Latency:</strong> Higher than LAN (10-500ms)</li>
                        <li><strong>Cost:</strong> Higher infrastructure and maintenance costs</li>
                    </ul>

                    <h4>Connection Technologies:</h4>
                    <ul>
                        <li>Fiber optic cables (terrestrial and submarine)</li>
                        <li>Satellite links</li>
                        <li>Microwave transmission</li>
                        <li>Leased lines (T1, T3, etc.)</li>
                    </ul>

                    <h4>Use Cases:</h4>
                    <ul>
                        <li>Connecting branch offices of a company</li>
                        <li>Banking networks across countries</li>
                        <li>University campus networks</li>
                        <li>International communication</li>
                    </ul>
                `
            },
            analogy: {
                title: "WAN is like a Highway System",
                content: `
                    <p><strong>Think of a national highway system connecting cities:</strong></p>
                    <p>🏙️ Each <strong>LAN</strong> is like a city with its own local streets.</p>
                    <p>🛣️ The <strong>WAN connections</strong> are like highways connecting different cities.</p>
                    <p>🚗 <strong>Data packets</strong> are like vehicles traveling between cities on these highways.</p>
                    <p>⏱️ Travel takes <strong>longer</strong> because of the distance (higher latency).</p>
                    <p>🚧 You need <strong>toll roads</strong> (ISP services) to use these highways.</p>
                    <p>📡 Some connections use "aerial routes" like satellite links!</p>
                `
            }
        },

        internet: {
            name: "The Internet",
            icon: "☁️",
            description: "A global network of interconnected networks using standardized protocols to link billions of devices worldwide.",
            devices: [
                { id: "user", type: "computer", name: "Your Device", x: 100, y: 350, icon: "💻" },
                { id: "isp", type: "router", name: "ISP", x: 250, y: 350, icon: "🔀" },
                { id: "dns", type: "server", name: "DNS Server", x: 400, y: 200, icon: "📖" },
                { id: "cdn", type: "server", name: "CDN", x: 550, y: 250, icon: "⚡" },
                { id: "webserver", type: "server", name: "Web Server", x: 700, y: 350, icon: "🌐" },
                { id: "database", type: "server", name: "Database", x: 550, y: 450, icon: "💾" }
            ],
            connections: [
                { source: "user", target: "isp", bandwidth: "100 Mbps", latency: 5 },
                { source: "isp", target: "dns", bandwidth: "10 Gbps", latency: 15 },
                { source: "isp", target: "cdn", bandwidth: "10 Gbps", latency: 20 },
                { source: "isp", target: "webserver", bandwidth: "10 Gbps", latency: 30 },
                { source: "cdn", target: "webserver", bandwidth: "10 Gbps", latency: 10 },
                { source: "webserver", target: "database", bandwidth: "1 Gbps", latency: 5 }
            ],
            info: {
                title: "The Internet - Network of Networks",
                content: `
                    <h4>What is the Internet?</h4>
                    <p>The Internet is a vast network connecting billions of computers worldwide. It uses standardized protocols (TCP/IP) to enable communication between any connected devices.</p>
                    
                    <h4>Key Components:</h4>
                    <ul>
                        <li><strong>ISPs:</strong> Internet Service Providers that connect you to the internet</li>
                        <li><strong>DNS Servers:</strong> Translate domain names to IP addresses</li>
                        <li><strong>Web Servers:</strong> Host websites and applications</li>
                        <li><strong>CDNs:</strong> Content Delivery Networks for faster content delivery</li>
                        <li><strong>Backbone:</strong> High-speed networks connecting major hubs</li>
                    </ul>

                    <h4>How Data Travels:</h4>
                    <ul>
                        <li>Your request goes to your ISP</li>
                        <li>DNS resolves the domain name</li>
                        <li>Request is routed through multiple networks</li>
                        <li>Server processes and sends response</li>
                        <li>Data may be cached at CDNs for speed</li>
                    </ul>

                    <h4>Internet Protocols:</h4>
                    <ul>
                        <li><strong>TCP/IP:</strong> Foundation protocols for data transmission</li>
                        <li><strong>HTTP/HTTPS:</strong> Web communication protocols</li>
                        <li><strong>DNS:</strong> Domain Name System</li>
                        <li><strong>FTP:</strong> File Transfer Protocol</li>
                    </ul>
                `
            },
            analogy: {
                title: "Internet is like a Global Postal System",
                content: `
                    <p><strong>Imagine a worldwide postal service:</strong></p>
                    <p>📬 Your <strong>device</strong> is your home address.</p>
                    <p>🏤 The <strong>ISP</strong> is like your local post office.</p>
                    <p>📖 <strong>DNS</strong> is like a phone book that converts names to addresses.</p>
                    <p>📦 <strong>Data packets</strong> are like letters and packages being sent.</p>
                    <p>✈️ Packets travel through <strong>multiple routes</strong> (routers) to reach destination.</p>
                    <p>🚚 <strong>CDNs</strong> are like regional distribution centers for faster delivery.</p>
                    <p>🌍 Anyone anywhere can send/receive, making it truly <strong>global</strong>!</p>
                `
            }
        },

        clientserver: {
            name: "Client-Server Model",
            icon: "🖥️",
            description: "A network architecture where clients request resources and services from centralized servers.",
            devices: [
                { id: "server", type: "server", name: "Central Server", x: 400, y: 250, icon: "🖥️" },
                { id: "client1", type: "computer", name: "Client 1", x: 200, y: 150, icon: "💻" },
                { id: "client2", type: "computer", name: "Client 2", x: 600, y: 150, icon: "💻" },
                { id: "client3", type: "laptop", name: "Client 3", x: 200, y: 400, icon: "💻" },
                { id: "client4", type: "mobile", name: "Client 4", x: 600, y: 400, icon: "📱" },
                { id: "database", type: "server", name: "Database", x: 400, y: 450, icon: "💾" }
            ],
            connections: [
                { source: "client1", target: "server", bandwidth: "100 Mbps", latency: 5 },
                { source: "client2", target: "server", bandwidth: "100 Mbps", latency: 5 },
                { source: "client3", target: "server", bandwidth: "100 Mbps", latency: 5 },
                { source: "client4", target: "server", bandwidth: "50 Mbps", latency: 10 },
                { source: "server", target: "database", bandwidth: "1 Gbps", latency: 2 }
            ],
            info: {
                title: "Client-Server Architecture",
                content: `
                    <h4>What is Client-Server?</h4>
                    <p>A network model where clients (user devices) request services and resources from powerful centralized servers that process and respond to these requests.</p>
                    
                    <h4>Components:</h4>
                    <ul>
                        <li><strong>Client:</strong> Initiates requests (web browsers, mobile apps)</li>
                        <li><strong>Server:</strong> Processes requests and sends responses</li>
                        <li><strong>Protocol:</strong> Rules for communication (HTTP, FTP, etc.)</li>
                        <li><strong>Middleware:</strong> Software connecting clients to servers</li>
                    </ul>

                    <h4>How It Works:</h4>
                    <ul>
                        <li>Client sends a request to the server</li>
                        <li>Server processes the request</li>
                        <li>Server accesses database if needed</li>
                        <li>Server sends response back to client</li>
                        <li>Client displays the result to user</li>
                    </ul>

                    <h4>Advantages:</h4>
                    <ul>
                        <li>Centralized data management</li>
                        <li>Better security control</li>
                        <li>Easy to backup and maintain</li>
                        <li>Scalable infrastructure</li>
                    </ul>

                    <h4>Disadvantages:</h4>
                    <ul>
                        <li>Single point of failure</li>
                        <li>Server can become bottleneck</li>
                        <li>Higher infrastructure costs</li>
                        <li>Requires constant maintenance</li>
                    </ul>
                `
            },
            analogy: {
                title: "Client-Server is like a Restaurant",
                content: `
                    <p><strong>Think of a restaurant service model:</strong></p>
                    <p>👥 <strong>Clients</strong> are like customers sitting at tables.</p>
                    <p>🧑‍🍳 The <strong>server</strong> is like the kitchen and chef preparing food.</p>
                    <p>📋 <strong>Requests</strong> are like menu orders placed by customers.</p>
                    <p>🍽️ <strong>Responses</strong> are like prepared meals delivered to tables.</p>
                    <p>📚 The <strong>database</strong> is like the recipe book and ingredient storage.</p>
                    <p>⏱️ Multiple customers can order, but the kitchen processes requests one at a time.</p>
                    <p>🔒 The kitchen is <strong>secure</strong> - only staff can access ingredients and recipes!</p>
                `
            }
        },

        p2p: {
            name: "Peer-to-Peer (P2P)",
            icon: "🔗",
            description: "A decentralized network where each node acts as both client and server, sharing resources directly.",
            devices: [
                { id: "peer1", type: "computer", name: "Peer 1", x: 250, y: 200, icon: "💻" },
                { id: "peer2", type: "computer", name: "Peer 2", x: 550, y: 200, icon: "💻" },
                { id: "peer3", type: "computer", name: "Peer 3", x: 400, y: 350, icon: "💻" },
                { id: "peer4", type: "laptop", name: "Peer 4", x: 200, y: 450, icon: "💻" },
                { id: "peer5", type: "laptop", name: "Peer 5", x: 600, y: 450, icon: "💻" }
            ],
            connections: [
                { source: "peer1", target: "peer2", bandwidth: "100 Mbps", latency: 5 },
                { source: "peer1", target: "peer3", bandwidth: "100 Mbps", latency: 5 },
                { source: "peer2", target: "peer3", bandwidth: "100 Mbps", latency: 5 },
                { source: "peer3", target: "peer4", bandwidth: "100 Mbps", latency: 5 },
                { source: "peer3", target: "peer5", bandwidth: "100 Mbps", latency: 5 },
                { source: "peer4", target: "peer5", bandwidth: "100 Mbps", latency: 5 },
                { source: "peer1", target: "peer4", bandwidth: "100 Mbps", latency: 8 },
                { source: "peer2", target: "peer5", bandwidth: "100 Mbps", latency: 8 }
            ],
            info: {
                title: "Peer-to-Peer Networks",
                content: `
                    <h4>What is P2P?</h4>
                    <p>A distributed network architecture where each participant (peer) acts as both a client and a server, sharing resources directly without a central authority.</p>
                    
                    <h4>Key Characteristics:</h4>
                    <ul>
                        <li><strong>Decentralization:</strong> No central server required</li>
                        <li><strong>Equal Peers:</strong> All nodes have equal status</li>
                        <li><strong>Resource Sharing:</strong> Direct sharing between peers</li>
                        <li><strong>Scalability:</strong> Network grows with more peers</li>
                    </ul>

                    <h4>Types of P2P:</h4>
                    <ul>
                        <li><strong>Unstructured:</strong> Random connections (Gnutella)</li>
                        <li><strong>Structured:</strong> Organized topology (BitTorrent DHT)</li>
                        <li><strong>Hybrid:</strong> Some central coordination (Skype)</li>
                    </ul>

                    <h4>Advantages:</h4>
                    <ul>
                        <li>No single point of failure</li>
                        <li>Reduced server costs</li>
                        <li>Better resource utilization</li>
                        <li>Increased privacy potential</li>
                    </ul>

                    <h4>Use Cases:</h4>
                    <ul>
                        <li>File sharing (BitTorrent)</li>
                        <li>Cryptocurrency networks (Bitcoin)</li>
                        <li>Video calls (WebRTC)</li>
                        <li>Content distribution</li>
                    </ul>
                `
            },
            analogy: {
                title: "P2P is like a Potluck Dinner",
                content: `
                    <p><strong>Imagine a community potluck dinner:</strong></p>
                    <p>👥 Each <strong>peer</strong> is like a guest who brings food to share.</p>
                    <p>🍲 <strong>Resources</strong> are like dishes each person brings.</p>
                    <p>🤝 Everyone <strong>shares directly</strong> with each other - no central kitchen.</p>
                    <p>📋 No single host controls everything - it's <strong>democratic</strong>!</p>
                    <p>➕ More people = more food variety (better with more peers).</p>
                    <p>🔄 You can get recipes from anyone and share your own.</p>
                    <p>🚫 If one person leaves, the party continues!</p>
                `
            }
        },

        mesh: {
            name: "Mesh Network",
            icon: "🕸️",
            description: "A network topology where nodes are interconnected, with multiple paths for data to travel between any two points.",
            devices: [
                { id: "node1", type: "router", name: "Node 1", x: 200, y: 200, icon: "📡" },
                { id: "node2", type: "router", name: "Node 2", x: 400, y: 150, icon: "📡" },
                { id: "node3", type: "router", name: "Node 3", x: 600, y: 200, icon: "📡" },
                { id: "node4", type: "router", name: "Node 4", x: 200, y: 400, icon: "📡" },
                { id: "node5", type: "router", name: "Node 5", x: 400, y: 450, icon: "📡" },
                { id: "node6", type: "router", name: "Node 6", x: 600, y: 400, icon: "📡" },
                { id: "device", type: "computer", name: "User Device", x: 400, y: 300, icon: "💻" }
            ],
            connections: [
                { source: "node1", target: "node2", bandwidth: "100 Mbps", latency: 2 },
                { source: "node2", target: "node3", bandwidth: "100 Mbps", latency: 2 },
                { source: "node3", target: "node6", bandwidth: "100 Mbps", latency: 2 },
                { source: "node6", target: "node5", bandwidth: "100 Mbps", latency: 2 },
                { source: "node5", target: "node4", bandwidth: "100 Mbps", latency: 2 },
                { source: "node4", target: "node1", bandwidth: "100 Mbps", latency: 2 },
                { source: "node1", target: "node4", bandwidth: "100 Mbps", latency: 3 },
                { source: "node2", target: "node5", bandwidth: "100 Mbps", latency: 3 },
                { source: "node3", target: "node4", bandwidth: "100 Mbps", latency: 3 },
                { source: "device", target: "node1", bandwidth: "300 Mbps", latency: 1 },
                { source: "device", target: "node2", bandwidth: "300 Mbps", latency: 1 },
                { source: "device", target: "node5", bandwidth: "300 Mbps", latency: 1 }
            ],
            info: {
                title: "Mesh Network Topology",
                content: `
                    <h4>What is a Mesh Network?</h4>
                    <p>A network topology where nodes connect to multiple other nodes, creating redundant pathways for data transmission. This provides high reliability and self-healing capabilities.</p>
                    
                    <h4>Types of Mesh:</h4>
                    <ul>
                        <li><strong>Full Mesh:</strong> Every node connects to every other node</li>
                        <li><strong>Partial Mesh:</strong> Some nodes have multiple connections</li>
                        <li><strong>Wireless Mesh:</strong> Uses wireless connections between nodes</li>
                    </ul>

                    <h4>How It Works:</h4>
                    <ul>
                        <li>Data can take multiple routes to destination</li>
                        <li>If one path fails, data reroutes automatically</li>
                        <li>Nodes can relay data for other nodes</li>
                        <li>Dynamic routing based on network conditions</li>
                    </ul>

                    <h4>Advantages:</h4>
                    <ul>
                        <li>High reliability and redundancy</li>
                        <li>Self-healing capabilities</li>
                        <li>No single point of failure</li>
                        <li>Can extend coverage easily</li>
                        <li>Better load distribution</li>
                    </ul>

                    <h4>Use Cases:</h4>
                    <ul>
                        <li>Smart home networks (Google Wifi, Eero)</li>
                        <li>IoT sensor networks</li>
                        <li>Military communications</li>
                        <li>Emergency response systems</li>
                        <li>City-wide WiFi networks</li>
                    </ul>
                `
            },
            analogy: {
                title: "Mesh is like a Spider Web",
                content: `
                    <p><strong>Think of a spider's web:</strong></p>
                    <p>🕸️ The <strong>mesh network</strong> is like the intricate web structure.</p>
                    <p>📍 Each <strong>node</strong> is like a connection point in the web.</p>
                    <p>🧵 <strong>Multiple paths</strong> exist between any two points on the web.</p>
                    <p>✂️ If one strand breaks, the web <strong>still functions</strong> using other paths.</p>
                    <p>🕷️ A vibration (data) can travel through <strong>many routes</strong> to reach destination.</p>
                    <p>💪 The more connections, the <strong>stronger and more reliable</strong> the network!</p>
                    <p>🔄 The web <strong>self-heals</strong> by finding alternative routes automatically.</p>
                `
            }
        }
    },

    // Protocol Information
    protocols: {
        tcp: {
            name: "TCP/IP Protocol Suite",
            description: "The foundational protocol suite of the Internet, providing reliable, ordered, and error-checked delivery of data.",
            layers: [
                { name: "Application Layer", protocols: ["HTTP", "FTP", "SMTP", "DNS"], color: "#3b82f6" },
                { name: "Transport Layer", protocols: ["TCP", "UDP"], color: "#8b5cf6" },
                { name: "Internet Layer", protocols: ["IP", "ICMP", "ARP"], color: "#10b981" },
                { name: "Network Access Layer", protocols: ["Ethernet", "WiFi", "PPP"], color: "#f59e0b" }
            ],
            info: `
                <h4>TCP/IP Protocol Suite</h4>
                <p>The backbone of Internet communication, TCP/IP is a set of protocols that define how data is transmitted across networks.</p>
                
                <h4>TCP (Transmission Control Protocol):</h4>
                <ul>
                    <li>Connection-oriented protocol</li>
                    <li>Ensures reliable data delivery</li>
                    <li>Provides error checking and correction</li>
                    <li>Maintains packet order</li>
                    <li>Uses three-way handshake to establish connections</li>
                </ul>

                <h4>IP (Internet Protocol):</h4>
                <ul>
                    <li>Handles addressing and routing</li>
                    <li>Breaks data into packets</li>
                    <li>Each packet can take different routes</li>
                    <li>IPv4 uses 32-bit addresses</li>
                    <li>IPv6 uses 128-bit addresses</li>
                </ul>

                <h4>Three-Way Handshake:</h4>
                <ul>
                    <li>SYN: Client initiates connection</li>
                    <li>SYN-ACK: Server acknowledges</li>
                    <li>ACK: Client confirms, connection established</li>
                </ul>
            `
        },

        http: {
            name: "HTTP/HTTPS",
            description: "Hypertext Transfer Protocol - the foundation of data communication on the World Wide Web.",
            info: `
                <h4>HTTP (Hypertext Transfer Protocol)</h4>
                <p>HTTP is the protocol used for transmitting web pages and other data on the World Wide Web.</p>
                
                <h4>How HTTP Works:</h4>
                <ul>
                    <li>Client sends HTTP request to server</li>
                    <li>Request includes method (GET, POST, etc.)</li>
                    <li>Server processes request</li>
                    <li>Server sends HTTP response with status code</li>
                    <li>Response includes requested data (HTML, images, etc.)</li>
                </ul>

                <h4>HTTP Methods:</h4>
                <ul>
                    <li><strong>GET:</strong> Retrieve data from server</li>
                    <li><strong>POST:</strong> Send data to server</li>
                    <li><strong>PUT:</strong> Update existing data</li>
                    <li><strong>DELETE:</strong> Remove data</li>
                    <li><strong>HEAD:</strong> Get headers only</li>
                </ul>

                <h4>HTTPS (HTTP Secure):</h4>
                <ul>
                    <li>Encrypted version of HTTP</li>
                    <li>Uses SSL/TLS encryption</li>
                    <li>Protects data from eavesdropping</li>
                    <li>Verifies website authenticity</li>
                    <li>Essential for sensitive data (passwords, payments)</li>
                </ul>

                <h4>Status Codes:</h4>
                <ul>
                    <li><strong>200:</strong> OK - Request successful</li>
                    <li><strong>404:</strong> Not Found - Resource doesn't exist</li>
                    <li><strong>500:</strong> Internal Server Error</li>
                    <li><strong>301:</strong> Moved Permanently (redirect)</li>
                </ul>
            `
        },

        dns: {
            name: "DNS (Domain Name System)",
            description: "The Internet's phonebook, translating human-readable domain names into IP addresses.",
            info: `
                <h4>DNS (Domain Name System)</h4>
                <p>DNS is a hierarchical naming system that converts domain names (like google.com) into IP addresses (like 142.250.185.46).</p>
                
                <h4>How DNS Works:</h4>
                <ul>
                    <li>User types domain name in browser</li>
                    <li>Browser checks local DNS cache</li>
                    <li>If not cached, query goes to DNS resolver</li>
                    <li>Resolver queries root servers</li>
                    <li>Root servers direct to TLD servers (.com, .org, etc.)</li>
                    <li>TLD servers direct to authoritative name servers</li>
                    <li>Authoritative servers return IP address</li>
                    <li>IP address is cached for future use</li>
                </ul>

                <h4>DNS Record Types:</h4>
                <ul>
                    <li><strong>A Record:</strong> Maps domain to IPv4 address</li>
                    <li><strong>AAAA Record:</strong> Maps domain to IPv6 address</li>
                    <li><strong>CNAME:</strong> Creates alias for domain</li>
                    <li><strong>MX Record:</strong> Specifies mail servers</li>
                    <li><strong>TXT Record:</strong> Stores text information</li>
                </ul>

                <h4>DNS Hierarchy:</h4>
                <ul>
                    <li><strong>Root Level:</strong> Top of DNS hierarchy</li>
                    <li><strong>TLD (Top-Level Domain):</strong> .com, .org, .net, etc.</li>
                    <li><strong>Second-Level Domain:</strong> google in google.com</li>
                    <li><strong>Subdomain:</strong> www in www.google.com</li>
                </ul>
            `
        },

        osi: {
            name: "OSI Model",
            description: "A conceptual framework with 7 layers that standardizes network communication functions.",
            layers: [
                { number: 7, name: "Application", description: "End-user applications", examples: "HTTP, FTP, SMTP", color: "#ef4444" },
                { number: 6, name: "Presentation", description: "Data formatting, encryption", examples: "SSL, JPEG, MPEG", color: "#f97316" },
                { number: 5, name: "Session", description: "Manages connections", examples: "NetBIOS, RPC", color: "#f59e0b" },
                { number: 4, name: "Transport", description: "Reliable data transfer", examples: "TCP, UDP", color: "#10b981" },
                { number: 3, name: "Network", description: "Routing and addressing", examples: "IP, ICMP, IPX", color: "#06b6d4" },
                { number: 2, name: "Data Link", description: "Frame transmission", examples: "Ethernet, PPP", color: "#3b82f6" },
                { number: 1, name: "Physical", description: "Physical hardware", examples: "Cables, hubs, signals", color: "#8b5cf6" }
            ],
            info: `
                <h4>OSI Model (Open Systems Interconnection)</h4>
                <p>A 7-layer conceptual framework that standardizes how different systems communicate over a network.</p>
                
                <h4>The 7 Layers (Top to Bottom):</h4>
                <ul>
                    <li><strong>Layer 7 - Application:</strong> User interfaces and applications</li>
                    <li><strong>Layer 6 - Presentation:</strong> Data format translation and encryption</li>
                    <li><strong>Layer 5 - Session:</strong> Establishes and manages connections</li>
                    <li><strong>Layer 4 - Transport:</strong> Reliable data transfer (TCP/UDP)</li>
                    <li><strong>Layer 3 - Network:</strong> Routing and logical addressing (IP)</li>
                    <li><strong>Layer 2 - Data Link:</strong> Physical addressing (MAC)</li>
                    <li><strong>Layer 1 - Physical:</strong> Physical transmission medium</li>
                </ul>

                <h4>Mnemonic:</h4>
                <p><strong>"All People Seem To Need Data Processing"</strong></p>
                <p>Application, Presentation, Session, Transport, Network, Data Link, Physical</p>

                <h4>How Data Flows:</h4>
                <ul>
                    <li><strong>Sending:</strong> Data moves DOWN from Layer 7 to Layer 1</li>
                    <li>Each layer adds its own header (encapsulation)</li>
                    <li><strong>Receiving:</strong> Data moves UP from Layer 1 to Layer 7</li>
                    <li>Each layer removes its header (decapsulation)</li>
                </ul>
            `
        }
    },

    // Device Information
    deviceTypes: {
        computer: {
            name: "Desktop Computer",
            description: "A personal computer designed for regular use at a single location.",
            specifications: {
                "Network Interface": "Ethernet (1 Gbps), WiFi",
                "Typical Use": "Web browsing, office work, development",
                "IP Assignment": "DHCP or Static",
                "Protocols": "TCP/IP, HTTP, FTP, SSH"
            }
        },
        laptop: {
            name: "Laptop Computer",
            description: "A portable personal computer with integrated battery.",
            specifications: {
                "Network Interface": "WiFi (802.11ac/ax), Optional Ethernet",
                "Typical Use": "Mobile computing, presentations",
                "IP Assignment": "DHCP",
                "Protocols": "TCP/IP, HTTP, VPN"
            }
        },
        mobile: {
            name: "Smartphone/Tablet",
            description: "Mobile device with cellular and WiFi connectivity.",
            specifications: {
                "Network Interface": "WiFi, 4G/5G Cellular",
                "Typical Use": "Communication, apps, browsing",
                "IP Assignment": "DHCP (WiFi), Carrier-assigned (Cellular)",
                "Protocols": "TCP/IP, HTTP/HTTPS"
            }
        },
        router: {
            name: "Network Router",
            description: "Device that forwards data packets between networks.",
            specifications: {
                "Function": "Packet routing, NAT, DHCP server",
                "Interfaces": "WAN port, LAN ports, WiFi",
                "Typical Speed": "100 Mbps - 10 Gbps",
                "Features": "Firewall, QoS, Port Forwarding"
            }
        },
        server: {
            name: "Server",
            description: "Powerful computer that provides services to other devices.",
            specifications: {
                "Function": "Web hosting, database, file storage",
                "Network Interface": "Multiple Gigabit+ Ethernet",
                "Operating System": "Linux, Windows Server",
                "Availability": "24/7 uptime, redundancy"
            }
        },
        printer: {
            name: "Network Printer",
            description: "Printer accessible to multiple devices on the network.",
            specifications: {
                "Network Interface": "Ethernet, WiFi",
                "Protocols": "IPP, LPR, SMB",
                "IP Assignment": "Static recommended",
                "Features": "Print queue, shared access"
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NetworkData;
}