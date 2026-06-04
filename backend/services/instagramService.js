const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const DOWNLOAD_DIR = path.join(__dirname, "../downloads");
const { translateToEnglish } = require("./translationService");
const { chunkTranscript } = require("./chunkService");
const { generateEmbedding } = require("./embeddingService");
const { storeChunks } = require("./chromaService");

function extractReelId(url) {
    const match = url.match(/\/reel\/([^/?]+)/);
    if(!match){
        throw new Error("Invalid Instagram Reel URL");
    }

    return match[1];
}


function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {

            console.log("STDOUT:", stdout);
            console.log("STDERR:", stderr);

            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

async function downloadAudio(url, reelId) {
    try {
        const audioPath = path.join(DOWNLOAD_DIR, `${reelId}.%(ext)s`);

        const ffmpegPath = "C:\\Users\\hi\\Downloads\\ffmpeg-8.1.1-essentials_build\\ffmpeg-8.1.1-essentials_build\\bin";

        const command = `python -m yt_dlp --ffmpeg-location "${ffmpegPath}" -x --audio-format mp3 -o "${audioPath}" "${url}"`;

        await runCommand(command);

        return path.join(DOWNLOAD_DIR, `${reelId}.mp3`);
    } catch (error) {
        console.error("Download Error:", error);
        throw new Error("Failed to download audio from Instagram Reel");
    }
}

async function transcribeAudio(audioFilePath) {
    try {
        const ffmpegBin = "C:\\Users\\hi\\Downloads\\ffmpeg-8.1.1-essentials_build\\ffmpeg-8.1.1-essentials_build\\bin";

        process.env.PATH += `;${ffmpegBin}`;

        const command = `python -X utf8 -m whisper "${audioFilePath}" ` +
                        `--model base ` +
                        `--task transcribe ` +
                        `--output_dir "${DOWNLOAD_DIR}" ` +
                        `--output_format all`;

        await runCommand(command);
        console.log("Files inside downloads:",fs.readdirSync(DOWNLOAD_DIR));

        const files = fs.readdirSync(DOWNLOAD_DIR);
        console.log("Downloaded Files:", files);

        const transcriptPath = audioFilePath.replace(".mp3", ".txt");
        if(!fs.existsSync(transcriptPath)){
            throw new Error("Transcript file not found after transcription");
        }
        // if (fs.existsSync(transcriptPath)) {
        //     fs.unlinkSync(transcriptPath);
        // }
        return fs.readFileSync(transcriptPath, "utf-8");
    } catch (error) {
        console.error("Whisper Error:", error);
        throw new Error("Failed to transcribe audio");
    }
}

async function getInstagramMetadata(url) {
    const command =
        `python -m yt_dlp --dump-json "${url}"`;

    const output = await runCommand(command);
    const data = JSON.parse(output);

    const views = data.view_count || 0;
    const likes = data.like_count || 0;
    const comments = data.comment_count || 0;

    console.log("RAW INSTAGRAM DATA:");
console.log(data);
    // const engagementRate =
    //     views > 0
    //     ? (((likes + comments) / views) * 100).toFixed(2)
    //     : 0;

    // let engagementRate = 0;
    // if (views > 0) {
    //     engagementRate = (((likes + comments) / views) * 100).toFixed(2);
    // }


    function calculateEngagementRate(likes, comments, views) {
        if (!views || views === 0 ){
            return 0;
        }

        return (((likes + comments) / views) * 100).toFixed(2);
    }

    return {
        title: data.title || "",
        creator: data.uploader || "",
        views: data.view_count || data.play_count || 0,
        likes: data.like_count || 0,
        comments: data.comment_count || 0,
        engagementRate:calculateEngagementRate(
            data.like_count || 0, data.comment_count || 0, data.view_count || data.play_count || 0)
    };
}

function isEnglish(text) {
    return /^[\x00-\x7F\s.,!?'"()\-:;]+$/.test(text);
}

async function getInstagramTranscript(url) {
    try {
        const reelId = extractReelId(url);
        console.log("Reel ID:", reelId);

        console.log("Step 1: Downloading audio...");
        const audioPath = await downloadAudio(url, reelId);

        console.log("Step 2: Audio downloaded");

        console.log("Step 3: Starting Whisper...");
        const transcript = await transcribeAudio(audioPath);

        // const englishTranscript = await translateToEnglish(transcript);
        const englishTranscript = transcript;
         
        console.log("English Transcript:", englishTranscript.slice(0, 200) );

        const metadata = await getInstagramMetadata(url);
        console.log("Instagram Metadata:", metadata);

        const chunks = await chunkTranscript(englishTranscript, {
            reelId,
            title: metadata.title,
            platform: "Instagram",
            creator: metadata.creator,
            views: metadata.views,
            likes: metadata.likes,
            comments: metadata.comments,
            engagementRate: metadata.engagementRate
        });

        const embeddings = [];
        for(const chunk of chunks){
            const embedding = await generateEmbedding(chunk.pageContent);
            embeddings.push(embedding);
        }

        console.log("Before Chroma Store");

        await storeChunks(chunks, embeddings);
        console.log("Chunks Stored Successfully");

        console.log("Stored Chunks:",chunks.length);
        console.log("Stored Embeddings:",embeddings.length);

        console.log("After Chroma Store");

        console.log("Step 4: Transcript generated");

        return {
            success: true,
            platform: "instagram",
            reelId,
            transcript,
            englishTranscript,
             title: metadata.title,
    creator: metadata.creator,
    views: metadata.views,
    likes: metadata.likes,
    comments: metadata.comments,
    engagementRate: metadata.engagementRate,
            chunkStored:chunks.length
        };
    } catch (error) {
        console.error("Instagram Transcript Error:", error.message);
        throw error;
    }
}


module.exports = { getInstagramTranscript };