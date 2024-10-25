const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const chalk = require('chalk');

// Initialize the Bedrock Runtime client
const client = new BedrockRuntimeClient({ region: "us-east-1" });

async function invokeJambaMini(prompt) {
    const params = {
        modelId: "ai21.jamba-1-5-mini-v1:0",  // Using the correct model ID
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            messages: [
                {
                    role: "user",
                    content: prompt  // The modified prompt for headline generation
                }
            ],
            max_tokens: 1000,
            temperature: 0.7,
            top_p: 0.8
        })
    };

    try {
        const command = new InvokeModelCommand(params);
        const response = await client.send(command);

        const buffer = Buffer.from(response.body);
        const text = buffer.toString();
        const responseData = JSON.parse(text);

        console.log(chalk.red("\nPrompt Sent:\n"));
        console.log(chalk.blue(prompt + "\n"));
        return responseData;

    } catch (error) {
        console.error("Error invoking the model:", error);
        return null;
    }
}

const caseDescription = `
Climate change refers to long-term shifts in temperatures and weather patterns, mainly due to human activities such as burning fossil fuels. 
This process leads to global warming, rising sea levels, and more extreme weather events. While some regions may experience benefits from warmer 
temperatures, the overall impact is detrimental to ecosystems and human life.
`;

const case2 = `Dear Customer,

I hope you are doing well.

I wanted to follow up regarding the Zoom Meeting SDK upgrade from version 2.18.2 to 3.1.6. In my previous email, I shared a working demo along with the GitHub repository for the updated code. I trust you’ve had the opportunity to review and test the solution.

I’ve sent multiple follow-ups regarding this, and if there are any issues you’ve encountered or you require further assistance, please feel free to share the specifics. I’m here to help ensure the upgrade process goes smoothly.

Kindly note that if I do not hear back from you by the end of today, I will proceed to close the ticket tomorrow. Of course, if needed, you can always reopen the ticket at any point in the future.

Thank you once again for your patience and cooperation. I look forward to hearing from you soon.
`;

const prompt = `Please summarize the following content into numbered key points: ${caseDescription}`;

console.log(chalk.yellow("Please wait..."));
invokeJambaMini(prompt)
    .then(response => {
        console.log(chalk.yellow("\nGenerated Headline:\n"));
        console.log(chalk.green(response.choices[0].message.content + "\n"));  // Accessing the response
    })
    .catch(err => console.error("Invocation Error:", err));
