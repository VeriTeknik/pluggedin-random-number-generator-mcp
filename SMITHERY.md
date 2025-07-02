# Smithery Deployment Guide

This guide explains how to deploy the Plugged.in Random Number Generator MCP Server to [Smithery](https://smithery.ai/).

## Prerequisites

- GitHub account
- Smithery account (sign up at [smithery.ai](https://smithery.ai/))
- This repository forked to your GitHub account

## Deployment Steps

1. **Fork the Repository**
   - Visit https://github.com/VeriTeknik/pluggedin-random-number-generator-mcp
   - Click the "Fork" button to create your own copy

2. **Connect GitHub to Smithery**
   - Log in to your Smithery account
   - Navigate to Settings → Integrations
   - Connect your GitHub account
   - Authorize Smithery to access your repositories

3. **Deploy the Server**
   - Go to the Deployments tab in Smithery
   - Select your forked repository
   - Click "Deploy"
   - Smithery will automatically detect the `smithery.yaml` configuration

4. **Configure Your MCP Client**
   - Once deployed, Smithery will provide an endpoint URL
   - Add this to your MCP client configuration:

   ```json
   {
     "mcpServers": {
       "random-generator": {
         "url": "https://your-deployment.smithery.ai/",
         "transport": "http"
       }
     }
   }
   ```

## Configuration

The `smithery.yaml` file contains:

```yaml
runtime: "docker"
dockerfile: "Dockerfile.smithery"

metadata:
  name: "pluggedin-random-number-generator"
  description: "Cryptographically secure random number generator MCP server"
  # ... additional metadata
```

The project uses a custom Dockerfile (`Dockerfile.smithery`) that:
- Builds the TypeScript project
- Creates a minimal runtime image
- Runs the compiled JavaScript directly

## Supported Features

All 7 random generation tools are available through Smithery:
- `generate_random_integer`
- `generate_random_float`
- `generate_random_bytes`
- `generate_uuid`
- `generate_random_string`
- `generate_random_choice`
- `generate_random_boolean`

## Monitoring

Smithery provides:
- Automatic scaling
- Request logs
- Performance metrics
- Error tracking

## Updating Your Deployment

To update your deployed server:

1. Push changes to your forked repository
2. In Smithery, navigate to your deployment
3. Click "Redeploy" to update to the latest version

## Troubleshooting

If deployment fails:
- Check that `smithery.yaml` exists in the repository root
- Ensure all TypeScript files compile without errors
- Verify that `npm run build` completes successfully
- Check Smithery deployment logs for specific errors

## Support

- Smithery Documentation: https://smithery.ai/docs
- MCP Server Issues: https://github.com/VeriTeknik/pluggedin-random-number-generator-mcp/issues
- Smithery Support: support@smithery.ai