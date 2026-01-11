import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

console.log('Testing Replicate SDK...')
console.log('Version:', await import('replicate/package.json').then(m => m.version))

try {
  const training = await replicate.trainings.create({
    model: "ostris/flux-dev-lora-trainer",
    version: "e440909d3512c31646ee2e0c7d6f6f4923224863a6a10c494606e79fb5844497",
    destination: "test-model",
    input: {
      steps: 10,
      input_images: "https://example.com/test.jpg"
    }
  })
  console.log('SUCCESS:', training.id)
} catch (error) {
  console.error('ERROR:', error.message)
}
