const Replicate = require("replicate");
const fs = require("fs");
const https = require("https");
const path = require("path");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Maak output folders
const outputDir = "./public/styles/base-faces";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Download functie
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`✅ Downloaded: ${filepath}`);
        resolve();
      });
    }).on("error", (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function generateBaseFaces() {
  console.log("🚀 Generating base AI faces...\n");

  // MANNELIJK BASIS GEZICHT - 10 variaties
  const malePrompts = [
    "Professional headshot photo of a 32 year old caucasian man with short brown hair, clean shaven, wearing white dress shirt, neutral gray background, studio lighting, high quality, sharp focus, looking at camera, friendly smile",
    "Professional headshot photo of a 32 year old caucasian man with short brown hair, clean shaven, wearing navy blue suit jacket, neutral gray background, studio lighting, high quality, sharp focus, looking at camera, confident expression",
    "Professional headshot photo of a 32 year old caucasian man with short brown hair, clean shaven, wearing light blue oxford shirt, neutral gray background, studio lighting, high quality, sharp focus, slight angle, natural smile",
    "Professional headshot photo of a 32 year old caucasian man with short brown hair, clean shaven, wearing charcoal sweater, neutral gray background, studio lighting, high quality, sharp focus, looking at camera",
    "Professional headshot photo of a 32 year old caucasian man with short brown hair, clean shaven, wearing black polo shirt, neutral gray background, studio lighting, high quality, sharp focus, friendly expression",
    "Professional portrait of a 32 year old caucasian man with short brown hair, clean shaven, wearing gray blazer, white background, soft lighting, high quality, professional photography",
    "Corporate headshot of a 32 year old caucasian man with short brown hair, clean shaven, wearing white shirt and tie, studio background, professional lighting, sharp focus",
    "Business portrait of a 32 year old caucasian man with short brown hair, clean shaven, casual navy henley shirt, neutral background, natural lighting, high quality photo",
    "Professional photo of a 32 year old caucasian man with short brown hair, clean shaven, wearing dark green polo, light gray background, studio portrait lighting",
    "Headshot of a 32 year old caucasian man with short brown hair, clean shaven, burgundy dress shirt, professional studio background, soft lighting, looking at camera"
  ];

  // VROUWELIJK BASIS GEZICHT - 10 variaties
  const femalePrompts = [
    "Professional headshot photo of a 30 year old caucasian woman with shoulder length dark brown hair, wearing white blouse, neutral gray background, studio lighting, high quality, sharp focus, looking at camera, warm smile",
    "Professional headshot photo of a 30 year old caucasian woman with shoulder length dark brown hair, wearing navy blue blazer, neutral gray background, studio lighting, high quality, sharp focus, confident expression",
    "Professional headshot photo of a 30 year old caucasian woman with shoulder length dark brown hair, wearing soft pink blouse, neutral gray background, studio lighting, high quality, sharp focus, friendly smile",
    "Professional headshot photo of a 30 year old caucasian woman with shoulder length dark brown hair, wearing black dress, neutral gray background, studio lighting, high quality, sharp focus, elegant look",
    "Professional headshot photo of a 30 year old caucasian woman with shoulder length dark brown hair, wearing cream colored sweater, neutral gray background, studio lighting, high quality, approachable expression",
    "Corporate portrait of a 30 year old caucasian woman with shoulder length dark brown hair, wearing light gray suit jacket, white background, soft lighting, professional photography",
    "Business headshot of a 30 year old caucasian woman with shoulder length dark brown hair, wearing emerald green blouse, studio background, professional lighting, sharp focus",
    "Professional photo of a 30 year old caucasian woman with shoulder length dark brown hair, wearing burgundy top, neutral background, natural lighting, warm expression",
    "Headshot of a 30 year old caucasian woman with shoulder length dark brown hair, wearing teal dress, professional studio background, soft lighting, looking at camera",
    "Portrait of a 30 year old caucasian woman with shoulder length dark brown hair, wearing white shirt, light gray background, studio lighting, natural smile"
  ];

  // Genereer mannelijke gezichten
  console.log("👨 Generating male base faces...\n");
  for (let i = 0; i < malePrompts.length; i++) {
    try {
      console.log(`Generating male face ${i + 1}/10...`);
      const output = await replicate.run(
        "black-forest-labs/flux-schnell",
        {
          input: {
            prompt: malePrompts[i],
            num_outputs: 1,
            aspect_ratio: "3:4",
            output_format: "jpg",
            output_quality: 90
          }
        }
      );
      
      if (output && output[0]) {
        await downloadImage(output[0], `${outputDir}/male-${i + 1}.jpg`);
      }
    } catch (error) {
      console.error(`Error generating male face ${i + 1}:`, error.message);
    }
  }

  // Genereer vrouwelijke gezichten
  console.log("\n👩 Generating female base faces...\n");
  for (let i = 0; i < femalePrompts.length; i++) {
    try {
      console.log(`Generating female face ${i + 1}/10...`);
      const output = await replicate.run(
        "black-forest-labs/flux-schnell",
        {
          input: {
            prompt: femalePrompts[i],
            num_outputs: 1,
            aspect_ratio: "3:4",
            output_format: "jpg",
            output_quality: 90
          }
        }
      );
      
      if (output && output[0]) {
        await downloadImage(output[0], `${outputDir}/female-${i + 1}.jpg`);
      }
    } catch (error) {
      console.error(`Error generating female face ${i + 1}:`, error.message);
    }
  }

  console.log("\n🎉 Done! Check ./public/styles/base-faces/");
}

generateBaseFaces();