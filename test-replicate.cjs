const Replicate = require('replicate')
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

async function test() {
  try {
    const account = await replicate.request('/account')
    console.log('✅ Account info:', account)
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}
test()
