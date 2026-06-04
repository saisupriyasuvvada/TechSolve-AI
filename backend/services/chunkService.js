const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

async function chunkTranscript(transcript, metadata) {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    
    const documents = await textSplitter.createDocuments([transcript], [metadata]);
    documents.forEach((doc) => {
        if(doc.metadata.loc){
            delete doc.metadata.loc;
        }
    });

    return documents;
}
 
module.exports = {
    chunkTranscript,
};