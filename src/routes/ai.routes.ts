// src/routes/ai.routes.ts
import { Router } from 'express';
import axios from 'axios';
import { User } from '../models/User';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/check-in', protect, async (req, res) => {
  const { message } = req.body;
  const userId = req.user!.id;

  try {
    const aiRes = await axios.post(
      'https://api.aimlapi.com/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `
You are an assistant whose only task is to decide whether a person
is emotionally able to work, study, or make progress today.

Based on the user's message, return ONLY one word:
true or false.

Return false if the message shows:
- emotional exhaustion
- anxiety or overwhelm
- lack of sleep
- sadness, distress, or emotional pain
- strong resistance or aversion to working
- confusion or mental fog

Return true if the message shows:
- emotional stability
- calm motivation
- neutrality or mild tiredness without distress
- willingness to try, even slowly

If the message is ambiguous or unclear, default to false.

Do not give advice.
Do not explain your decision.
Do not output anything other than true or false.
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

    const content =
      aiRes.data.choices[0].message.content.trim().toLowerCase();

    const canProceed = content === 'true';
    await User.findByIdAndUpdate(userId, {
      feeling: canProceed
    });
    res.json({
      canProceed: content.includes('true')
    });

    
  } catch (err) {
    res.status(500).json({ message: 'AI check failed' });
  }
});

export default router;
