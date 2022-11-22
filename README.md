# vprikol-ts

Wrapper for Vprikol API with types, written in TypeScript.

## 📦 Installation

```bash
npm i vprikol-ts
```

or

```bash
yarn add vprikol-ts
```

## 📚 Example

```typescript
import { VprikolAPI } from '../src';

// Create an instance of the API
const api = new VprikolAPI({ token: 'your_token' });

// Get a list of players in the fraction with ID 1 on the server with ID 1
api.members(1, 1).then(data => {
    // If the request was successful
    if (data.success === true) {
        // Print the list of players
        console.log(`
            List of players in the fraction '${data.data.fractionLabel}' on the server '${data.data.server}':
            ${Object.entries(data.data.players).map(([username, player]) => `${username} - ${player.rankLabel}`).join('\n')}
        `);
    } else {
        // Print the error message
        console.error(data.error.message);
    }
});

// You can also use async/await
```

## API

You can get your token here: [Form](https://vprikol.dev/api/get_token)

You can find the full documentation here: [Swagger UI](https://api.vprikol.dev/docs)

## License

This project is licensed under the [MIT License](LICENSE.md).