# oxydien.dev - Backend

This repository contains the backend code for oxydien.dev, my personal website. It's built using Express.js and provides a simple API for my site, returning JSON data.

## Features

- Provides API endpoints for various functionalities on oxydien.dev.
- Returns JSON data to the frontend for dynamic content rendering.
- Built with JavaScript and Express.js.
- Integrates with the YouTube API to fetch data about channels.
- Image processor (slow).
- [Work in Progress] Integrates with the GitHub API to fetch data about GitHub account, including repositories, projects, and gists.
- [Work in Progress] Includes a Wiki section for lore.

## Routes

For detailed information on the available API endpoints and how to use them, please refer to the [routeList](base\keys\routes.js).

## Contributing

If you'd like to contribute to this project, feel free to open an issue or submit a pull request. Your contributions are welcome!

## Installation

1. Clone this repository.
2. Install the required dependencies using npm:

```bash
npm i
```

3. Start the server:

```bash
npm start
```

The server will run on port 3001 by default. You can change the port in the [configuration](base\keys\essential.js) if needed.

**[Work In Progress]** You can change the backend url by navigating to [oxydien.dev](oxydien.dev) (or your frontend) and going to the settings. Once there, click on the database icon, and you can set the backend URL to `localhost:[port]`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
