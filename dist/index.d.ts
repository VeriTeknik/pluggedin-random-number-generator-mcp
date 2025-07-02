#!/usr/bin/env node
/**
 * State-of-the-art Random Number Generator MCP Server
 *
 * This server provides cryptographically secure random number generation
 * capabilities through the Model Context Protocol (MCP).
 */
declare class RandomNumberGeneratorServer {
    private server;
    constructor();
    private setupToolHandlers;
    private setupPromptHandlers;
    private generateRandomInteger;
    private generateRandomFloat;
    private generateRandomBytes;
    private generateUUID;
    private generateRandomString;
    private generateRandomChoice;
    private generateRandomBoolean;
    private setupErrorHandling;
    run(): Promise<void>;
}
export default RandomNumberGeneratorServer;
//# sourceMappingURL=index.d.ts.map