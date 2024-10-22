const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const chalk = require('chalk');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize the Bedrock Runtime client with retry options
const client = new BedrockRuntimeClient({ 
    region: "us-east-1",
    maxAttempts: 3,
    retryMode: "adaptive"
});

// Rate limiting configuration
const rateLimitConfig = {
    maxRequests: 5, // Maximum requests per interval
    interval: 60000, // Time interval in milliseconds (1 minute)
    requestQueue: [],
    lastReset: Date.now()
};

// Rate limiter function
async function rateLimiter() {
    const now = Date.now();
    
    // Reset queue if interval has passed
    if (now - rateLimitConfig.lastReset > rateLimitConfig.interval) {
        rateLimitConfig.requestQueue = [];
        rateLimitConfig.lastReset = now;
    }

    // Remove old requests from queue
    rateLimitConfig.requestQueue = rateLimitConfig.requestQueue.filter(
        timestamp => now - timestamp < rateLimitConfig.interval
    );

    // If queue is full, wait for next interval
    if (rateLimitConfig.requestQueue.length >= rateLimitConfig.maxRequests) {
        const oldestRequest = rateLimitConfig.requestQueue[0];
        const waitTime = rateLimitConfig.interval - (now - oldestRequest);
        console.log(chalk.yellow(`Rate limit reached. Waiting ${Math.ceil(waitTime/1000)} seconds...`));
        await sleep(waitTime);
        return rateLimiter(); // Retry after waiting
    }

    // Add current request to queue
    rateLimitConfig.requestQueue.push(now);
}

async function invokeHaiku(prompt, retryCount = 0) {
    const params = {
        modelId: "anthropic.claude-3-haiku-20240307-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 5000,
            messages: [{
                role: "user",
                content: prompt
            }],
            temperature: 0.5
        })
    };

    try {
        // Apply rate limiting before making request
        await rateLimiter();

        const command = new InvokeModelCommand(params);
        const response = await client.send(command);
        
        // Parse the response body
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        console.log(chalk.green("\nResponse Generated:\n"));
        console.log(chalk.green(JSON.stringify(responseBody, null, 2)));
        
        return responseBody;

    } catch (error) {
        if (error.name === 'ThrottlingException') {
            const backoffTime = Math.min(Math.pow(2, retryCount) * 1000, 32000); // Exponential backoff with max 32s
            
            if (retryCount < 5) { // Maximum 5 retry attempts
                console.log(chalk.yellow(`Throttled. Retrying in ${backoffTime/1000} seconds... (Attempt ${retryCount + 1}/5)`));
                await sleep(backoffTime);
                return invokeHaiku(prompt, retryCount + 1);
            }
        }
        
        console.error(chalk.red("Error invoking the model:"), {
            name: error.name,
            message: error.message,
            statusCode: error.$metadata?.httpStatusCode,
            requestId: error.$metadata?.requestId
        });
        throw error;
    }
}

// Helper function for formatting the prompt
function formatPrompt(prompt) {
    return `${prompt}\n\nPlease provide a clear and concise response.`;
}

async function main() {
    const prompt = "Write a code how to upload the file to s3 using nodejs";
    console.log(chalk.yellow("Generating response, please wait..."))
    
    try {
        await invokeHaiku(formatPrompt(prompt));
    } catch (error) {
        console.error(chalk.red("Failed to generate response after all retries."));
        process.exit(1);
    }
}

main();