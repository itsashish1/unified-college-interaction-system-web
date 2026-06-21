# Graph Report - .  (2026-05-15)

## Corpus Check
- Corpus is ~34,592 words - fits in a single context window. You may not need a graph.

## Summary
- 231 nodes · 353 edges · 15 communities (14 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_React Frontend Components|React Frontend Components]]
- [[_COMMUNITY_Server Dependencies|Server Dependencies]]
- [[_COMMUNITY_Client Dependencies|Client Dependencies]]
- [[_COMMUNITY_Announcement & Faculty CRUD|Announcement & Faculty CRUD]]
- [[_COMMUNITY_Root Package Config|Root Package Config]]
- [[_COMMUNITY_Data Models & Search|Data Models & Search]]
- [[_COMMUNITY_Auth & User Routes|Auth & User Routes]]
- [[_COMMUNITY_Support Ticket System|Support Ticket System]]
- [[_COMMUNITY_Event Management|Event Management]]
- [[_COMMUNITY_Club Management|Club Management]]
- [[_COMMUNITY_Forum & Posts|Forum & Posts]]
- [[_COMMUNITY_Server Deployment Config|Server Deployment Config]]
- [[_COMMUNITY_Client Deployment Config|Client Deployment Config]]

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 27 edges
2. `dependencies` - 17 edges
3. `devDependencies` - 10 edges
4. `protect()` - 9 edges
5. `authorize()` - 7 edges
6. `dependencies` - 7 edges
7. `scripts` - 5 edges
8. `scripts` - 4 edges
9. `repository` - 3 edges
10. `scripts` - 3 edges

## Surprising Connections (you probably didn't know these)
- `EventDetail()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/pages/EventDetail.jsx → client/src/context/AuthContext.jsx
- `Support()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/pages/Support.jsx → client/src/context/AuthContext.jsx
- `Clubs()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/pages/Clubs.jsx → client/src/context/AuthContext.jsx
- `ClubDetail()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/pages/ClubDetail.jsx → client/src/context/AuthContext.jsx
- `Register()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/pages/Register.jsx → client/src/context/AuthContext.jsx

## Communities (15 total, 1 thin omitted)

### Community 0 - "React Frontend Components"
Cohesion: 0.09
Nodes (18): api, token, Navbar(), ProtectedRoute(), AuthContext, AuthProvider(), useAuth(), Announcements() (+10 more)

### Community 1 - "Server Dependencies"
Cohesion: 0.07
Nodes (27): dependencies, bcryptjs, compression, cors, dotenv, express, express-mongo-sanitize, express-rate-limit (+19 more)

### Community 2 - "Client Dependencies"
Cohesion: 0.07
Nodes (26): dependencies, axios, lucide-react, react, react-dom, react-hot-toast, react-router-dom, devDependencies (+18 more)

### Community 3 - "Announcement & Faculty CRUD"
Cohesion: 0.14
Nodes (17): createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), createFaculty(), deleteFaculty(), getFaculty() (+9 more)

### Community 4 - "Root Package Config"
Cohesion: 0.09
Nodes (21): author, bugs, url, dependencies, playwright, description, directories, doc (+13 more)

### Community 5 - "Data Models & Search"
Cohesion: 0.13
Nodes (8): globalSearch(), announcementSchema, clubSchema, eventSchema, facultySchema, postSchema, replySchema, router

### Community 6 - "Auth & User Routes"
Cohesion: 0.2
Nodes (12): generateToken(), getMe(), login(), register(), router, apiLimiter, app, clientBuildPath (+4 more)

### Community 7 - "Support Ticket System"
Cohesion: 0.27
Nodes (8): createTicket(), getTicket(), getTickets(), replyToTicket(), updateTicketStatus(), replySchema, supportTicketSchema, router

### Community 8 - "Event Management"
Cohesion: 0.36
Nodes (8): createEvent(), deleteEvent(), getEvent(), getEvents(), registerForEvent(), unregisterFromEvent(), updateEvent(), router

### Community 9 - "Club Management"
Cohesion: 0.36
Nodes (8): createClub(), deleteClub(), getClub(), getClubs(), joinClub(), leaveClub(), updateClub(), router

### Community 10 - "Forum & Posts"
Cohesion: 0.39
Nodes (7): addReply(), createPost(), deletePost(), getPost(), getPosts(), upvotePost(), router

### Community 11 - "Server Deployment Config"
Cohesion: 0.5
Nodes (3): builds, routes, version

## Knowledge Gaps
- **93 isolated node(s):** `name`, `version`, `description`, `main`, `doc` (+88 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `protect()` connect `Announcement & Faculty CRUD` to `Auth & User Routes`, `Support Ticket System`, `Event Management`, `Club Management`, `Forum & Posts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _93 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React Frontend Components` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Server Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Client Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Announcement & Faculty CRUD` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._
- **Should `Root Package Config` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._