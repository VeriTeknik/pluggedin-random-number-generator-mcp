#!/usr/bin/env node

const { spawn } = require('child_process');
const { randomBytes } = require('crypto');

/**
 * Test script for the Random Number Generator MCP Server
 * 
 * This script tests the MCP server by sending JSON-RPC requests
 * and validating the responses.
 */

class MCPTester {
  constructor() {
    this.testResults = [];
    this.serverProcess = null;
  }

  async runTests() {
    console.log('🧪 Starting MCP Server Tests...\n');
    
    try {
      await this.startServer();
      await this.runTestSuite();
      await this.stopServer();
      
      this.printResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      if (this.serverProcess) {
        this.serverProcess.kill();
      }
      process.exit(1);
    }
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      console.log('🚀 Starting MCP server...');
      
      this.serverProcess = spawn('node', ['dist/index.js'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: process.cwd()
      });

      this.serverProcess.stderr.on('data', (data) => {
        const message = data.toString();
        if (message.includes('running on stdio')) {
          console.log('✅ Server started successfully\n');
          resolve();
        }
      });

      this.serverProcess.on('error', (error) => {
        reject(new Error(`Failed to start server: ${error.message}`));
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        reject(new Error('Server startup timeout'));
      }, 5000);
    });
  }

  async stopServer() {
    if (this.serverProcess) {
      this.serverProcess.kill();
      console.log('🛑 Server stopped\n');
    }
  }

  async sendRequest(method, params = {}) {
    return new Promise((resolve, reject) => {
      const request = {
        jsonrpc: '2.0',
        id: Math.floor(Math.random() * 1000000),
        method,
        params
      };

      const requestStr = JSON.stringify(request) + '\n';
      
      let responseData = '';
      
      const onData = (data) => {
        responseData += data.toString();
        
        // Check if we have a complete JSON response
        try {
          const lines = responseData.split('\n').filter(line => line.trim());
          for (const line of lines) {
            const response = JSON.parse(line);
            if (response.id === request.id) {
              this.serverProcess.stdout.removeListener('data', onData);
              resolve(response);
              return;
            }
          }
        } catch (e) {
          // Not a complete JSON yet, continue waiting
        }
      };

      this.serverProcess.stdout.on('data', onData);
      
      // Send the request
      this.serverProcess.stdin.write(requestStr);
      
      // Timeout after 3 seconds
      setTimeout(() => {
        this.serverProcess.stdout.removeListener('data', onData);
        reject(new Error(`Request timeout for ${method}`));
      }, 3000);
    });
  }

  async runTestSuite() {
    // Test 1: List tools
    await this.testListTools();
    
    // Test 2: Generate random integers
    await this.testRandomIntegers();
    
    // Test 3: Generate random floats
    await this.testRandomFloats();
    
    // Test 4: Generate random bytes
    await this.testRandomBytes();
    
    // Test 5: Generate UUIDs
    await this.testUUIDs();
    
    // Test 6: Generate random strings
    await this.testRandomStrings();
    
    // Test 7: Generate random choices
    await this.testRandomChoices();
    
    // Test 8: Generate random booleans
    await this.testRandomBooleans();
    
    // Test 9: Error handling
    await this.testErrorHandling();
  }

  async testListTools() {
    try {
      console.log('📋 Testing list tools...');
      const response = await this.sendRequest('tools/list');
      
      if (response.error) {
        throw new Error(`List tools failed: ${response.error.message}`);
      }
      
      const tools = response.result.tools;
      const expectedTools = [
        'generate_random_integer',
        'generate_random_float', 
        'generate_random_bytes',
        'generate_uuid',
        'generate_random_string',
        'generate_random_choice',
        'generate_random_boolean'
      ];
      
      for (const expectedTool of expectedTools) {
        const found = tools.find(tool => tool.name === expectedTool);
        if (!found) {
          throw new Error(`Tool ${expectedTool} not found in tools list`);
        }
      }
      
      this.addTestResult('List Tools', true, `Found ${tools.length} tools`);
    } catch (error) {
      this.addTestResult('List Tools', false, error.message);
    }
  }

  async testRandomIntegers() {
    try {
      console.log('🔢 Testing random integers...');
      const response = await this.sendRequest('tools/call', {
        name: 'generate_random_integer',
        arguments: { min: 1, max: 100, count: 5 }
      });
      
      if (response.error) {
        throw new Error(`Random integers failed: ${response.error.message}`);
      }
      
      const result = JSON.parse(response.result.content[0].text);
      
      if (result.values.length !== 5) {
        throw new Error(`Expected 5 values, got ${result.values.length}`);
      }
      
      for (const value of result.values) {
        if (value < 1 || value > 100) {
          throw new Error(`Value ${value} out of range [1, 100]`);
        }
      }
      
      this.addTestResult('Random Integers', true, `Generated ${result.values.length} integers in range [1, 100]`);
    } catch (error) {
      this.addTestResult('Random Integers', false, error.message);
    }
  }

  async testRandomFloats() {
    try {
      console.log('🔢 Testing random floats...');
      const response = await this.sendRequest('tools/call', {
        name: 'generate_random_float',
        arguments: { min: 0.0, max: 1.0, count: 3, precision: 4 }
      });
      
      if (response.error) {
        throw new Error(`Random floats failed: ${response.error.message}`);
      }
      
      const result = JSON.parse(response.result.content[0].text);
      
      if (result.values.length !== 3) {
        throw new Error(`Expected 3 values, got ${result.values.length}`);
      }
      
      for (const value of result.values) {
        if (value < 0.0 || value >= 1.0) {
          throw new Error(`Value ${value} out of range [0.0, 1.0)`);
        }
      }
      
      this.addTestResult('Random Floats', true, `Generated ${result.values.length} floats in range [0.0, 1.0)`);
    } catch (error) {
      this.addTestResult('Random Floats', false, error.message);
    }
  }

  async testRandomBytes() {
    try {
      console.log('🔐 Testing random bytes...');
      const response = await this.sendRequest('tools/call', {
        name: 'generate_random_bytes',
        arguments: { length: 16, encoding: 'hex' }
      });
      
      if (response.error) {
        throw new Error(`Random bytes failed: ${response.error.message}`);
      }
      
      const result = JSON.parse(response.result.content[0].text);
      
      if (result.value.length !== 32) { // 16 bytes = 32 hex characters
        throw new Error(`Expected 32 hex characters, got ${result.value.length}`);
      }
      
      if (!/^[0-9a-f]+$/i.test(result.value)) {
        throw new Error('Invalid hex encoding');
      }
      
      this.addTestResult('Random Bytes', true, `Generated ${result.parameters.length} bytes as hex`);
    } catch (error) {
      this.addTestResult('Random Bytes', false, error.message);
    }
  }

  async testUUIDs() {
    try {
      console.log('🆔 Testing UUIDs...');
      const response = await this.sendRequest('tools/call', {
        name: 'generate_uuid',
        arguments: { count: 2, format: 'standard' }
      });
      
      if (response.error) {
        throw new Error(`UUIDs failed: ${response.error.message}`);
      }
      
      const result = JSON.parse(response.result.content[0].text);
      
      if (result.values.length !== 2) {
        throw new Error(`Expected 2 UUIDs, got ${result.values.length}`);
      }
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      for (const uuid of result.values) {
        if (!uuidRegex.test(uuid)) {
          throw new Error(`Invalid UUID format: ${uuid}`);
        }
      }
      
      this.addTestResult('UUIDs', true, `Generated ${result.values.length} valid UUIDs`);
    } catch (error) {
      this.addTestResult('UUIDs', false, error.message);
    }
  }

  async testRandomStrings() {
    try {
      console.log('🔤 Testing random strings...');
      const response = await this.sendRequest('tools/call', {
        name: 'generate_random_string',
        arguments: { length: 10, charset: 'alphanumeric', count: 2 }
      });
      
      if (response.error) {
        throw new Error(`Random strings failed: ${response.error.message}`);
      }
      
      const result = JSON.parse(response.result.content[0].text);
      
      if (result.values.length !== 2) {
        throw new Error(`Expected 2 strings, got ${result.values.length}`);
      }
      
      for (const str of result.values) {
        if (str.length !== 10) {
          throw new Error(`Expected length 10, got ${str.length}`);
        }
        if (!/^[A-Za-z0-9]+$/.test(str)) {
          throw new Error(`Invalid alphanumeric string: ${str}`);
        }
      }
      
      this.addTestResult('Random Strings', true, `Generated ${result.values.length} alphanumeric strings`);
    } catch (error) {
      this.addTestResult('Random Strings', false, error.message);
    }
  }

  async testRandomChoices() {
    try {
      console.log('🎯 Testing random choices...');
      const choices = ['apple', 'banana', 'cherry', 'date'];
      const response = await this.sendRequest('tools/call', {
        name: 'generate_random_choice',
        arguments: { choices, count: 3, allow_duplicates: true }
      });
      
      if (response.error) {
        throw new Error(`Random choices failed: ${response.error.message}`);
      }
      
      const result = JSON.parse(response.result.content[0].text);
      
      if (result.values.length !== 3) {
        throw new Error(`Expected 3 choices, got ${result.values.length}`);
      }
      
      for (const choice of result.values) {
        if (!choices.includes(choice)) {
          throw new Error(`Invalid choice: ${choice}`);
        }
      }
      
      this.addTestResult('Random Choices', true, `Selected ${result.values.length} items from choices`);
    } catch (error) {
      this.addTestResult('Random Choices', false, error.message);
    }
  }

  async testRandomBooleans() {
    try {
      console.log('✅ Testing random booleans...');
      const response = await this.sendRequest('tools/call', {
        name: 'generate_random_boolean',
        arguments: { count: 10, probability: 0.5 }
      });
      
      if (response.error) {
        throw new Error(`Random booleans failed: ${response.error.message}`);
      }
      
      const result = JSON.parse(response.result.content[0].text);
      
      if (result.values.length !== 10) {
        throw new Error(`Expected 10 booleans, got ${result.values.length}`);
      }
      
      for (const value of result.values) {
        if (typeof value !== 'boolean') {
          throw new Error(`Expected boolean, got ${typeof value}`);
        }
      }
      
      this.addTestResult('Random Booleans', true, `Generated ${result.values.length} boolean values`);
    } catch (error) {
      this.addTestResult('Random Booleans', false, error.message);
    }
  }

  async testErrorHandling() {
    try {
      console.log('⚠️  Testing error handling...');
      
      // Test invalid tool name
      const response = await this.sendRequest('tools/call', {
        name: 'invalid_tool',
        arguments: {}
      });
      
      if (!response.error && !response.result.content[0].text.includes('Error:')) {
        throw new Error('Expected error for invalid tool name');
      }
      
      this.addTestResult('Error Handling', true, 'Properly handles invalid tool names');
    } catch (error) {
      this.addTestResult('Error Handling', false, error.message);
    }
  }

  addTestResult(testName, passed, message) {
    this.testResults.push({ testName, passed, message });
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}: ${message}\n`);
  }

  printResults() {
    console.log('📊 Test Results Summary:');
    console.log('========================\n');
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    
    for (const result of this.testResults) {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${result.testName}: ${result.message}`);
    }
    
    console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! The MCP server is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the implementation.');
      process.exit(1);
    }
  }
}

// Run the tests
const tester = new MCPTester();
tester.runTests().catch(console.error);

