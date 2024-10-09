import { SessionsClient } from "@google-cloud/dialogflow-cx";

export class ChatService {
    private client: SessionsClient

    constructor() {
        this.client = new SessionsClient({ apiEndpoint: 'us-central1-dialogflow.googleapis.com' })
    }

    async execute(text: string, sessionId: string){
        try {
            const sessionPath = this.client.projectLocationAgentSessionPath(
                process.env.PROJECT_ID || '',
                process.env.LOCAL_ID || '',
                process.env.AGENT_ID  || '',
                sessionId
            )
        
            const request = {
              session: sessionPath,
              queryInput: {
                text: { text: text },
                languageCode: 'pt-BR',
              }
            }
        
            const [response] = await this.client.detectIntent(request)
            if(!response) throw new Error("Dialogflow server didn't answer.")

              const responseTexts = response!.queryResult!.responseMessages;

              const messages: string[] = []
              
              responseTexts!.forEach(item => {
                  if (item.text) {
                      messages.push(...item!.text!.text!)
                  }
              })
            
            return { message: messages }
        } catch (error) {
            console.log('Client request failed:', error)
            throw new Error('Client request failed')
        }
    }
}