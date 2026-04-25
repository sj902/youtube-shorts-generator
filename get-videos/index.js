const { createClient } = require('pexels');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const apiKey = process.env.PEXELS_API_KEY;
if (!apiKey) {
    console.error('Missing PEXELS_API_KEY env var. Get one at https://www.pexels.com/api/');
    process.exit(1);
}

const client = createClient(apiKey);

const tags = (process.env.YT_TAGS || 'diwali,holi').split(',').map(t => t.trim()).filter(Boolean);
const perPage = Number(process.env.YT_PER_PAGE || 10);
const outDir = path.resolve(__dirname, '..', 'video');

fs.mkdirSync(outDir, { recursive: true });

const getRandomInt = (max) => Math.floor(Math.random() * max) + 1;

const download = (url, filename) =>
    axios({ url, responseType: 'stream' }).then(
        response =>
            new Promise((resolve, reject) => {
                response.data
                    .pipe(fs.createWriteStream(filename))
                    .on('finish', resolve)
                    .on('error', reject);
            })
    );

const query = tags[Math.floor(Math.random() * tags.length)];
const page = getRandomInt(10);

console.log(`query: ${query}, page: ${page}`);

client.videos
    .search({ query, per_page: perPage, page, orientation: 'portrait' })
    .then(({ videos }) => {
        videos.forEach((video, idx) => {
            const filename = path.join(
                outDir,
                `${query}-${idx}-${Math.floor(Math.random() * 10000)}.mp4`
            );
            const file = video.video_files.reduce((a, b) => (a.height > b.height ? a : b));

            if (file.height > file.width) {
                console.log(file.link);
                download(file.link, filename)
                    .then(() => console.log(`saved ${filename}`))
                    .catch(err => console.error(`failed ${filename}: ${err.message}`));
            }
        });
    })
    .catch(err => {
        console.error(`search failed: ${err.message}`);
        process.exit(1);
    });
