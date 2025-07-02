# Plugged.in Random Number Generator MCP Server

A state-of-the-art cryptographically secure random number generator server implementing the Model Context Protocol (MCP). This server provides advanced random number generation capabilities for AI applications, LLMs, and other systems requiring high-quality randomness.

## 🚀 Features

- **Cryptographically Secure**: Uses Node.js built-in `crypto` module for cryptographically secure pseudorandom number generation (CSPRNG)
- **Multiple Data Types**: Generate integers, floats, bytes, UUIDs, strings, booleans, and random choices
- **Flexible Configuration**: Customizable ranges, counts, encodings, and character sets
- **MCP Compliant**: Full compatibility with Model Context Protocol specification
- **Type Safety**: Written in TypeScript with comprehensive type definitions
- **Error Handling**: Robust input validation and error reporting
- **Performance Optimized**: Efficient algorithms suitable for high-throughput applications

## 📦 Installation

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

### Install from npm (Coming Soon)

```bash
npm install -g pluggedin-random-number-generator-mcp
```

### Build from Source

```bash
git clone https://github.com/VeriTeknik/pluggedin-random-number-generator-mcp.git
cd pluggedin-random-number-generator-mcp
npm install
npm run build
```

## 🛠️ Usage

### Running the Server

The server communicates via stdio (standard input/output) following the MCP protocol:

```bash
# Using the built version
node dist/index.js

# Using development mode
npm run dev
```

### Integration with MCP Clients

Add the server to your MCP client configuration. For Claude Desktop, add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "random-generator": {
      "command": "node",
      "args": ["/path/to/pluggedin-random-number-generator-mcp/dist/index.js"]
    }
  }
}
```

## 🔧 Available Tools

### 1. Generate Random Integers

Generate cryptographically secure random integers within a specified range.

**Parameters:**
- `min` (integer, optional): Minimum value (inclusive), default: 0
- `max` (integer, optional): Maximum value (inclusive), default: 100  
- `count` (integer, optional): Number of integers to generate, default: 1, max: 1000

**Example:**
```json
{
  "name": "generate_random_integer",
  "arguments": {
    "min": 1,
    "max": 100,
    "count": 5
  }
}
```

### 2. Generate Random Floats

Generate cryptographically secure random floating-point numbers.

**Parameters:**
- `min` (number, optional): Minimum value (inclusive), default: 0.0
- `max` (number, optional): Maximum value (exclusive), default: 1.0
- `count` (integer, optional): Number of floats to generate, default: 1, max: 1000
- `precision` (integer, optional): Decimal places to round to, default: 6, max: 15

**Example:**
```json
{
  "name": "generate_random_float", 
  "arguments": {
    "min": 0.0,
    "max": 1.0,
    "count": 3,
    "precision": 4
  }
}
```

### 3. Generate Random Bytes

Generate cryptographically secure random bytes in various encodings.

**Parameters:**
- `length` (integer, optional): Number of bytes to generate, default: 32, max: 1024
- `encoding` (string, optional): Output encoding ("hex", "base64", "binary"), default: "hex"

**Example:**
```json
{
  "name": "generate_random_bytes",
  "arguments": {
    "length": 32,
    "encoding": "hex"
  }
}
```

### 4. Generate UUIDs

Generate cryptographically secure UUID version 4 identifiers.

**Parameters:**
- `count` (integer, optional): Number of UUIDs to generate, default: 1, max: 100
- `format` (string, optional): UUID format ("standard", "compact"), default: "standard"

**Example:**
```json
{
  "name": "generate_uuid",
  "arguments": {
    "count": 3,
    "format": "standard"
  }
}
```

### 5. Generate Random Strings

Generate cryptographically secure random strings with customizable character sets.

**Parameters:**
- `length` (integer, optional): String length, default: 16, max: 256
- `charset` (string, optional): Character set ("alphanumeric", "alphabetic", "numeric", "hex", "base64", "ascii_printable"), default: "alphanumeric"
- `count` (integer, optional): Number of strings to generate, default: 1, max: 100

**Example:**
```json
{
  "name": "generate_random_string",
  "arguments": {
    "length": 12,
    "charset": "alphanumeric",
    "count": 2
  }
}
```

### 6. Generate Random Choices

Randomly select items from a provided list using cryptographically secure randomness.

**Parameters:**
- `choices` (array, required): Array of string items to choose from
- `count` (integer, optional): Number of items to select, default: 1
- `allow_duplicates` (boolean, optional): Whether to allow duplicate selections, default: true

**Example:**
```json
{
  "name": "generate_random_choice",
  "arguments": {
    "choices": ["apple", "banana", "cherry", "date"],
    "count": 2,
    "allow_duplicates": false
  }
}
```

### 7. Generate Random Booleans

Generate cryptographically secure random boolean values with configurable probability.

**Parameters:**
- `count` (integer, optional): Number of booleans to generate, default: 1, max: 1000
- `probability` (number, optional): Probability of true (0.0 to 1.0), default: 0.5

**Example:**
```json
{
  "name": "generate_random_boolean",
  "arguments": {
    "count": 10,
    "probability": 0.7
  }
}
```

## 🔒 Security Features

This server implements several security best practices:

- **Cryptographically Secure Randomness**: All random number generation uses Node.js `crypto` module functions (`randomBytes`, `randomInt`, `randomUUID`) which provide cryptographically secure pseudorandom numbers suitable for security-sensitive applications.

- **Input Validation**: Comprehensive validation of all input parameters to prevent injection attacks and ensure data integrity.

- **Rate Limiting**: Built-in limits on generation counts to prevent resource exhaustion attacks.

- **Error Handling**: Secure error messages that don't leak sensitive information about the system state.

## 🧪 Testing

The server includes a comprehensive test suite that validates all functionality:

```bash
# Run the test suite
node test.js
```

The test suite covers:
- Tool discovery and listing
- All random generation functions
- Input validation and error handling
- Output format verification
- Statistical properties validation

## 📊 Performance

The server is optimized for performance while maintaining security:

- **Efficient Algorithms**: Uses optimized native crypto functions
- **Memory Management**: Minimal memory footprint with efficient buffer handling
- **Concurrent Requests**: Thread-safe design supporting multiple simultaneous requests
- **Scalability**: Suitable for high-throughput applications

## 🔧 Development

### Project Structure

```
pluggedin-random-number-generator-mcp/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript output
├── test.js              # Comprehensive test suite
├── package.json         # Project configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # This documentation
```

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow TypeScript best practices
2. Maintain comprehensive test coverage
3. Update documentation for new features
4. Ensure all tests pass before submitting
5. Follow semantic versioning for releases

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/) - The official MCP specification
- [Plugged.in](https://plugged.in/) - MCP server management and discovery platform
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk) - Official TypeScript SDK for MCP

## 📞 Support

For support, questions, or feature requests:

- Open an issue on [GitHub](https://github.com/VeriTeknik/pluggedin-random-number-generator-mcp/issues)
- Visit the [Plugged.in platform](https://plugged.in/) for MCP server management
- Check the [MCP documentation](https://modelcontextprotocol.io/docs) for protocol details

