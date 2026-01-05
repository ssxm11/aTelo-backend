// src/routes/ai.routes.ts
import { Router } from 'express';
import axios from 'axios';
import { User } from '../models/User';
import { CheckIn } from '../models/CeckIn';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/check-in', protect, async (req, res) => {
  const { message } = req.body;
  const userId = req.user!.id;
  
  console.log('API KEY exists:', !!process.env.AIML_API_KEY);


  try {
    const aiRes = await axios.post(
      'https://api.aimlapi.com/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `
You are an assistant that performs a brief emotional check-in.

Based on the user's message, you must return a JSON object
with exactly two fields:

{
  "feeling": boolean,
  "diagnosis": string
}

Rules:

- "feeling" represents whether the person is emotionally able
  to work, study, or make progress today.
- "diagnosis" must be ONE of the following values only:
  calm, motivated, tired, overwhelmed, foggy

Return "feeling: false" if the message shows:
- emotional exhaustion
- anxiety or overwhelm
- sadness or emotional pain
- confusion or mental fog
- strong resistance to working

Return "feeling: true" if the message shows:
- emotional stability
- calm motivation
- neutrality or mild tiredness without distress

If the message is ambiguous, default to:
{
  "feeling": false,
  "diagnosis": "foggy"
}

Do not give advice.
Do not explain.
Do not add extra text.
Only return valid JSON.

            `
          },
          {
            role: 'user',
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AIML_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(' AI RAW RESPONSE:', JSON.stringify(aiRes.data, null, 2));
    if (!aiRes.data?.choices?.length) {
        console.error('❌ AI response has no choices');
      return res.status(500).json({ message: 'Invalid AI response' });
}
const result = JSON.parse(
  aiRes.data.choices[0].message.content
);

const { feeling, diagnosis } = result;

// actualizar resumen en User
await User.findByIdAndUpdate(userId, {
  feeling
});

// guardar evento
await CheckIn.create({
  userId,
  feeling,
  diagnosis
});

res.json({ feeling, diagnosis });


    
  } catch (err: any) {
  console.error('❌ AI CHECK-IN ERROR');
  
  if (err.response) {
    console.error('Status:', err.response.status);
    console.error('Data:', err.response.data);
  } else {
    console.error(err);
  }

  res.status(500).json({ message: 'AI check failed' });
}

});

export default router;
