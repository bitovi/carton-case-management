# Carton Case Management

Carton Case Management is a web application that helps teams track, manage, and resolve cases — think of it like a shared to-do list where each item is a "case" that can be assigned to someone, given a status, and updated over time.

---

## What Does This App Do?

- **Create cases** — Log a new issue or task that needs to be handled
- **Assign cases** — Assign a case to a specific team member
- **Track status** — See which cases are open, in progress, or closed
- **View & update cases** — Click into any case to see its details or make changes

---

## Who Am I Logged In As?

When you open the app, you're automatically signed in as **Alex Morgan** (alex.morgan@carton.com). No password needed — it's set up this way for testing and development.

If you'd like to see the app from another user's perspective, let a developer know and they can switch the active user for you.

---

## How to Open the App

A developer on your team will need to start the application for you. Once it's running, just open your web browser and go to:

> **http://localhost:5173**

That's it! You'll see the app and can start using it right away.

---

## Getting Started (For Developers)

> This section is for the person setting up the app on their computer.

### Easiest Option: Open in VS Code with Docker

1. Make sure [VS Code](https://code.visualstudio.com/) and [Docker Desktop](https://www.docker.com/products/docker-desktop/) are installed
2. Open this project folder in VS Code
3. When a popup appears asking "Reopen in Container", click it
4. Wait a minute or two while it sets everything up automatically
5. Open your browser and go to **http://localhost:5173**

### Manual Option

If you prefer not to use Docker:

1. Open a terminal and run: `npm install`
2. Then run: `npm run setup`
3. Then run: `npm run dev`
4. Open your browser and go to **http://localhost:5173**

---

## Need Help?

If something isn't working or you're not sure what to do, reach out to your development team. Common things they can help with:

- Starting or restarting the app
- Switching which user you're logged in as
- Resetting or reloading test data

---

## License

MIT
