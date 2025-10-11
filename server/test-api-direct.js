/**
 * Direct API test using fetch to check if the key works at all
 */

import dotenv from 'dotenv';
dotenv.config();

async function testAPIKeyDirect() {
  console.log('🔍 Testing Gemini API Key with Direct HTTP Request...\n');
  
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  
  if (!apiKey) {
    console.error('❌ No API key found');
    return;
  }
  
  console.log('✅ API Key found');
  console.log(`   Preview: ${apiKey.substring(0, 20)}...\n`);
  
  // Test 1: List models
  console.log('📋 Test 1: Listing available models...\n');
  try {
    const listResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    
    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error(`❌ Status: ${listResponse.status}`);
      console.error(`   Error: ${errorText}\n`);
      
      if (listResponse.status === 400) {
        console.error('💡 Your API key appears to be invalid or malformed.');
        console.error('   Get a new key from: https://aistudio.google.com/app/apikey\n');
      } else if (listResponse.status === 403) {
        console.error('💡 Your API key might not have permission to access the API.');
        console.error('   Check your API settings at: https://console.cloud.google.com/\n');
      } else if (listResponse.status === 429) {
        console.error('💡 Rate limit or quota exceeded.');
        console.error('   Check your usage at: https://aistudio.google.com/\n');
      }
      return;
    }
    
    const data = await listResponse.json();
    console.log('✅ API Key is VALID!\n');
    console.log('📋 Available models:');
    console.log('─'.repeat(50));
    
    if (data.models && data.models.length > 0) {
      data.models.forEach(model => {
        console.log(`   • ${model.name}`);
        if (model.supportedGenerationMethods?.includes('generateContent')) {
          console.log('     ✓ Supports generateContent');
        }
      });
    } else {
      console.log('   No models found');
    }
    console.log('─'.repeat(50));
    
    // Test 2: Try generating content with first available model
    console.log('\n🎭 Test 2: Generating content...\n');
    
    const modelToUse = data.models?.find(m => 
      m.supportedGenerationMethods?.includes('generateContent')
    );
    
    if (!modelToUse) {
      console.error('❌ No models support generateContent');
      return;
    }
    
    console.log(`Using model: ${modelToUse.name}`);
    
    const generateResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/${modelToUse.name}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Say "Hello! Your API is working!"' }]
          }]
        })
      }
    );
    
    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      console.error(`❌ Generation failed: ${errorText}`);
      return;
    }
    
    const genData = await generateResponse.json();
    const responseText = genData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    console.log('✅ SUCCESS! Content generated!\n');
    console.log('📝 Response from Gemini:');
    console.log('─'.repeat(50));
    console.log(responseText);
    console.log('─'.repeat(50));
    
    console.log('\n🎉 Your Gemini API key is fully functional!\n');
    console.log('✨ To use in your code, use this model name:');
    console.log(`   model: "${modelToUse.name}"`);
    console.log('\n💡 Update your routes.js with the correct model name.\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Check your internet connection and try again.\n');
  }
}

testAPIKeyDirect();
