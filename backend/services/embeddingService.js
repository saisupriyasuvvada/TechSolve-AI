const { pipeline } = require("@xenova/transformers");

let embedder;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  return embedder;
}

async function generateEmbedding(text) {
  try {
    const extractor =
      await getEmbedder();

    const output = await extractor(
      text,
      {
        pooling: "mean",
        normalize: true,
      }
    );

    return Array.from(output.data);
  } catch (error) {
    console.error(
      "Embedding Error:",
      error
    );

    throw error;
  }
}

module.exports = {
  generateEmbedding,
};