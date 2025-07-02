#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const crypto_1 = require("crypto");
/**
 * State-of-the-art Random Number Generator MCP Server
 *
 * This server provides cryptographically secure random number generation
 * capabilities through the Model Context Protocol (MCP).
 */
class RandomNumberGeneratorServer {
    server;
    constructor() {
        this.server = new index_js_1.Server({
            name: "pluggedin-random-number-generator-mcp",
            version: "1.0.0",
        }, {
            capabilities: {
                tools: {},
                prompts: {},
            },
        });
        this.setupToolHandlers();
        this.setupPromptHandlers();
        this.setupErrorHandling();
    }
    setupToolHandlers() {
        // List available tools
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: "generate_random_integer",
                        description: "Generate cryptographically secure random integers within a specified range",
                        inputSchema: {
                            type: "object",
                            properties: {
                                min: {
                                    type: "integer",
                                    description: "Minimum value (inclusive)",
                                    default: 0,
                                },
                                max: {
                                    type: "integer",
                                    description: "Maximum value (inclusive)",
                                    default: 100,
                                },
                                count: {
                                    type: "integer",
                                    description: "Number of random integers to generate",
                                    default: 1,
                                    minimum: 1,
                                    maximum: 1000,
                                },
                            },
                            required: [],
                        },
                    },
                    {
                        name: "generate_random_float",
                        description: "Generate cryptographically secure random floating-point numbers",
                        inputSchema: {
                            type: "object",
                            properties: {
                                min: {
                                    type: "number",
                                    description: "Minimum value (inclusive)",
                                    default: 0.0,
                                },
                                max: {
                                    type: "number",
                                    description: "Maximum value (exclusive)",
                                    default: 1.0,
                                },
                                count: {
                                    type: "integer",
                                    description: "Number of random floats to generate",
                                    default: 1,
                                    minimum: 1,
                                    maximum: 1000,
                                },
                                precision: {
                                    type: "integer",
                                    description: "Number of decimal places to round to",
                                    default: 6,
                                    minimum: 1,
                                    maximum: 15,
                                },
                            },
                            required: [],
                        },
                    },
                    {
                        name: "generate_random_bytes",
                        description: "Generate cryptographically secure random bytes",
                        inputSchema: {
                            type: "object",
                            properties: {
                                length: {
                                    type: "integer",
                                    description: "Number of random bytes to generate",
                                    default: 32,
                                    minimum: 1,
                                    maximum: 1024,
                                },
                                encoding: {
                                    type: "string",
                                    description: "Output encoding format",
                                    enum: ["hex", "base64", "binary"],
                                    default: "hex",
                                },
                            },
                            required: [],
                        },
                    },
                    {
                        name: "generate_uuid",
                        description: "Generate a cryptographically secure UUID (v4)",
                        inputSchema: {
                            type: "object",
                            properties: {
                                count: {
                                    type: "integer",
                                    description: "Number of UUIDs to generate",
                                    default: 1,
                                    minimum: 1,
                                    maximum: 100,
                                },
                                format: {
                                    type: "string",
                                    description: "UUID format",
                                    enum: ["standard", "compact"],
                                    default: "standard",
                                },
                            },
                            required: [],
                        },
                    },
                    {
                        name: "generate_random_string",
                        description: "Generate a cryptographically secure random string",
                        inputSchema: {
                            type: "object",
                            properties: {
                                length: {
                                    type: "integer",
                                    description: "Length of the random string",
                                    default: 16,
                                    minimum: 1,
                                    maximum: 256,
                                },
                                charset: {
                                    type: "string",
                                    description: "Character set to use",
                                    enum: ["alphanumeric", "alphabetic", "numeric", "hex", "base64", "ascii_printable"],
                                    default: "alphanumeric",
                                },
                                count: {
                                    type: "integer",
                                    description: "Number of random strings to generate",
                                    default: 1,
                                    minimum: 1,
                                    maximum: 100,
                                },
                            },
                            required: [],
                        },
                    },
                    {
                        name: "generate_random_choice",
                        description: "Randomly select items from a given list using cryptographically secure randomness",
                        inputSchema: {
                            type: "object",
                            properties: {
                                choices: {
                                    type: "array",
                                    description: "Array of items to choose from",
                                    items: {
                                        type: "string",
                                    },
                                    minItems: 1,
                                },
                                count: {
                                    type: "integer",
                                    description: "Number of items to select",
                                    default: 1,
                                    minimum: 1,
                                },
                                allow_duplicates: {
                                    type: "boolean",
                                    description: "Whether to allow duplicate selections",
                                    default: true,
                                },
                            },
                            required: ["choices"],
                        },
                    },
                    {
                        name: "generate_random_boolean",
                        description: "Generate cryptographically secure random boolean values",
                        inputSchema: {
                            type: "object",
                            properties: {
                                count: {
                                    type: "integer",
                                    description: "Number of random booleans to generate",
                                    default: 1,
                                    minimum: 1,
                                    maximum: 1000,
                                },
                                probability: {
                                    type: "number",
                                    description: "Probability of true (0.0 to 1.0)",
                                    default: 0.5,
                                    minimum: 0.0,
                                    maximum: 1.0,
                                },
                            },
                            required: [],
                        },
                    },
                ],
            };
        });
        // Handle tool calls
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case "generate_random_integer":
                        return await this.generateRandomInteger(args);
                    case "generate_random_float":
                        return await this.generateRandomFloat(args);
                    case "generate_random_bytes":
                        return await this.generateRandomBytes(args);
                    case "generate_uuid":
                        return await this.generateUUID(args);
                    case "generate_random_string":
                        return await this.generateRandomString(args);
                    case "generate_random_choice":
                        return await this.generateRandomChoice(args);
                    case "generate_random_boolean":
                        return await this.generateRandomBoolean(args);
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                };
            }
        });
    }
    setupPromptHandlers() {
        // List available prompts
        this.server.setRequestHandler(types_js_1.ListPromptsRequestSchema, async () => {
            return {
                prompts: [
                    {
                        name: "generate_random",
                        description: "Help me generate random values using cryptographically secure methods",
                        arguments: [
                            {
                                name: "type",
                                description: "Type of random value needed (integer, float, uuid, string, bytes, choice, boolean)",
                                required: false,
                            },
                            {
                                name: "requirements",
                                description: "Specific requirements for the random generation",
                                required: false,
                            },
                        ],
                    },
                ],
            };
        });
        // Get specific prompt
        this.server.setRequestHandler(types_js_1.GetPromptRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            if (name === "generate_random") {
                const type = args?.type || "any";
                const requirements = args?.requirements || "";
                const messages = [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: `I need to generate random values. ${requirements ? `Requirements: ${requirements}` : ""} ${type !== "any" ? `Type: ${type}` : ""}`,
                        },
                    },
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: `I'll help you generate cryptographically secure random values. As an AI, I cannot generate truly random numbers myself, but I have access to a cryptographically secure random number generator through MCP tools.

Available random generation tools:

1. **generate_random_integer** - Generate random integers within a range
2. **generate_random_float** - Generate random floating-point numbers
3. **generate_random_bytes** - Generate random bytes (hex/base64/buffer)
4. **generate_uuid** - Generate UUID v4 identifiers
5. **generate_random_string** - Generate random strings with custom character sets
6. **generate_random_choice** - Make random selections from arrays
7. **generate_random_boolean** - Generate random booleans with probability control

All randomness is generated using Node.js's crypto module, which provides cryptographically strong pseudo-random data suitable for security-sensitive applications.

What type of random value would you like me to generate?`,
                        },
                    },
                ];
                return {
                    messages,
                };
            }
            throw new Error(`Unknown prompt: ${name}`);
        });
    }
    async generateRandomInteger(args) {
        const min = args.min ?? 0;
        const max = args.max ?? 100;
        const count = args.count ?? 1;
        if (min > max) {
            throw new Error("Minimum value cannot be greater than maximum value");
        }
        if (count < 1 || count > 1000) {
            throw new Error("Count must be between 1 and 1000");
        }
        const results = [];
        for (let i = 0; i < count; i++) {
            // Use Node.js crypto.randomInt for cryptographically secure random integers
            results.push((0, crypto_1.randomInt)(min, max + 1));
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        type: "random_integers",
                        values: results,
                        parameters: { min, max, count },
                        timestamp: new Date().toISOString(),
                    }, null, 2),
                },
            ],
        };
    }
    async generateRandomFloat(args) {
        const min = args.min ?? 0.0;
        const max = args.max ?? 1.0;
        const count = args.count ?? 1;
        const precision = args.precision ?? 6;
        if (min >= max) {
            throw new Error("Minimum value must be less than maximum value");
        }
        if (count < 1 || count > 1000) {
            throw new Error("Count must be between 1 and 1000");
        }
        if (precision < 1 || precision > 15) {
            throw new Error("Precision must be between 1 and 15");
        }
        const results = [];
        for (let i = 0; i < count; i++) {
            // Generate cryptographically secure random float
            const randomBuffer = (0, crypto_1.randomBytes)(4);
            const randomValue = randomBuffer.readUInt32BE(0) / 0xFFFFFFFF;
            const scaledValue = min + (randomValue * (max - min));
            results.push(parseFloat(scaledValue.toFixed(precision)));
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        type: "random_floats",
                        values: results,
                        parameters: { min, max, count, precision },
                        timestamp: new Date().toISOString(),
                    }, null, 2),
                },
            ],
        };
    }
    async generateRandomBytes(args) {
        const length = args.length ?? 32;
        const encoding = args.encoding ?? "hex";
        if (length < 1 || length > 1024) {
            throw new Error("Length must be between 1 and 1024");
        }
        const bytes = (0, crypto_1.randomBytes)(length);
        let result;
        switch (encoding) {
            case "hex":
                result = bytes.toString("hex");
                break;
            case "base64":
                result = bytes.toString("base64");
                break;
            case "binary":
                result = bytes.toString("binary");
                break;
            default:
                throw new Error("Invalid encoding. Must be 'hex', 'base64', or 'binary'");
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        type: "random_bytes",
                        value: result,
                        parameters: { length, encoding },
                        timestamp: new Date().toISOString(),
                    }, null, 2),
                },
            ],
        };
    }
    async generateUUID(args) {
        const count = args.count ?? 1;
        const format = args.format ?? "standard";
        if (count < 1 || count > 100) {
            throw new Error("Count must be between 1 and 100");
        }
        const results = [];
        for (let i = 0; i < count; i++) {
            const uuid = (0, crypto_1.randomUUID)();
            results.push(format === "compact" ? uuid.replace(/-/g, "") : uuid);
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        type: "uuids",
                        values: results,
                        parameters: { count, format },
                        timestamp: new Date().toISOString(),
                    }, null, 2),
                },
            ],
        };
    }
    async generateRandomString(args) {
        const length = args.length ?? 16;
        const charset = args.charset ?? "alphanumeric";
        const count = args.count ?? 1;
        if (length < 1 || length > 256) {
            throw new Error("Length must be between 1 and 256");
        }
        if (count < 1 || count > 100) {
            throw new Error("Count must be between 1 and 100");
        }
        const charsets = {
            alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            alphabetic: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
            numeric: "0123456789",
            hex: "0123456789abcdef",
            base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            ascii_printable: "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
        };
        const chars = charsets[charset];
        if (!chars) {
            throw new Error(`Invalid charset: ${charset}`);
        }
        const results = [];
        for (let i = 0; i < count; i++) {
            let result = "";
            for (let j = 0; j < length; j++) {
                const randomIndex = (0, crypto_1.randomInt)(0, chars.length);
                result += chars[randomIndex];
            }
            results.push(result);
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        type: "random_strings",
                        values: results,
                        parameters: { length, charset, count },
                        timestamp: new Date().toISOString(),
                    }, null, 2),
                },
            ],
        };
    }
    async generateRandomChoice(args) {
        const choices = args.choices;
        const count = args.count ?? 1;
        const allowDuplicates = args.allow_duplicates ?? true;
        if (!Array.isArray(choices) || choices.length === 0) {
            throw new Error("Choices must be a non-empty array");
        }
        if (count < 1) {
            throw new Error("Count must be at least 1");
        }
        if (!allowDuplicates && count > choices.length) {
            throw new Error("Count cannot exceed choices length when duplicates are not allowed");
        }
        const results = [];
        const availableChoices = [...choices];
        for (let i = 0; i < count; i++) {
            const randomIndex = (0, crypto_1.randomInt)(0, availableChoices.length);
            const selected = availableChoices[randomIndex];
            results.push(selected);
            if (!allowDuplicates) {
                availableChoices.splice(randomIndex, 1);
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        type: "random_choices",
                        values: results,
                        parameters: { choices, count, allow_duplicates: allowDuplicates },
                        timestamp: new Date().toISOString(),
                    }, null, 2),
                },
            ],
        };
    }
    async generateRandomBoolean(args) {
        const count = args.count ?? 1;
        const probability = args.probability ?? 0.5;
        if (count < 1 || count > 1000) {
            throw new Error("Count must be between 1 and 1000");
        }
        if (probability < 0.0 || probability > 1.0) {
            throw new Error("Probability must be between 0.0 and 1.0");
        }
        const results = [];
        for (let i = 0; i < count; i++) {
            const randomBuffer = (0, crypto_1.randomBytes)(4);
            const randomValue = randomBuffer.readUInt32BE(0) / 0xFFFFFFFF;
            results.push(randomValue < probability);
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        type: "random_booleans",
                        values: results,
                        parameters: { count, probability },
                        timestamp: new Date().toISOString(),
                    }, null, 2),
                },
            ],
        };
    }
    setupErrorHandling() {
        this.server.onerror = (error) => {
            console.error("[MCP Error]", error);
        };
        process.on("SIGINT", async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    async run() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error("Plugged.in Random Number Generator MCP Server running on stdio");
    }
}
// Start the server
if (require.main === module) {
    const server = new RandomNumberGeneratorServer();
    server.run().catch((error) => {
        console.error("Failed to start server:", error);
        process.exit(1);
    });
}
exports.default = RandomNumberGeneratorServer;
//# sourceMappingURL=index.js.map