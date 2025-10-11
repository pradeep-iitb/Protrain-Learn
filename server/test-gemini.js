/**
 * Test script to verify Gemini API key is working
 * Run with: node test-gemini.js
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testGeminiAPI() {
  console.log('🔍 Testing Gemini API Key...\n');
  
  // Check if API key exists
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    return false;
  }
  
  console.log('✅ API Key found in .env');
  console.log(`   Key preview: ${apiKey.substring(0, 20)}...`);
  console.log();
  
  // Initialize Gemini
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    console.log('📡 Sending test request to Gemini API...');
    
    const prompt = 'Say "Hello! Your Gemini API is working correctly!" in a friendly way.';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('\n✅ SUCCESS! Gemini API is working!\n');
    console.log('📝 Response from Gemini:');
    console.log('─'.repeat(50));
    console.log(text);
    console.log('─'.repeat(50));
    console.log();
    
    // Test with a collection scenario
    console.log('🎭 Testing with a collection scenario...\n');
    const scenarioPrompt = `You are a consumer named John who owes $500 in toll debt. 
    You are feeling anxious about the debt but want to resolve it. 
    A debt collector just said: "Hello, is this John?"
    
    Respond naturally in under 30 words as this character.`;
    
    const scenarioResult = await model.generateContent(scenarioPrompt);
    const scenarioResponse = await scenarioResult.response;
    const scenarioText = scenarioResponse.text();
    
    console.log('✅ Scenario Test Success!');
    console.log('📝 John\'s Response:');
    console.log('─'.repeat(50));
    console.log(scenarioText);
    console.log('─'.repeat(50));
    console.log();
    
    console.log('🎉 All tests passed! Your Gemini API key is fully functional!\n');
    console.log('💡 You can now use:');
    console.log('   - Lesson 3: AI-powered conversations');
    console.log('   - Trainer page: AI evaluations');
    console.log('   - All AI features in the app');
    console.log();
    
    return true;
    
  } catch (error) {
    console.error('\n❌ ERROR: Gemini API test failed!\n');
    
    if (error.message.includes('API key')) {
      console.error('🔑 Issue: Invalid API Key');
      console.error('   Your API key may be incorrect or expired.');
      console.error('   Get a new key from: https://aistudio.google.com/app/apikey');
    } else if (error.message.includes('quota')) {
      console.error('📊 Issue: Quota Exceeded');
      console.error('   You may have exceeded your API quota.');
      console.error('   Check your usage at: https://aistudio.google.com/');
    } else if (error.message.includes('blocked')) {
      console.error('🚫 Issue: Request Blocked');
      console.error('   Content may have been blocked by safety settings.');
    } else {
      console.error('⚠️  Error details:', error.message);
    }
    
    console.error('\n📖 Troubleshooting:');
    console.error('   1. Check your .env file has the correct key');
    console.error('   2. Verify the key at https://aistudio.google.com/app/apikey');
    console.error('   3. Ensure you have internet connection');
    console.error('   4. Check if API is enabled for your project\n');
    
    return false;
  }
}

// Run the test
testGeminiAPI()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
