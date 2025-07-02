# Contributing to Plugged.in Random Number Generator MCP

We welcome contributions to the Plugged.in Random Number Generator MCP! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pluggedin-random-number-generator-mcp.git
   cd pluggedin-random-number-generator-mcp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development Process

1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure the code builds:
   ```bash
   npm run build
   ```

3. Run the tests to ensure everything works:
   ```bash
   node test.js
   ```

4. Commit your changes with a clear message:
   ```bash
   git commit -m "Add: brief description of changes"
   ```

## Code Standards

- Use TypeScript with strict mode enabled
- Follow the existing code style and patterns
- Ensure all random generation uses cryptographically secure methods
- Add appropriate error handling and validation
- Document any new tools or significant changes

## Testing

- All new features must include tests
- Tests should cover both success and error cases
- Run `node test.js` before submitting PRs
- Ensure all existing tests pass

## Submitting Changes

1. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request on GitHub
3. Describe your changes clearly in the PR description
4. Link any related issues

## Reporting Issues

- Use the GitHub issue tracker
- Include clear reproduction steps
- Provide system information (Node.js version, OS)
- Include any relevant error messages

## Security

- Never commit secrets or API keys
- Report security vulnerabilities privately to the maintainers
- Use only cryptographically secure random generation

## Questions?

Feel free to open an issue for any questions about contributing!