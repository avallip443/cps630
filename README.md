# ThinkR - CPS630 A1

## Overview
This web application is a flexible workspace designed to help individuals organize files, notes, and tasks in a single platform. Users can create pages from default templates to manage projects and information efficiently. In the future, the app could be extended to allow fully customizable pages and advanced organizational features, giving users complete control over their workflow.

  
Built using: Node.js, Express, HTML, CSS, JavaScript JSON, REST APIs <br>
Inspired by: Notion 
## Documentation

### Installation & Setup

1. **Clone repository**
```
git clone https://github.com/avallip443/cps630.git
```

2. **Install dependencies**
```
npm install
```

3. **Start the Server:**
```
node server.js
```

The server will run on `http://localhost:1234`

### Using The App
- to create a new file from a selected template, click on the blue "+ new template" and select the desired format
- to navigate through created user files, click on "recent" button to look at all files from most recently created to oldest
- to delete a file, click on the red "delete" button on the right bottom corner of each file on main page
#### Routes
- / --> main page
- /project-plan --> project plan template
- /meeting-notes --> meeting notes template
- bug-report --> bug report template
#### API
- GET /api/created-templates --> returns all files created by user
- GET /api/default-templates --> returns all default templates
- DELETE /api/templates/:id --> deletes user created file
  
## Reflection
For this assignment, we created and submitted the code for our web application, along with a demo video showcasing our organizational platform.
Some successes we experienced during this assignment include successfully creating the different APIs and seeing the overall idea of the web application come to life exactly as we envisioned.
One difficulty we encountered was connecting and integrating the work completed by each team member, ensuring that all parts functioned together smoothly.
