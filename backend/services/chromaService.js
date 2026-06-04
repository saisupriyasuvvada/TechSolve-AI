const { ChromaClient } = require('chromadb');

const client = new ChromaClient({
    // path: "http://localhost:8000",
    host:"localhost",
    port: 8000,
});

let collection = null;

async function getCollection() {
    if (!collection) {
        collection = await client.getOrCreateCollection({name : "video_transcripts_v2",metadata: {"hnsw:space":"cosine"}});
        console.log("Chroma collection initialized");
    }
    return collection;
}


async function storeChunks(chunks, embeddings){
    const collection = await getCollection();
    console.log("Documents being stored:");
    console.log(chunks.map(chunk => chunk.pageContent));
    console.log(chunks.map(chunk => chunk.metadata.platform));
    await collection.upsert({
        ids: chunks.map((chunk , index) => `${chunk.metadata.videoId || chunk.metadata.reelId}_${index}`),
        documents: chunks.map(chunk => chunk.pageContent),
        embeddings: embeddings,
        metadatas: chunks.map(chunk => ({
            videoId: chunk.metadata.videoId || null,
            reelId: chunk.metadata.reelId || null,
            title: String(chunk.metadata.title || "" ),
            creator: String(chunk.metadata.creator || ""),
            engagementRate: Number(chunk.metadata.engagementRate || 0),
            views: Number(chunk.metadata.views || 0),
            likes: Number(chunk.metadata.likes || 0),
            comments: Number(chunk.metadata.comments || 0),
            platform: chunk.metadata.platform
        })),
    });
    return true;
}

// async function searchChunks(queryEmbedding,platform, contentId, topK = 5) {
//     const collection = await getCollection();

//     let queryOptions = {
//         queryEmbeddings: [queryEmbedding],
//         nResults: topK
//     };

//     if (platform && reelId) {
//         queryOptions.where = {
//             $and: [
//                 { platform: platform },
//                 { reelId: reelId }
//             ]
//         };
//     }
//     else if (platform) {
//         queryOptions.where = {
//             platform: platform
//         };
//     }

//     return await collection.query(queryOptions);

//     // const results = await collection.query({
//     //     queryEmbeddings: [queryEmbedding],
//     //     nResults: topK,
//     //     where: {
//     //         $and: [
//     //             { platform: platform },
//     //             { reelId: reelId }
//     //         ]
//     //     }
//     // });

//     // return results;
// }


async function searchChunks(
  queryEmbedding,
  platform,
  contentId,
  topK = 5
) {

  const collection =
    await getCollection();

  let queryOptions = {

    queryEmbeddings: [
      queryEmbedding
    ],

    nResults: 10
  };

  // For chatbot asking about BOTH videos
  if (
    platform === "Both" ||
    !platform 
  ) {

    return await collection.query(
      queryOptions
    );
  }

  // For individual video filtering
  queryOptions.where = {
    platform: platform
  };

  return await collection.query({
  ...queryOptions,
  include: [
    "documents",
    "metadatas",
    "distances"
  ]
});
}

async function checkDocuments() {

  const collection =
    await getCollection();

  const results =
    await collection.get();

  console.log("\n========== CHROMA DATA ==========\n");

  console.log("IDS:");
  console.log(results.ids);

  console.log("\nMETADATA:");
  console.log(results.metadatas);

  console.log("\n===============================\n");
}

async function resetCollection() {

  try {

    await client.deleteCollection({
      name: "video_transcripts_v2"
    });

    console.log("Collection Deleted");

  } catch (error) {

    console.log(
      "Collection does not exist. Skipping delete."
    );

  }
}

module.exports = {
    getCollection,
    storeChunks,
    searchChunks,
    checkDocuments,
    resetCollection
};