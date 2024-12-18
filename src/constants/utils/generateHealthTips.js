// Import Firestore functions
import { fetchDocumentById, updateDocument } from '../firebaseFunctions';
import axios from 'axios'; // For making HTTP requests

// Configuration for OpenAI API
const config = {
  OPENAI_API_KEY: "",
};

const generateHealthTips = async (userId) => {
  try {
    // Fetch user-related data from Firestore
    const [userData, lifestyleData, medicalHistoryData] = await Promise.all([
      fetchDocumentById('users', userId),
      fetchDocumentById('lifestyle', userId),
      fetchDocumentById('medicalHistory', userId),
    ]);

    // Log the fetched data
    //console.log('Fetched User Data:', userData);
    //console.log('Fetched Lifestyle Data:', lifestyleData);
    //console.log('Fetched Medical History Data:', medicalHistoryData);

    // Determine today's date (formatted as YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    // Check if health tips already exist for today
    const healthTipsDoc = await fetchDocumentById('tips', userId);
    if (healthTipsDoc && healthTipsDoc.date === today) {
      console.log('Existing health tips found for today:', healthTipsDoc);
      return healthTipsDoc; // Return existing tips
    }

    // Prepare the prompt for OpenAI API
    const prompt = `
      Based on the following user data, lifestyle, and medical history, generate 7 personalized health tips:
      User Data: ${JSON.stringify(userData, null, 2)}
      Lifestyle Data: ${JSON.stringify(lifestyleData, null, 2)}
      Medical History Data: ${JSON.stringify(medicalHistoryData, null, 2)}
      Each tip should include:
      {
        "title": "Health Tip #1",
        "content": "Detailed health tip content",
        "category": "Tip Category"
      }
    `;

    console.log('Requesting OpenAI API for health tips...');
    
    // Make a request to OpenAI API
    const openAiResponse = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-3.5-turbo',
        prompt,
        max_tokens: 1000,
        temperature: 0.7,
        n: 1, // Request one completion
      },
      {
        headers: {
          'Authorization': `Bearer ${config.OPENAI_API_KEY}`,
        },
      }
    );

    // Log the raw response to debug
    console.log('OpenAI API Response:', openAiResponse.data);

    // Check the OpenAI response
    const { choices } = openAiResponse.data;
    if (!choices || choices.length === 0) {
      throw new Error('OpenAI did not return valid health tips.');
    }

    // Parse OpenAI response into structured tips
    let generatedTips;
    try {
      generatedTips = JSON.parse(choices[0].text.trim());
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse health tips.');
    }

    // Validate the parsed tips (ensure it's an array with at least one tip)
    if (!Array.isArray(generatedTips) || generatedTips.length === 0) {
      console.error('Invalid health tips format:', generatedTips);
      throw new Error('Generated health tips are in an invalid format.');
    }

    // Create a new health tips document
    const newHealthTips = {
      date: today,
      userId,
      tips: generatedTips,
    };

    // Update Firestore with the new health tips
    await updateDocument('tips', userId, newHealthTips);

    console.log('Generated and saved new health tips:', newHealthTips);
    return newHealthTips;
  } catch (error) {
    console.error('Error generating health tips:', error);

    // Provide specific guidance for common errors
    if (axios.isAxiosError(error)) {
      console.error('HTTP error while accessing OpenAI API:', error.response?.data || error.message);
    } else if (error.code === 'permission-denied') {
      console.error('Firestore permission error: Check your Firestore rules.');
    } else {
      console.error('Unexpected error:', error.message || error);
    }

    throw new Error('Failed to generate health tips. Please try again later.');
  }
};
