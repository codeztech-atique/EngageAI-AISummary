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
            maxTokens: 200,
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

const news = `150,000 Gaza children given second polio vaccine dose: WHO, More than 150,000 children in Gaza received the required second dose of oral polio vaccine in the first two days of the campaign's second round, the WHO chief said on Wednesday (Oct 16).

Despite continuing Israeli military operations in some areas of the Palestinian territory, the second round of a polio vaccination campaign, aiming to reach more than 590,000 children under the age of 10, began on Monday.

"The total number of children who received a second dose of polio vaccine in central Gaza after two days of vaccination is 156,943," the World Health Organization's director-general Tedros Adhanom Ghebreyesus said on X.

"The vaccination continues today. At the same time, 128,121 children received vitamin A supplements.

"We call for the humanitarian pauses to continue to be respected. We call for a ceasefire and peace," he said.

As during the initial round of vaccination last month, the second will be divided into three phases, helped by localised "humanitarian pauses" in the fighting: first in central Gaza, then in the south and finally in the hardest-to-reach north of the territory.

Each phase is due to take three campaign days, along with one catch-up day for monitoring and vaccinating any children who were missed.

The vaccination drive began after the Gaza Strip confirmed its first case of polio in 25 years. The disease has re-emerged in besieged Gaza, where the war has left most medical facilities and the sewage system in ruins.

Most often spread through sewage and contaminated water, poliovirus is highly infectious. It can cause deformities and paralysis, and is potentially fatal, mainly affecting children under the age of five.

WHO spokesman Tarik Jasarevic told reporters on Tuesday that nearly 93,000 doses had been administered in central Gaza on Monday's first day, which he said passed "without major issues".

The estimated target for the central area is over 179,000 children under 10.

"We hope that parents will keep coming," Jasarevic said.

Israel launched a military campaign in Gaza after the Oct 7, 2023, attack by Hamas resulted in the deaths of 1,206 people in Israel, mostly civilians, according to an AFP tally of official Israeli figures, including hostages killed in captivity.

`

const blog = `Zoom Meeting SDK for web
The Zoom Meeting SDK for web lets you embed the Zoom Meeting and Zoom Webinar experiences on a webpage through a highly optimized WebAssembly module. The SDK supports Angular, React, Vue.js, and other JS frameworks.

The SDK strives for feature parity with the Zoom web client, however, some features may not be available. See features supported by web browser for details.

Embed the Meeting SDK
Embed Zoom on your website using a client view that displays the SDK using the full web page or a component view that splits the client into multiple components that you can position on the page. Or embed the Meeting SDK for web in an iFrame on a webpage and in WebViews on native Android and iOS apps.

Client view
Client view provides the option to display the Meeting SDK for web as a full page. This allows for a familiar Zoom experience as the client view is similar to the Zoom web client
, except it lives inside your own web page.

Component view
The component view provides the option to display the Meeting SDK for web in components on your page. This allows for a more flexible design.

`

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
invokeJambaMini(blog)
    .then(response => {
        console.log(chalk.yellow("\nGenerated Summary with Headlines:\n"));
        console.log(chalk.green(response.completions[0].data.text + "\n"));
    })
    .catch(err => console.error("Invocation Error:", err));

