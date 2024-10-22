const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const chalk = require('chalk');


// Initialize the Bedrock Runtime client
const client = new BedrockRuntimeClient({ region: "us-east-1" });

async function invokeJambaMini(prompt) {
    const params = {
        modelId: "ai21.j2-mid-v1",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            prompt: `Please summarize the following text into key points and provide clear section headlines: ${prompt}`,
            maxTokens: 2000,
            temperature: 0.7,
            topP: 1,
            stopSequences: [],
            countPenalty: { scale: 0 },
            presencePenalty: { scale: 0 },
            frequencyPenalty: { scale: 0 }
        })
    };

    try {
        const command = new InvokeModelCommand(params);
        const response = await client.send(command);

        const buffer = Buffer.from(response.body);
        const text = buffer.toString();
        const responseData = JSON.parse(text);

        // console.log("Response:", responseData);
        console.log(chalk.red("\nQuestion Asked:\n"));
        console.log(chalk.blue(prompt+"\n"))
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
`


console.log(chalk.yellow("Please wait..."))
invokeJambaMini(case2)
    .then(response => {
        console.log(chalk.yellow("\nGenerated Summary with Headlines:\n"));
        console.log(chalk.green(response.completions[0].data.text + "\n"));
    })
    .catch(err => console.error("Invocation Error:", err));

