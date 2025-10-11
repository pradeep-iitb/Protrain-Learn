/**
 * Simple Gemini API test - Lists available models and tests basic functionality
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testGemini() {
  console.log('🔍 Testing Gemini API Key...\n');
  
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    return;
  }
  
  console.log('✅ API Key found');
  console.log(`   Preview: ${apiKey.substring(0, 20)}...\n`);
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different model versions
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'models/gemini-pro',
      'models/gemini-1.5-pro'
    ];
    
    console.log('🔄 Trying different model versions...\n');
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ SUCCESS with ${modelName}!\n`);
        console.log('📝 Response:');
        console.log('─'.repeat(50));
        console.log(text);
        console.log('─'.repeat(50));
        console.log('\n🎉 Your Gemini API key is working!\n');
        console.log(`✨ Use model: "${modelName}" in your app\n`);
        
        // Test a collection scenario
        console.log('🎭 Testing collection scenario...\n');
        const scenarioResult = await model.generateContent(
          'You are a consumer who owes debt. A collector says "Hello". Respond briefly (under 20 words).'
        );
        const scenarioText = scenarioResult.response.text();
        console.log('Response:', scenarioText);
        console.log('\n✅ All tests passed!\n');
        
        return;
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message.split('\n')[0]}\n`);
      }
    }
    
    console.error('\n❌ All model versions failed.');
    console.error('\n💡 Possible issues:');
    console.error('   1. API key might be invalid');
    console.error('   2. No internet connection');
    console.error('   3. API quota exceeded');
    console.error('\n🔗 Get a new key: https://aistudio.google.com/app/apikey\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testGemini();
